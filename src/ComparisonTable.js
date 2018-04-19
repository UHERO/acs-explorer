import React from 'react';
import './ComparisonTable.css';

class ComparisonTable extends React.Component {
    render() {
        const vars = this.props.vars;
        const tracts = this.props.tracts;
        console.log('tracts', tracts)
        if (!tracts.length) {
            return (
                <p />
            )
        }
        if (tracts.length) {
            return (
                <table>
                    <thead>
                        <tr>
                            <th>&nbsp;</th>
                            {tracts.map(ct => <th key={ct.TRACTCE}>{ct.census_tra}, {ct.census_t_1} County</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(vars).map(v => <tr key={v}><td>{v.replace(/_/g, ' ')}</td>{tracts.map(ct => <td key={v + ct.TRACTCE} className="values">{ct[v].toLocaleString()}</td>)}</tr>)}
                    </tbody>
                </table>
            );
        }
    }

}

export default ComparisonTable