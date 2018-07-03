import React from 'react';
import Visualization from './Visualization';
import VariableSelection from './VariableSelection';
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json';

const baseURL = 'https://api.census.gov/data/2016/acs/acs5/profile?get=';
/* Variables from ACS 5-Year Data Profile API:
DP02_0001E: Estimate: HOUSEHOLDS BY TYPE Total households
DP02_0061PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over -
    High school graduate (includes equivalency)
DP03_0062E: Estimate: INCOME AND BENEFITS (IN 2016 INFLATION-ADJUSTED DOLLARS)
    Total households - Median household income (dollars)
DP02_0064PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over -
    Bachelor's degree
DP02_0065PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over -
    Graduate or professional degree
DP03_0009PE: Percent: EMPLOYMENT STATUS Civilian labor force - Unemployment Rate
DP03_0021PE: Percent: COMMUTING TO WORK Workers 16 years and over -
    Public transportation (excluding taxicab)
DP04_0005PE: Percent: HOUSING OCCUPANCY Rental vacancy rate
DP04_0004PE: Percent: HOUSING OCCUPANCY Homeowner vacancy rate
DP03_0025E: Estimate: COMMUTING TO WORK Mean travel time to work (minutes)
DP04_0134E: Estimate: GROSS RENT Occupied units paying rent - Median (dollars)

-888888888: the estimate is not applicable or not available
-666666666: indicates that either no sample observations or
too few sample observations were available to compute an estimate,
or a ratio of medians cannot be calculated because one or
both of the median estimates falls in the lowest interval or
upper interval of an open-ended distribution.
*/

const acsVars = {
  DP02_0001E: 'Total_Households',
  DP02_0061PE: 'High_School_Graduates_(%)',
  DP03_0062E: 'Median_Household_Income_($)',
  DP02_0064PE: 'Bachelors_Degree_(%)',
  DP02_0065PE: 'Graduate/Professional_Degree_(%)',
  DP03_0009PE: 'Unemployment_Rate_(%)',
  DP03_0021PE: 'Commute_Public_Transport_(%)',
  DP04_0005PE: 'Rental_Vacancy_(%)',
  DP04_0004PE: 'Homeowner_Vacancy_(%)',
  DP03_0025E: 'Mean_Travel_Time_To_Work_(Min.)',
  DP04_0134E: 'Occupied_Units_Paying_Rent_(Median $)',
};
const tractParams = '&for=tract:*&in=state:15%20county:*';
const key = '&key=ad57a888cd72bea7153fa37026fca3dc19eb0134';

class AcsExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hiJson: {},
      loading: false,
      error: null,
      selectedMapVar: {
        value: 'Median_Household_Income_($)',
        label: 'Median Household Income ($)',
      },
    };
    this.handleMapVarChange = this.handleMapVarChange.bind(this);
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    fetch(baseURL + Object.keys(acsVars).join() + tractParams + key)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error fetching data');
      })
      .then(data => {
        data[0].forEach(
          (label, index) =>
            (acsVars[label]
              ? (data[0][index] = acsVars[label])
              : (data[0][index] = data[0][index])
            ));
        const formattedCensusData = data.map(row => {
          const obj = {};
          data[0].forEach((id, index) => {
            obj[id] = row[index];
          });
          return obj;
        });
        higeojson.features.forEach(ct => {
          // Join ACS data with GeoJSON
          this.addAcsToGeoJson(ct, formattedCensusData);
        });
        this.setState({ hiJson: higeojson, loading: false });
      })
      .catch(error => {
        if (error && this.refs.vis) {
          this.setState({ error, loading: false });
        }
      });
  }

  addAcsToGeoJson = (ct, acsData) => {
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

  handleMapVarChange = (acsVar) => {
    this.setState({ selectedMapVar: acsVar });
  }

  render = () => {
    if (this.state.error) {
      console.log('error', this.state.error);
      return <p>An error has occurred.</p>
    }
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    return (
      <div ref="vis">
        <p>This dashboard uses 2016 ACS 5-Year estimates for the state of Hawaii. Select a variable from the Map Selector to update the map. The colors of the map control to colors of the ranked heatmap.
          The heatmap is sorted by the x-axis variable selected for the scatterplot below.</p>
        <VariableSelection
          id={'mapVarSelector'}
          formName={''}        
          vars={acsVars}
          selectedVar={this.state.selectedMapVar}
          onChangeSelected={this.handleMapVarChange}
        />
        <Visualization
          hiGeoJson={this.state.hiJson}
          acsVars={acsVars}
          selectedMapVar={this.state.selectedMapVar.value}
        />
      </div>
    );
  }
}

export default AcsExplorer;
