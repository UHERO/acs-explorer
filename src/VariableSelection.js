import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class VariableSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'Median_House_Income_($)' };
        this.changeSelected = this.changeSelected.bind(this);
    }

    createMenuItems() {
        let items = [];
        console.log(this.props);
        const vars = Object.values(this.props.vars);
        vars.forEach((v) => {
            const displayName = v.replace(/\_/g, ' ');
            items.push({ value: v, label: displayName });
        })
        /* vars.forEach((v) => {
            const displayName = v.replace(/\_/g, ' ');
            items.push(<option key={v} value={v}>{displayName}</option>);
        }); */
        return items;
    }

    changeSelected(selectedOption) {
        console.log('change', selectedOption);
        this.setState({ value: selectedOption });
    }

    render() {
        return (
            /* <select value={this.state.value} onChange={this.changeSelected}>
                {this.createMenuItems()}
            </select> */
            <Select
                name="acs-variable-select"
                clearable={false}
                value={this.state.value}
                onChange={this.changeSelected}
                options={
                    Object.values(this.props.vars).map((v) => {
                        return { value: v, label: v.replace(/\_/g, ' ') }
                    })
                }
            />
        )
    }
}

export default VariableSelection