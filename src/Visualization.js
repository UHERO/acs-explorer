import React from 'react';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import './Visualization.css';
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json';
import ComparisonTable from './ComparisonTable';
import Heatmap from './Heatmap';

mapboxgl.accessToken =
  'pk.eyJ1IjoidndhcmQiLCJhIjoiY2pmbjdqY3BxMTRsbzJ4bmFlbjdxcnlzNyJ9.YEUuGQyTt3gUswT1zTUQJQ';

const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hiData: [],
      compareTracts: [],
      legend: [],
    };
    this.fillMapColor = this.fillMapColor.bind(this);
  }
  componentDidMount() {
    const { acsData, acsVars, selectedAcsVar } = this.props;
    if (acsData.length) {
      higeojson.features.forEach(ct => {
        // Join ACS data with GeoJSON
        this.addAcsToGeoJson(ct, acsData);
      });
      this.setState({ hiData: higeojson });
      const values = this.getSelectedVarValues(selectedAcsVar);
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-157.9174, 20.2893],
        zoom: 6,
      });
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.on('load', () => {
        this.addCensusTractLayer(this.map);
        this.fillMapColor(values, selectedAcsVar);
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

  componentWillReceiveProps(nextProps) {
    if (this.state.hiData.features) {
      const values = this.getSelectedVarValues(nextProps.selectedAcsVar);
      this.fillMapColor(values, nextProps.selectedAcsVar);
    }
  }

  addCensusTractLayer(map) {
    // Find layer with place names
    const layers = map.getStyle().layers;
    const symbolLayer = layers.find(l => l.type === 'symbol').id;
    map.addSource('tracts', {
      type: 'geojson',
      data: higeojson,
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

  addAcsToGeoJson(ct, acsData) {
    const tractce = ct.properties.TRACTCE;
    const countyFP = ct.properties.COUNTYFP;
    const match = acsData.findIndex(d => d.tract === tractce && d.county === countyFP);
    if (match > -1) {
      Object.keys(acsData[match]).forEach(k => {
        const missing = !!(
          +acsData[match][k] === -888888888 ||
          +acsData[match][k] === -666666666 ||
          +acsData[match][k] === -999999999
        );
        acsData[match][k] = missing ? 'N/A' : +acsData[match][k];
      });
      Object.assign(ct.properties, acsData[match]);
    }
  }

  getSelectedVarValues(selectedVar) {
    return higeojson.features
      .map(ct => ct.properties[selectedVar])
      .filter(v => v !== 'N/A')
      .sort((a, b) => a - b);
  }

  fillMapColor(values, selectedAcsVar) {
    // Calculate quintile stops
    let stops = [0];
    for (let i = 1; i < 5; i++) {
      const perc = 0.2 * i;
      stops.push(values[Math.floor(values.length * perc)]);
    }
    if (!values.length) {
      stops = [0, 0, 0, 0, 0];
    }
    const fill = stops.map((stop, index) => { return [stop, colors[index]]; });
    this.map.setPaintProperty('census-tracts', 'fill-color', {
      property: selectedAcsVar,
      stops: fill,
    });
    this.setState({
      legend: fill,
    });
    this.map.setPaintProperty('census-tracts', 'fill-opacity', 0.7);
  }

  highlightSelectedTracts(map, compareTracts) {
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
        'line-color': '#FFF',
        'line-width': 2
      }
    });
  }

  selectTractForComparison(selectedTract, map, compareTracts) {
    const tracts = compareTracts;
    const countyFP = selectedTract.properties.COUNTYFP;
    const tractce = selectedTract.properties.TRACTCE;
    const exist = tracts.findIndex(ct => ct.properties.COUNTYFP === countyFP && ct.properties.TRACTCE === tractce);
    if (exist > -1) {
      tracts.splice(exist, 1);
      this.setState({ compareTracts: tracts });
      return;
    }
    if (exist === -1 && tracts.length < 2) {
      tracts.push(selectedTract);
      this.setState({ compareTracts: tracts });
      return;
    }
    if (exist === -1 && tracts.length >= 2) {
      tracts.splice(0, 1);
      tracts.push(selectedTract);
      this.setState({ compareTracts: tracts });
      return;
    }
  }

  render() {
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
        <Heatmap
          id="heatmap"
          data={this.state.hiData}
          selectedVar={this.props.selectedAcsVar}
        />
        <ComparisonTable
          id="comparison-table"
          tracts={this.state.compareTracts}
          vars={this.props.acsVars}
        />
      </div>
    );
  }
}

Visualization.propTypes = {
  acsData: PropTypes.any.isRequired,
  acsVars: PropTypes.object.isRequired,
  selectedAcsVar: PropTypes.string.isRequired,
};

export default Visualization;
