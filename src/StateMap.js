import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json'
mapboxgl.accessToken = 'pk.eyJ1IjoidndhcmQiLCJhIjoiY2pmbjdqY3BxMTRsbzJ4bmFlbjdxcnlzNyJ9.YEUuGQyTt3gUswT1zTUQJQ';

class StateMap extends React.Component {
    componentDidMount() {
        console.log('map props', this.props.acsData);
        const acsData = this.props.acsData;
        if (acsData.length) {
            higeojson.features.forEach((ct) => {
                const match = acsData.findIndex(d => (d.tract === ct.properties.TRACTCE && d.county === ct.properties.COUNTYFP));
                if (match > -1) {
                    Object.keys(acsData[match]).forEach(k => acsData[match][k] = +acsData[match][k])
                    Object.assign(ct.properties, acsData[match]);
                }
            });
            const values = higeojson.features.map(ct => +ct.properties['Median_House_Income_($)'])
                .filter(v => v !== -666666666 && v !== -888888888).sort((a, b) => { return a - b });
            const stops = [0];
            for (let i = 1; i < 5; i++) {
                const perc = 0.2 * i;
                stops.push(values[Math.floor(values.length * perc)]);
            }
            const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
            this.map = new mapboxgl.Map({
                container: this.refs.hiMap,
                style: 'mapbox://styles/mapbox/light-v9',
                center: [-157.9174, 20.2893],
                zoom: 6
            });
            this.map.on('load', function () {
                this.addSource('tracts', {
                    type: 'geojson',
                    data: higeojson
                });
                this.addLayer({
                    'id': 'census-tracts',
                    'type': 'fill',
                    'source': 'tracts',
                    'paint': {
                        'fill-color': {
                            property: 'Median_House_Income_($)',
                            stops: [
                                [stops[0], colors[0]],
                                [stops[1], colors[1]],
                                [stops[2], colors[2]],
                                [stops[3], colors[3]],
                                [stops[4], colors[4]]
                            ],
                        },
                        'fill-opacity': 0.7,
                        'fill-outline-color': '#FFFFFF'
                    }
                });
            });
            this.map.on('click', 'census-tracts', function (e) {
                console.log('click', e)
                const coordinates = e.lngLat;
                const properties = e.features[0].properties;
                const tractName = '<b>' + properties.census_tra + '</b>';
                const county = '<b>' + properties.census_t_1 + ' County</b>';
                const bachelorsDeg = 'Bachelor\'s Degree: ' + properties.Bachelors_Degree_Perc + '%';
                const publicTranspost = 'Commuting to Work (Public Transport): ' + properties.Commute_Public_Transport_Perc + '%';
                const gradDegree = 'Graduate or Professional Degree: ' + properties.Grad_Degree_Perc + '%';
                const highSchool = 'High School Graduate: ' + properties.High_School_Grad_Perc + '%';
                const travelTime = 'Mean Travel Time to Work: ' + properties.Mean_Travel_Time_Work_Est;
                const medianIncome = 'Median Household Income: ' + properties.Median_House_Income_Est;
                const unempRate = 'Unemployment Rate: ' + properties.Unemp_Rate_Perc + '%';
                new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(tractName + ', ' + county + '<br>' + medianIncome + '<br>' + unempRate + '<br>' + highSchool + '<br>' + bachelorsDeg + '<br>' + gradDegree + '<br>' + publicTranspost)
                    .addTo(this)
            });
        }
        console.log('geojson', higeojson.features);
    }

    componentWillUnmount() {
        if (this.refs.hiMap) {
            //this.map.remove();
        }
    }

    render() {
        const style = {
            position: 'absolute',
            height: 500,
            width: '100%'
        };
        return (
            <div>
                <div ref="hiMap" style={style} />
            </div>
        );
    }
}

export default StateMap;