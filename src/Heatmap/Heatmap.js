import React from 'react';
import { extent } from 'd3';
import { scaleQuantile } from 'd3-scale';
import Tooltip from '../Tooltip/Tooltip';
import './Heatmap.css';

class Heatmap extends React.Component {
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
                }
            }
        }
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    render = () => {
        const { data, compareTracts, selectedMapVar, xAxisVar, yAxisVar } = this.props;
        if (data.features) {
            const filtered = [];
            const selectedTracts = compareTracts.map((t) => {
                return t.properties['TRACTCE'];
            });
            data.features.forEach((df) => {
                if (df.properties[xAxisVar] !== 'N/A' && df.properties[selectedMapVar] !== 'N/A') {
                    filtered.push(df);
                }
            });
            filtered.sort((a, b) => {
                return b.properties[xAxisVar] - a.properties[xAxisVar];
            });
            const colorDomain = extent(filtered, (d) => {
                return d.properties[selectedMapVar];
            });
            const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
            const colorRange = scaleQuantile().domain(colorDomain).range(colors);
            const width = 200;
            const height = 505;
            const barHeight = height / filtered.length;
            const bars = filtered.map((d, i) => {
                return <rect
                    key={'rect' + i}
                    x={10}
                    y={i * barHeight}
                    width={width}
                    height={barHeight}
                    opacity={1}
                    fill={ selectedTracts.includes(d.properties['TRACTCE']) ? '#F6A01B' : colorRange(d.properties[selectedMapVar])}
                    onMouseOver={(event) => this.showTooltip(event, d, xAxisVar, yAxisVar, selectedMapVar)}
                    onMouseOut={this.hideTooltip}
                />
            });

            return (
                <div id='heatmap-container'>
                    <svg id='ranked-heatmap' width={width} height={height}>
                        <g>
                            {bars}
                        </g>
                    </svg>
                    <Tooltip tooltip={this.state.tooltip} />
                </div>
            )
        }
        if (!data.features) {
            return <p>Heatmap</p>
        }
    }

    setTooltipPosition = (x, y, tooltipHeight) => {
        let top = 0;
        y = parseInt(y, 10);
        if (y >= tooltipHeight) {
            top = y - 625;
        }
        if (y < tooltipHeight) {
            top = y - 500;
        }
        return { left: '0px', top: top + 'px', width: null };
    }

    showTooltip = (e, d, xVar, yVar, mapVar) => {
        const xPos = e.target.getAttribute('x');
        const yPos = e.target.getAttribute('y');
        const tooltipHeight = 200;
        const tPosition = this.setTooltipPosition(xPos, yPos, tooltipHeight);
        this.setState({
            tooltip: {
                display: true,
                pos: tPosition,
                data: {
                    tract: d,
                    xVar: xVar,
                    yVar: yVar,
                    mapVar: mapVar,
                }
            }
        });
    }
    
    hideTooltip = (e) => {
        this.setState({
            tooltip: {
                display: false,
                pos: {},
                data: {
                    tract: '',
                    xVar: '',
                    yVar: '',
                    mapVar: '',
                }
            }
        });
    }
}

export default Heatmap