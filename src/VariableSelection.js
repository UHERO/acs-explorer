import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './VariableSelection.css';

class VariableSelection extends React.Component {
    constructor(props) {
        super(props);
        this.changeSelected = this.changeSelected.bind(this);
    }

    changeSelected(selectedOption) {
        this.props.onChangeSelected(selectedOption);
    }

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <ul>
                    <li>Select a variable from the dropdown to update the map.</li>
                    <li>Click on up to 2 census tracts to generate a comparison table below.</li>
                </ul>
                <Select
                    name='acs-variable-select'
                    clearable={false}
                    searchable={false}
                    value={this.props.selectedAcsVar}
                    onChange={this.changeSelected}
                    options={
                        Object.values(this.props.vars).map((v) => {
                            return { value: v, label: v.replace(/_/g, ' ') }
                        })
                    }
                />
            </div>
        );
    }
}

export default VariableSelection