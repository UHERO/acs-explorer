import React from 'react';
import './ComparisonTable.css';
import PropTypes from 'prop-types';

const ComparisonTable = props => {
  const { tracts, vars } = props;
  if (!tracts.length) {
    return (
      <div id="select-note">
        <p>Select tracts from the map above.</p>
      </div>
    );
  }
  if (tracts.length) {
    return (
      <table id="comparison-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            {tracts.map(ct => (
              <th key={ct.properties.TRACTCE}>
                {ct.properties.census_tra}, {ct.properties.census_t_1} County
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(vars).map(v => (
            <tr key={v}>
              <td>{v.replace(/_/g, ' ')}</td>
              {tracts.map(ct => (
                <td key={v + ct.properties.TRACTCE} className="values">
                  {ct.properties[v].toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

ComparisonTable.propTypes = {
  tracts: PropTypes.array.isRequired,
  vars: PropTypes.object.isRequired,
};

export default ComparisonTable;
