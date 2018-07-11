import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './VariableSelection.css';

class VariableSelection extends React.Component {
  constructor(props) {
    super(props);
    this.changeSelected = this.changeSelected.bind(this);
  }

  changeSelected = selectedOption => this.props.onChangeSelected(selectedOption);

  render = () => (
    <div id={this.props.id}>
      <label id={this.props.id} style={{ fontWeight: 'bold' }}>
        {this.props.formName}
      </label>
      <br />
      <Select
        name="acs-variable-select"
        clearable={false}
        searchable={false}
        value={this.props.selectedVar}
        onChange={this.changeSelected}
        options={Object.values(this.props.vars).map(v => ({
          value: v,
          label: v.replace(/_/g, ' '),
        }))}
      />
    </div>
  );
}

VariableSelection.propTypes = {
  id: PropTypes.string,
  formName: PropTypes.string,
  onChangeSelected: PropTypes.func.isRequired,
  selectedVar: PropTypes.object.isRequired,
  vars: PropTypes.object.isRequired,
};

export default VariableSelection;
