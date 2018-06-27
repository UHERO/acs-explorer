import React from 'react';
import { range } from 'd3-array';

const YAxis = props => {
    const { y, labels, start, end } = props;
    console.log('y labels', labels)
    let style = {
        stroke: '#505050',
        strokeWidth: '1px'
    };

    let textStyle = {
        fontSize: '0.8em',
        fill: '#505050',
        textAnchor: 'end'
    };

    let ticks = range(0, end, (end / labels.length));
    console.log('ticks', ticks)
    let lines = [];
    ticks.forEach((tick, index) => {
        lines.push(<line style={style} y1={tick} x1={y} y2={tick} x2={y - 4} />);
    });
    let columnLabels = [];
    ticks.forEach((tick, index) => {
        columnLabels.push(<text style={textStyle} y={tick + 6} x={y - 6} fontFamily='sans-serif'>{labels[index]}</text>);
    });
    return (
        <g>
            <g className='yAxisLabels' transform={`translate(${0}, ${60})`}>
                <line x1={y} y1={start} y2={end} x2={y} style={style} />
            </g>
            <g className='yAxisLabels' transform={`translate(${0}, ${60})`}>
                { columnLabels }
                { lines }
            </g>
        </g>
    );
}

export default YAxis;