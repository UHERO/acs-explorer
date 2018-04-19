import React from 'react';
import StateMap from './StateMap';
import VariableSelection from './VariableSelection';

const baseURL = 'https://api.census.gov/data/2016/acs/acs5/profile?get=';
/* Variables from ACS 5-Year Data Profile API: 
DP02_0001E: Estimate: HOUSEHOLDS BY TYPE Total households
DP02_0061PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over - High school graduate (includes equivalency)
DP03_0062E: Estimate: INCOME AND BENEFITS (IN 2016 INFLATION-ADJUSTED DOLLARS) Total households - Median household income (dollars)
DP02_0064PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over - Bachelor's degree
DP02_0065PE: Percent: EDUCATIONAL ATTAINMENT Population 25 years and over - Graduate or professional degree
DP03_0009PE: Percent: EMPLOYMENT STATUS Civilian labor force - Unemployment Rate
DP03_0021PE: Percent: COMMUTING TO WORK Workers 16 years and over - Public transportation (excluding taxicab)
DP04_0005PE: Percent: HOUSING OCCUPANCY Rental vacancy rate
DP04_0004PE: Percent: HOUSING OCCUPANCY Homeowner vacancy rate
DP03_0025E: Estimate: COMMUTING TO WORK Mean travel time to work (minutes)
DP04_0134E: Estimate: GROSS RENT Occupied units paying rent - Median (dollars)

-888888888: the estimate is not applicable or not available
-666666666: indicates that either no sample observations or
too few sample observations were available to compute an estimate,
or a ratio of medians cannot be calculated because one or both of the median estimates falls in the lowest interval or upper interval of an open-ended distribution.
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
    DP04_0134E: 'Occupied_Units_Paying_Rent_(Median $)'
};
const tractParams = '&for=tract:*&in=state:15%20county:*';
const key = '&key=ad57a888cd72bea7153fa37026fca3dc19eb0134';

class Visualization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: false,
            error: null,
            selectedAcsVar: {value: 'Median_Household_Income_($)', label: 'Median Household Income ($)'}
        };
        this.handleAcsVarChange = this.handleAcsVarChange.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        fetch(baseURL + Object.keys(acsVars).join() + tractParams + key)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error fetching data');
                }
            })
            .then((data) => {
                data[0].forEach((label, index) => acsVars[label] ? data[0][index] = acsVars[label] : data[0][index] = data[0][index]);
                let formattedCensusData = data.map((row) => {
                    let obj = {};
                    data[0].forEach((id, index) => {
                        obj[id] = row[index];
                    });
                    return obj;
                });
                this.setState({ data: formattedCensusData, loading: false })
            })
            .catch(error => this.setState({ error: error, loading: false }));
    }

    handleAcsVarChange(acsVar) {
        this.setState({ selectedAcsVar: acsVar });
        console.log('acs var', acsVar);
    }

    render() {
        if (this.state.error) {
            console.log('error', this.state.error);
        }
        if (this.state.loading) {
            return <p>Loading..</p>
        }
        return (
            <div>
                <VariableSelection
                    vars={acsVars}
                    selectedAcsVar={this.state.selectedAcsVar}
                    onChangeSelected={this.handleAcsVarChange}
                />
                <StateMap
                    acsData={this.state.data}
                    selectedAcsVar={this.state.selectedAcsVar}
                    vars={acsVars}
                />
            </div>
        )
    }
}

export default Visualization
