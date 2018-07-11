// See: http://www.adeveloperdiary.com/react-js/integrate-react-and-d3/

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import Tooltip from '../Tooltip/Tooltip';
import Axis from './Axis';

class Bubblechart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: {
        display: false,
        pos: {},
        data: {
          tract: '',
          xVar: '',
          yVar: '',
          mapVar: '',
        },
      },
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  render = () => {
    const { data, compareTracts, selectedMapVar, xAxisVar, yAxisVar } = this.props;
    if (data.features) {
        const selectedTracts = compareTracts.map((t) => t.properties['TRACTCE']);
      const filtered = [];
        data.features.forEach((df) => {
          if (df.properties[xAxisVar] !== 'N/A' && df.properties[yAxisVar] !== 'N/A' && df.properties[selectedMapVar] !== 'N/A') {
          filtered.push(df);
        }
      });
      const margin = { top: 30, right: 100, bottom: 20, left: 40 };
      const outerWidth = 700, outerHeight = 400;
      const width = outerWidth - margin.left - margin.right;
      const height = outerHeight - margin.top - margin.bottom;

        const xScale = scaleLinear()
        .domain([0, Math.max(...filtered.map(df => df.properties[xAxisVar]))])
          .range([0, width]);
      const yScale = scaleLinear()
        .domain([0, Math.max(...filtered.map(df => df.properties[yAxisVar]))])
          .range([height, 0]);
      const rScale = scaleLinear()
          .domain([0, Math.max(...filtered.map(df => df.properties[selectedMapVar]))])
          .range([1, 20]);

      const yAxis = axisLeft()
          .scale(yScale)
          .ticks(5, 's');
      const xAxis = axisBottom()
          .scale(xScale)
          .ticks(5, 's');
      const points = filtered.map((d, i) => <circle
                    key={'circle' + i}
                    cx={xScale(d.properties[xAxisVar])}
                    cy={yScale(d.properties[yAxisVar])}
                    r={rScale(d.properties[selectedMapVar])}
                    fill={'transparent'}
                    stroke={selectedTracts.includes(d.properties['TRACTCE']) ? '#F6A01B' : '#1D667F'}
                    opacity={0.4}
                    strokeWidth={2}
                    onMouseOver={(event) => this.showTooltip(event, d, xAxisVar, yAxisVar, selectedMapVar)}
                    onMouseOut={this.hideTooltip}
                />);
        const transform = `translate(${margin.left}, ${margin.top})`;
      return (
        <div id="bubblechart">
          <svg width={outerWidth} height={outerHeight}>
            <g transform={transform}>
              <Axis h={height} axis={yAxis} axisType="y" />
              <Axis h={height} axis={xAxis} axisType="x" />
              {points}
            </g>
          </svg>
          <Tooltip tooltip={this.state.tooltip} />
        </div>
        );
      }
    if (!data.features) {
        return <p>Bubblechart</p>;
    }
  };

  setTooltipPosition = (x, y, tooltipHeight, tooltipWidth) => {
      y = parseInt(y, 10);
      x = parseInt(x, 10);
      let top = 0, left = x + 50;
    if (y >= tooltipHeight) {
        top = y - tooltipHeight - 300;
    }
    if (y < tooltipHeight) {
        top = Math.round(y) + 30 - 390;
    }
    if (x > tooltipWidth) {
      left = x + 30 - tooltipWidth;
    }
    return { left: `${left}px`, top: `${top}px`, width: '250px' };
  };

  showTooltip = (e, d, xVar, yVar, mapVar) => {
    e.target.style.opacity = 1;
      const xPos = e.target.getAttribute('cx');
    const yPos = e.target.getAttribute('cy');
      const tooltipHeight = 200;
      const tooltipWidth = 250;
      const tPosition = this.setTooltipPosition(xPos, yPos, tooltipHeight, tooltipWidth);
      this.setState({
        tooltip: {
          display: true,
          pos: tPosition,
          data: {
            tract: d,
            xVar: xVar,
            yVar: yVar,
            mapVar: mapVar,
          },
        },
      });
  };

  hideTooltip = e => {
    e.target.style.opacity = 0.4;
      this.setState({
        tooltip: {
        display: false,
          pos: {},
        data: {
          tract: '',
          xVar: '',
          yVar: '',
          mapVar: '',
          },
        },
      });
  };
}

export default Bubblechart;
