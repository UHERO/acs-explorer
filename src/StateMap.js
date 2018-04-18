import React from 'react';
import mapboxgl from 'mapbox-gl';
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json';
import ComparisonTable from './ComparisonTable';

mapboxgl.accessToken = 'pk.eyJ1IjoidndhcmQiLCJhIjoiY2pmbjdqY3BxMTRsbzJ4bmFlbjdxcnlzNyJ9.YEUuGQyTt3gUswT1zTUQJQ';

const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
class StateMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hiData: {},
            compareTracts: []
        }
        this.fillMapColor = this.fillMapColor.bind(this);
        this.selectTractForComparison = this.selectTractForComparison.bind(this);
    }
    componentDidMount() {
        const acsData = this.props.acsData;
        const selectedAcsVar = this.props.selectedAcsVar.value;
        if (acsData.length) {
            higeojson.features.forEach((ct) => {
                const match = acsData.findIndex(d => (d.tract === ct.properties.TRACTCE && d.county === ct.properties.COUNTYFP));
                if (match > -1) {
                    Object.keys(acsData[match]).forEach(k => acsData[match][k] = +acsData[match][k])
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
            this.map.on('load', () => {
                this.map.addSource('tracts', {
                    type: 'geojson',
                    data: higeojson
                });
                this.map.addLayer({
                    id: 'census-tracts',
                    type: 'fill',
                    source: 'tracts'
                });
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
                const tractName = '<b>' + properties.census_tra + ', ' + properties.census_t_1 + '</b>';
                const bachelorsDeg = 'Bachelor\'s Degree: ' + properties['Bachelors_Degree_(%)'] + '%';
                const publicTranspost = 'Commuting to Work (Public Transport): ' + properties['Commute_Public_Transport_(%)'] + '%';
                const gradDegree = 'Graduate or Professional Degree: ' + properties['Grad_Degree_(%)'] + '%';
                const highSchool = 'High School Graduate: ' + properties['High_School_Grad_(%)'] + '%';
                const travelTime = 'Mean Travel Time to Work: ' + properties['Mean_Travel_Time_Work_(Min.)'];
                const medianIncome = 'Median Household Income: ' + properties['Median_Household_Income_($)'];
                const unempRate = 'Unemployment Rate: ' + properties['Unemp_Rate_(%)'] + '%';
                if (features.length) {
                    popup.setLngLat(coordinates)
                        .setHTML(tractName + '<br>' + medianIncome + '<br>' + unempRate + '<br>' + highSchool + '<br>' + bachelorsDeg + '<br>' + gradDegree + '<br>' + publicTranspost)
                        .addTo(this)
                } else {
                    popup.remove();
                }
            });
            this.map.on('mouseleave', 'census-tracts', () => {
                popup.remove();
            });
            /* this.map.on('click', 'census-tracts', function (e) {
                console.log('click', e);
                const tractProperties = e.features[0].properties;
                this.selectTractForComparison(tractProperties);
                console.log('state', this.state.compareTracts)
            }); */
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.hiData.features) {
            const values = this.getSelectedVarValues(nextProps.selectedAcsVar.value);
            this.fillMapColor(values, nextProps.selectedAcsVar.value);
        }
    }

    getSelectedVarValues(selectedVar) {
        return higeojson.features.map(ct => +ct.properties[selectedVar])
            .filter(v => v !== -666666666 && v !== -888888888).sort((a, b) => { return a - b });
    }

    fillMapColor(values, selectedAcsVar) {
        // Calculate quintile stops
        const stops = [0];
        for (let i = 1; i < 5; i++) {
            const perc = 0.2 * i;
            stops.push(values[Math.floor(values.length * perc)]);
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
        this.map.setPaintProperty('census-tracts', 'fill-opacity', 0.7);
    }

    selectTractForComparison(selectedTract) {
        const tracts = this.state.compareTracts;
        if (tracts.length) {
            const exist = tracts.findIndex(ct => (ct.COUNTYFP === selectedTract.COUNTYFP && ct.TRACTCE === selectedTract.TRACTCE));
            if (exist > -1) {
                tracts.splice(exist, 1);
            }
            if (exist === -1) {
                tracts.push(selectedTract);
            }
        }
        if (!tracts.length) {
            tracts.push(selectedTract);
        }
        this.setState({ compareTracts: tracts });
    }

    render() {
        const style = {
            position: 'relative',
            height: 500,
            width: '100%'
        };
        return (
            <div>
                <div ref="hiMap" style={style} />
                <ComparisonTable />
            </div>
        );
    }
}

export default StateMap;