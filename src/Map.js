import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import { extent } from 'd3';
import { scaleQuantile } from 'd3-scale';
import mapStyle from './Mapbox/style.json';
import './Map.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoidndhcmQiLCJhIjoiY2pmbjdqY3BxMTRsbzJ4bmFlbjdxcnlzNyJ9.YEUuGQyTt3gUswT1zTUQJQ';

const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compareTracts: [],
      legend: [],
    };
    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    this.fillMapColor = this.fillMapColor.bind(this);
  }
  componentDidMount = () => {
    const { hiGeoJson, selectedMapVar } = this.props;
    if (hiGeoJson && hiGeoJson.features) {
      const values = this.getSelectedVarValues(selectedMapVar, hiGeoJson);
      this.map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [-157.9174, 20.2893],
        zoom: 6,
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.addCensusTractLayer(this.map, hiGeoJson);
        this.fillMapColor(values, selectedMapVar);
      });
      const popup = this.popup;
      const setTooltipInfo = (e) => this.setTooltipInfo(e, selectedMapVar, popup, this.map);
      this.map.on('mousemove', 'census-tracts', function (e) {
        setTooltipInfo(e, selectedMapVar, popup, this);
      });
      this.map.on('mouseleave', 'census-tracts', () => {
        popup.remove();
      });
      const selectTractForComparison = e => this.selectTractForComparison(e, this.map, this.state.compareTracts);
      const highlightSelectedTracts = () => this.highlightSelectedTracts(this.map, this.state.compareTracts);
      this.map.on('click', 'census-tracts', (e) => {
        selectTractForComparison(e.features[0], this.map, this.state.compareTracts);
        highlightSelectedTracts(this.map, this.state.compareTracts);
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.hiGeoJson.features && this.props !== prevProps) {
      const values = this.getSelectedVarValues(this.props.selectedMapVar, this.props.hiGeoJson);
      this.fillMapColor(values, this.props.selectedMapVar);
      const popup = this.popup;
      const selectedMapVar = this.props.selectedMapVar;
      const setTooltipInfo = (e) => this.setTooltipInfo(e, selectedMapVar, popup, this.map);
      this.map.on('mousemove', 'census-tracts', function (e) {
        setTooltipInfo(e, selectedMapVar, popup, this);
      });
    }
  }

  setTooltipInfo = (e, mapVar, popup, map) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['census-tracts'],
    });
    const coordinates = e.lngLat;
    const { properties } = e.features[0];
    const tooltipInfo = `${mapVar.replace(/_/g, ' ')}: ${properties[mapVar].toLocaleString()}`;
    const tractName = `<b style="font-weight:bold;">${properties.census_tra}, ${properties.census_t_1}</b>`;
    if (features.length) {
      popup
        .setLngLat(coordinates)
        .setHTML(`${tractName}<br>${tooltipInfo}`)
        .addTo(map);
    } else {
      popup.remote();
    }
  }

  getSelectedVarValues = (selectedVar, geoJson) => {
    return geoJson.features
      .map(ct => ct.properties[selectedVar])
      .filter(v => v !== 'N/A')
      .sort((a, b) => a - b);
  }

  addCensusTractLayer = (map, geoJson) => {
    // Find layer with place names
    const layers = map.getStyle().layers;
    const symbolLayer = layers.find(l => l.type === 'symbol').id;
    map.addSource('tracts', {
      type: 'geojson',
      data: geoJson,
    });
    map.addLayer(
      {
        id: 'census-tracts',
        type: 'fill',
        source: 'tracts',
      },
      // Add symbolLayer after census-tracts, so labels are placed above fill layer
      symbolLayer,
    );
  };

  fillMapColor = (values, selectedMapVar) => {
    // Calculate quintile stops
    let stops = [0];
    const colorDomain = extent(values);
    const colorRange = scaleQuantile()
      .domain(colorDomain)
      .range(colors);
    colorRange.quantiles().forEach((quantile, index) => {
      stops.push(Math.floor(quantile));
    });
    if (!values.length) {
      stops = [0, 0, 0, 0, 0];
    }
    const fill = stops.map((stop, index) => [stop, colors[index]]);
    this.map.setPaintProperty('census-tracts', 'fill-color', {
      property: selectedMapVar,
      stops: fill,
    });
    this.setState({
      legend: fill,
    });
    this.map.setPaintProperty('census-tracts', 'fill-opacity', values.length ? 1 : 0.5);
  };

  highlightSelectedTracts = (map, compareTracts) => {
    if (typeof this.map.getLayer('selectedTracts') !== 'undefined') {
      this.map.getSource('selectedTracts').setData({
        type: 'FeatureCollection',
        features: compareTracts,
      });
      return;
    }
    map.addSource('selectedTracts', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: compareTracts,
      },
    });
    map.addLayer({
      id: 'selectedTracts',
      source: 'selectedTracts',
      type: 'line',
      paint: {
        'line-color': '#F6A01B',
        'line-width': 2,
      },
    });
  };

  selectTractForComparison = (selectedTract, map, compareTracts) => {
    const tracts = compareTracts;
    const countyFP = selectedTract.properties.COUNTYFP;
    const tractce = selectedTract.properties.TRACTCE;
    const exist = tracts.findIndex(
      ct =>
        ct.properties.COUNTYFP === countyFP && ct.properties.TRACTCE === tractce
    );
    if (exist > -1) {
      tracts.splice(exist, 1);
      this.setState({ compareTracts: tracts });
      this.props.onUpdateCompare(tracts);
      return;
    }
    if (exist === -1 && tracts.length < 2) {
      tracts.push(selectedTract);
      this.setState({ compareTracts: tracts });
      this.props.onUpdateCompare(tracts);
      return;
    }
    if (exist === -1 && tracts.length >= 2) {
      tracts.splice(0, 1);
      tracts.push(selectedTract);
      this.setState({ compareTracts: tracts });
      this.props.onUpdateCompare(tracts);
    }
  };

  render = () => {
    const style = {
      height: 500,
      marginBottom: '15px',
      width: '100%',
    };
    const { legend } = this.state;
    return (
      <div id="map-container">
        <div id="map" style={style} />
        <div id="legend">
          {legend.map((stop, index) => (
            <div key={index}>
              <span
                className="legend-color"
                style={{ backgroundColor: stop[1] }}
              />
              <span className="legend-value">{`${stop[0].toLocaleString()}`}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
}

Map.propTypes = {
  hiGeoJson: PropTypes.object,
  selectedMapVar: PropTypes.string,
};

export default Map;
