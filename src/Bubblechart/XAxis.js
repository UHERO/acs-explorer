import React from 'react';
import { range } from 'd3-array';

const XAxis = props => {
    const { x, labels, start, end } = props;
    let style = {
        stroke: '#505050',
        strokeWidth: '1px'
    };

    let textStyle = {
        fontSize: '0.8em',
        fill: '#505050',
        fontFamily: 'sans-serif'
    };

    let step = (start + end / labels.length);
    let ticks = range(start, end, step);
    let lines = [];
    ticks.forEach((tick, index) => {
        lines.push(<line style={style} x1={tick + 10} y1={x} x2={tick + 10} y2={x + 4} />);
    });
    let columnLabels = [];
    ticks.forEach((tick, index) => {
        columnLabels.push(<text style={textStyle} x={tick + 5} y={x + 20}>{labels[index]}</text>)
    });

    return (
        <g>
            <line x1={start} y1={x} x2={end} y2={x} style={style} />
            { columnLabels }
            { lines }
        </g>
    );
}

export default XAxis;