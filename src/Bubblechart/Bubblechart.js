// See: http://www.adeveloperdiary.com/react-js/integrate-react-and-d3/

import React from 'react';
import { scaleLinear } from 'd3-scale';
import { axisLeft, axisBottom } from 'd3-axis';
import Tooltip from './Tooltip';
import Axis from './Axis';

class Bubblechart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: {
                display: false,
                pos: {
                    x: null,
                    y: null,
                },
                data: {
                    tract: '',
                    xVar: '',
                    yVar: '',
                }
            }
        }
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    render = () => {
        const { id, data, xAxisVar, yAxisVar } = this.props;

        if (data.features) {
            const filtered = [];
            data.features.forEach((df) => {
                if (df.properties[xAxisVar] !== 'N/A' && df.properties[yAxisVar] !== 'N/A') {
                    filtered.push(df);
                }
            });
            const margin = { top: 30, right: 20, bottom: 30, left: 75 };
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
                .domain([0, Math.max(...filtered.map(df => df.properties[xAxisVar]))])
                .range([1, 15]);

            const yAxis = axisLeft()
                .scale(yScale)
                .ticks(5, 's');
            const xAxis = axisBottom()
                .scale(xScale)
                .ticks(5, 's')

            const points = filtered.map((d, i) => {
                return <circle
                    key={'circle' + i}
                    cx={xScale(d.properties[xAxisVar])}
                    cy={yScale(d.properties[yAxisVar])}
                    r={rScale(d.properties[xAxisVar])}
                    fill={'transparent'}
                    stroke={'#1D667F'}
                    opacity={0.4}
                    strokeWidth={2}
                    onMouseOver={(event) => this.showTooltip(event, d, xAxisVar, yAxisVar)}
                    onMouseOut={this.hideTooltip}
                />
            });
            const transform = 'translate(' + margin.left + ', ' + margin.top + ')';

            return (
                <div id={id}>
                <svg width={outerWidth} height={outerHeight} >
                    <g transform={transform}>
                        <Axis h={height} axis={yAxis} axisType='y' />
                        <Axis h={height} axis={xAxis} axisType='x' />
                        {points}
                    </g>
                </svg>
                <Tooltip tooltip={this.state.tooltip} />
                </div>
            );
        }
        if (!data.features) {
            return <p>Bubblechart</p>
        }
    }

    showTooltip = (e, d, xVar, yVar) => {
        this.setState({
            tooltip: {
                display: true,
                pos: {
                    x: e.target.getAttribute('cx'),
                    y: e.target.getAttribute('cy'),
                },
                data: {
                    tract: d,
                    xVar: xVar,
                    yVar: yVar,
                }
            }
        });
    }

    hideTooltip = (e) => {
        this.setState({
            tooltip: {
                display: false,
                pos: {
                    x: null,
                    y: null,
                },
                data: {
                    tract: '',
                    xVar: '',
                    yVar: '',
                }
            }
        });
    }
}

export default Bubblechart;