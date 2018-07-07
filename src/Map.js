import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import { extent } from 'd3';
import { scaleQuantile } from 'd3-scale';
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
    this.fillMapColor = this.fillMapColor.bind(this);
  }
  componentDidMount = () => {
    const { hiGeoJson, acsVars, selectedMapVar } = this.props;
    if (hiGeoJson.features) {
      const values = this.getSelectedVarValues(selectedMapVar, hiGeoJson);
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/vward/cjj95ohpl18lt2qlmdn68bwyl',
        center: [-157.9174, 20.2893],
        zoom: 6,
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.addCensusTractLayer(this.map, hiGeoJson);
        this.fillMapColor(values, selectedMapVar);
      });
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      this.map.on('mousemove', 'census-tracts', function (e) {
        const features = this.queryRenderedFeatures(e.point, {
          layers: ['census-tracts'],
        });
        const coordinates = e.lngLat;
        const { properties } = e.features[0];
        let tooltipInfo = '';
        Object.values(acsVars).forEach(
          v => { tooltipInfo += `${v.replace(/_/g, ' ')}: ${properties[v].toLocaleString()}<br>`; }
        );
        const tractName = `<b style="font-weight:bold;">${properties.census_tra}, ${properties.census_t_1}</b>`;
        if (features.length) {
          popup
            .setLngLat(coordinates)
            .setHTML(`${tractName}<br>${tooltipInfo}`)
            .addTo(this);
        } else {
          popup.remove();
        }
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
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.hiGeoJson.features) {
      const values = this.getSelectedVarValues(nextProps.selectedMapVar, nextProps.hiGeoJson);
      this.fillMapColor(values, nextProps.selectedMapVar);
    }
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
  }

  getSelectedVarValues = (selectedVar, geoJson) => {
    return geoJson.features
      .map(ct => ct.properties[selectedVar])
      .filter(v => v !== 'N/A')
      .sort((a, b) => a - b);
  }

  fillMapColor = (values, selectedMapVar) => {
    // Calculate quintile stops
    let stops = [0];
    const colorDomain = extent(values);
    const colorRange = scaleQuantile().domain(colorDomain).range(colors);
    colorRange.quantiles().forEach((quantile, index) => {
      stops.push(Math.floor(quantile));
    });
    if (!values.length) {
      stops = [0, 0, 0, 0, 0];
    }
    const fill = stops.map((stop, index) => { return [stop, colors[index]]; });
    this.map.setPaintProperty('census-tracts', 'fill-color', {
      property: selectedMapVar,
      stops: fill,
    });
    this.setState({
      legend: fill,
    });
    this.map.setPaintProperty('census-tracts', 'fill-opacity', values.length ? 1 : 0.5);
  }

  highlightSelectedTracts = (map, compareTracts) => {
    if (typeof this.map.getLayer('selectedTracts') !== 'undefined') {
      this.map.getSource('selectedTracts').setData({
        type: 'FeatureCollection',
        features: compareTracts
      });
      return;
    }
    map.addSource('selectedTracts', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: compareTracts
      }
    });
    map.addLayer({
      id: 'selectedTracts',
      source: 'selectedTracts',
      type: 'line',
      paint: {
        'line-color': '#F6A01B',
        'line-width': 2
      }
    });
  }

  selectTractForComparison = (selectedTract, map, compareTracts) => {
    const tracts = compareTracts;
    const countyFP = selectedTract.properties.COUNTYFP;
    const tractce = selectedTract.properties.TRACTCE;
    const exist = tracts.findIndex(ct => ct.properties.COUNTYFP === countyFP && ct.properties.TRACTCE === tractce);
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
      return;
    }
  }

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
  }
}

Map.propTypes = {
  hiGeoJson: PropTypes.object.isRequired,
  acsVars: PropTypes.object.isRequired,
  selectedMapVar: PropTypes.string.isRequired,
};

export default Map;
