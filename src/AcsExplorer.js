import React from 'react';
import Map from './Map';
import VariableSelection from './VariableSelection';
// import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts.json';
import higeojson from './cb_2017_15_tract_500k/hawaii_2017_census_tracts/hawaii2017censustracts2.json';
import tractNames from './cb_2017_15_tract_500k/census_tract_names.csv';
import Bubblechart from './Bubblechart/Bubblechart';
import Heatmap from './Heatmap/Heatmap';
import ComparisonTable from './ComparisonTable';
import './AcsExplorer.css';

// const baseURL = 'https://api.uhero.hawaii.edu/v1/census/data/2016/acs/acs5/profile?get=';
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
  DP04_0089E: 'Median_Home_Value_($)',
  DP02_0061PE: 'High_School_Graduates_(%)',
  DP03_0062E: 'Median_Household_Income_($)',
  DP02_0064PE: 'Bachelors_Degree_(%)',
  DP02_0065PE: 'Graduate/Professional_Degree_(%)',
  DP03_0009PE: 'Unemployment_Rate_(%)',
  DP03_0021PE: 'Public_Transportation_(%)',
  DP04_0005E: 'Rental_Vacancy_(%)',
  DP04_0004E: 'Homeowner_Vacancy_(%)',
  DP03_0025E: 'Mean_Travel_Time_To_Work_(Min.)',
  DP04_0134E: 'Median_Rent_($)',
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
      compareTracts: [],
      selectedMapVar: {
        value: 'Median_Household_Income_($)',
        label: 'Median Household Income ($)',
      },
      selectedXVar: {
        value: 'Median_Household_Income_($)',
        label: 'Median Household Income ($)',
      },
      selectedYVar: {
        value: 'High_School_Graduates_(%)',
        label: 'High School Graduates (%)',
      },
    };
    this.handleMapVarChange = this.handleMapVarChange.bind(this);
    this.updateTractComparisons = this.updateTractComparisons.bind(this);
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
          acsVars[label]
            ? (data[0][index] = acsVars[label])
            : (data[0][index] = data[0][index])
        );
        const formattedCensusData = data.map(row => {
          const obj = {};
          data[0].forEach((id, index) => {
            obj[id] = row[index];
          });
          return obj;
        });
        console.log('tract names', tractNames)
        console.log('hiGeoJson', higeojson)
        higeojson.features.forEach(ct => {
          if (ct.properties.census_tra === "Kaho’olawe") {
            console.log('kahoolawe', ct)
          }
          if (ct.properties.COUNTYFP === '003' && ct.properties.TRACTCE === '980000') {
            console.log('003', ct)
          }
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
  };

  addAcsToGeoJson = (ct, acsData) => {
    const tractce = ct.properties.TRACTCE;
    const countyFP = ct.properties.COUNTYFP;
    const match = acsData.findIndex(d => d.tract === tractce && d.county === countyFP);
    if (match > -1) {
      Object.keys(acsData[match]).forEach(k => {
        const missing = (+acsData[match][k] < 0);
        acsData[match][k] = missing ? 'N/A' : +acsData[match][k];
      });
      Object.assign(ct.properties, acsData[match]);
    }
  };

  handleMapVarChange = (acsVar) => {
    this.setState({ selectedMapVar: acsVar });
  };

  handleXVarChange = (acsVar) => {
    this.setState({ selectedXVar: acsVar });
  };

  handleYVarChange = (acsVar) => {
    this.setState({ selectedYVar: acsVar });
  };

  updateTractComparisons = (tracts) => {
    this.setState({ compareTracts: tracts });
  };

  render = () => {
    if (this.state.error) {
      console.log('error', this.state.error);
      return <p>An error has occurred.</p>;
    }
    if (this.state.loading) {
      return <p>Loading...</p>;
    }
    return (
      <div id="dashboard">
        <div ref="vis" id="vis-intro">
          <p>
            This dashboard uses the 2016 ACS 5-Year estimates for the state of
            Hawaii. Select a variable from the Map Selector to update the map.
            This variable also controls the colors of the ranked heatmap below,
            and the size of the circles in the scatter plot. The census tracts
            in the heatmap are sorted by the x-axis variable selected for the
            scatterplot below the map. Click on the census tracts on the map to
            generate a comparison table at the bottom of the dashboard. Up to
            two tracts may be selected at a time.
          </p>
          <p>
            *Note: The High School Graduates, Bachelor's Degree, and
            Graduate/Professional Degree variables refer to the highest level of
            academic achievement.
          </p>
          <VariableSelection
            id="mapVarSelector"
            formName="Map Selector:"
            vars={acsVars}
            selectedVar={this.state.selectedMapVar}
            onChangeSelected={this.handleMapVarChange}
          />
        </div>
        <Map
          hiGeoJson={this.state.hiJson}
          onUpdateCompare={this.updateTractComparisons}
          selectedMapVar={this.state.selectedMapVar.value}
        />
        <div id="bubblechart-container">
          <Bubblechart
            data={this.state.hiJson}
            compareTracts={this.state.compareTracts}
            selectedMapVar={this.state.selectedMapVar.value}
            xAxisVar={this.state.selectedXVar.value}
            yAxisVar={this.state.selectedYVar.value}
          />
          <div id="var-selectors">
            <VariableSelection
              id="yVarSelector"
              formName="Y-Axis:"
              vars={acsVars}
              selectedVar={this.state.selectedYVar}
              onChangeSelected={this.handleYVarChange}
            />
            <VariableSelection
              id="xVarSelector"
              formName="X-Axis:"
              vars={acsVars}
              selectedVar={this.state.selectedXVar}
              onChangeSelected={this.handleXVarChange}
            />
          </div>
        </div>
        <Heatmap
          data={this.state.hiJson}
          compareTracts={this.state.compareTracts}
          selectedMapVar={this.state.selectedMapVar.value}
          xAxisVar={this.state.selectedXVar.value}
          yAxisVar={this.state.selectedYVar.value}
        />
        <ComparisonTable tracts={this.state.compareTracts} vars={acsVars} />
      </div>
    );
  };
}

export default AcsExplorer;
