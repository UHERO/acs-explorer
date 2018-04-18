import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

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
            <Select
                name="acs-variable-select"
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
        )
    }
}

export default VariableSelection