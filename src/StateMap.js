import React from 'react';
import mapboxgl from 'mapbox-gl';
import './StateMap.css';
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json';
import ComparisonTable from './ComparisonTable';

mapboxgl.accessToken = 'pk.eyJ1IjoidndhcmQiLCJhIjoiY2pmbjdqY3BxMTRsbzJ4bmFlbjdxcnlzNyJ9.YEUuGQyTt3gUswT1zTUQJQ';

const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
class StateMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hiData: {},
            compareTracts: [],
            legend: []
        }
        this.fillMapColor = this.fillMapColor.bind(this);
    }
    componentDidMount() {
        const acsData = this.props.acsData;
        const acsVars = this.props.vars;
        const selectedAcsVar = this.props.selectedAcsVar.value;
        if (acsData.length) {
            higeojson.features.forEach((ct) => {
                const match = acsData.findIndex(d => (d.tract === ct.properties.TRACTCE && d.county === ct.properties.COUNTYFP));
                if (match > -1) {
                    Object.keys(acsData[match]).forEach((k) => {
                        const missing = (+acsData[match][k] === -888888888 || +acsData[match][k] === -666666666 || +acsData[match][k] === -999999999) ? true : false;
                        acsData[match][k] = missing ? 'N/A' : +acsData[match][k]
                    })
                    Object.assign(ct.properties, acsData[match]);
                }
            });
            this.setState({ hiData: higeojson });
            const values = this.getSelectedVarValues(selectedAcsVar);
            this.map = new mapboxgl.Map({
                container: this.refs.hiMap,
                style: 'mapbox://styles/mapbox/light-v9',
                center: [-157.9174, 20.2893],
                zoom: 6
            });
            this.map.addControl(new mapboxgl.NavigationControl());
            this.map.on('load', () => {
                // Find layer with place names
                const layers = this.map.getStyle().layers;
                const symbolLayer = layers.find(l => l.type === 'symbol').id;
                this.map.addSource('tracts', {
                    type: 'geojson',
                    data: higeojson
                });
                this.map.addLayer({
                    id: 'census-tracts',
                    type: 'fill',
                    source: 'tracts'
                },
                // Add symbolLayer after census-tracts, so labels are placed above fill layer 
                symbolLayer);
                this.fillMapColor(values, selectedAcsVar);
            });
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            this.map.on('mousemove', 'census-tracts', function (e) {
                const features = this.queryRenderedFeatures(e.point, {
                    layers: ['census-tracts']
                });
                const coordinates = e.lngLat;
                const properties = e.features[0].properties;
                let tooltipInfo = '';
                Object.values(acsVars).forEach(v => tooltipInfo += v.replace(/_/g, ' ') + ': ' + properties[v].toLocaleString() + '<br>');
                const tractName = '<b style="font-weight:bold;">' + properties.census_tra + ', ' + properties.census_t_1 + '</b>';
                if (features.length) {
                    popup.setLngLat(coordinates)
                        .setHTML(tractName + '<br>' + tooltipInfo)
                        .addTo(this)
                } else {
                    popup.remove();
                }
            });
            this.map.on('mouseleave', 'census-tracts', () => {
                popup.remove();
            });
            const selectTractForComparison = (e) => this.selectTractForComparison(e);
            this.map.on('click', 'census-tracts', function (e) {
                const tractProperties = e.features[0].properties;
                selectTractForComparison(tractProperties);
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.hiData.features) {
            const values = this.getSelectedVarValues(nextProps.selectedAcsVar.value);
            this.fillMapColor(values, nextProps.selectedAcsVar.value);
        }
    }

    getSelectedVarValues(selectedVar) {
        return higeojson.features.map(ct => ct.properties[selectedVar])
            .filter(v => v !== 'N/A').sort((a, b) => { return a - b });
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
        this.map.setPaintProperty('census-tracts', 'fill-color', {
            property: selectedAcsVar,
            stops: [
                [stops[0], colors[0]],
                [stops[1], colors[1]],
                [stops[2], colors[2]],
                [stops[3], colors[3]],
                [stops[4], colors[4]]
            ]
        });
        this.setState({
            legend: [[stops[0], colors[0]],
            [stops[1], colors[1]],
            [stops[2], colors[2]],
            [stops[3], colors[3]],
            [stops[4], colors[4]]
            ]
        });
        this.map.setPaintProperty('census-tracts', 'fill-opacity', 0.7);
    }

    selectTractForComparison(selectedTract) {
        let tracts = this.state.compareTracts;
        const exist = tracts.findIndex(ct => (ct.COUNTYFP === selectedTract.COUNTYFP && ct.TRACTCE === selectedTract.TRACTCE));
        if (exist > -1) {
            tracts.splice(exist, 1);
            this.setState({ compareTracts: tracts });
            return;
        }
        if (exist === -1) {
            if (tracts.length < 2) {
                tracts.push(selectedTract);
                this.setState({ compareTracts: tracts });
                return;
            }
            if (tracts.length >= 2) {
                tracts.splice(0, 1);
                tracts.push(selectedTract);
                this.setState({ compareTracts: tracts });
                return;
            }
        }
    }

    render() {
        const style = {
            position: 'relative',
            height: 500,
            width: '100%'
        };
        const legend = this.state.legend;

        return (
            <div>
                <div ref='hiMap' style={style} />
                <div className='legend'>
                    {legend.map((stop, index) => {
                        return (
                            <div key={stop[0]}>
                                <span className='legend-color' style={{ backgroundColor: stop[1] }} />
                                <span className='legend-value'>{`${stop[0].toLocaleString()}`}</span>
                            </div>
                        );
                    })}
                </div>
                <ComparisonTable
                    tracts={this.state.compareTracts}
                    vars={this.props.vars}
                />
            </div>
        );
    }
}

export default StateMap;