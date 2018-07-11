import React from 'react';
import ReactDOM from 'react-dom';
import { select } from 'd3-selection';
import './Axis.css';

class Axis extends React.Component {
  constructor(props) {
    super(props);
    this.renderAxis = this.renderAxis.bind(this);
  }
  componentDidUpdate = () => {
    this.renderAxis();
  };
  componentDidMount = () => {
    this.renderAxis();
  };
  renderAxis = () => {
    const node = ReactDOM.findDOMNode(this);
    select(node).call(this.props.axis);
  };
  render = () => {
    const translate = `translate(0,${this.props.h})`;
    return (
      <g
        className="axis"
        transform={this.props.axisType === 'x' ? translate : ''}
      />
    );
  };
}

export default Axis;
