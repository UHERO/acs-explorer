import React from 'react';
import './ComparisonTable.css';

const ComparisonTable = props => {
  const { vars, tracts } = props;
  if (!tracts.length) {
    return <p />;
  }
  if (tracts.length) {
    return (
      <table>
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

export default ComparisonTable;
