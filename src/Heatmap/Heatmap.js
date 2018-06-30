import React from 'react';
import { extent } from 'd3';
import { scaleQuantile } from 'd3-scale';
import Tooltip from './Tooltip';

class Heatmap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip: {
                display: false,
                data: {
                    tract: '',
                    xVar: '',
                }
            }
        }
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    render = () => {
        const { data, compareTracts, selectedMapVar, xAxisVar } = this.props;
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
            const width = 150;
            const height = 500;
            const barHeight = height / filtered.length;
            const bars = filtered.map((d, i) => {
                return <rect
                    key={'rect' + i}
                    x={0}
                    y={i * barHeight}
                    width={width}
                    height={barHeight}
                    fill={ selectedTracts.includes(d.properties['TRACTCE']) ? '#F6A01B' : colorRange(d.properties[selectedMapVar])}
                    onMouseOver={(event) => this.showTooltip(event, d, xAxisVar)}
                    onMouseOut={this.hideTooltip}
                />
            });

            return (
                <div className='heatmap-container'>
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

    showTooltip = (e, d, xVar) => {
        this.setState({
            tooltip: {
                display: true,
                pos: {
                    x: e.target.getAttribute('x'),
                    y: e.target.getAttribute('y'),
                },
                data: {
                    tract: d,
                    xVar: xVar,
                }
            }
        });
    }
    
    hideTooltip = (e) => {
        this.setState({
            tooltip: {
                display: false,
                data: {
                    tract: '',
                    xVar: '',
                    yVar: '',
                }
            }
        });
    }
}

export default Heatmap