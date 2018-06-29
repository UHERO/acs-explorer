import React from 'react';

const Tooltip = (props) => {
    let visibility = 'hidden';
    let transform = 'translate(0,0)';
    let x = 0;
    let y = 0;
    let width = 250;
    let height = 100;
    let transformText = 'translate(' + 5 + ', ' + 15 + ')';
    let xValue = '', yValue = '', tract = '';
    let top = '0px'
    if (props.tooltip.display === true) {
        const position = props.tooltip.pos;
        const data = props.tooltip.data.tract;
        const xVar = props.tooltip.data.xVar;
        const yVar = props.tooltip.data.yVar;
        tract = data.properties['census_tra'];
        x = position.x;
        y = position.y;
        xValue = data.properties[xVar].toLocaleString();
        yValue = data.properties[yVar].toLocaleString();
        visibility = 'visible';
        if (y > height) {
            transform = 'translate(' + x + 50 + ', ' + (y - height) + ')';
            top = (y - height - 450) + 'px';
        }
        if (y < height) {
            transform = 'translate(' + x + 50 + ', ' + (Math.round(y) + 50) + ')';
            top = (Math.round(y) + 50 - 450) + 'px';
        }
    } else {
        visibility = 'hidden';
    }
    /* return <g transform={transform}>
        <rect width={width} height={height} visibility={visibility} fill='#e5e5e5' opacity='0.9' />
        <text visibility={visibility} transform={transformText}>
            <tspan x='0' font-weight='bold' font-size='1em' fill='#000'>{tract}</tspan>
            <tspan x= '0' dy='25' font-size='1em' fill='#000'>{props.tooltip.data.xVar.replace(/_/g, ' ') + ': ' + xValue}</tspan>
            <tspan x= '0' dy='25' font-size='1em' fill='#000'>{props.tooltip.data.yVar.replace(/_/g, ' ') + ': ' + yValue}</tspan>
        </text>
    </g> */
    return <div style={{'position': 'relative', 'left': x + 50 + 'px', 'top': top}}>
        {tract}<br />
        {props.tooltip.data.xVar.replace(/_/g, ' ') + ': ' + xValue}<br />
        {props.tooltip.data.yVar.replace(/_/g, ' ') + ': ' + yValue}
        </div>
}

export default Tooltip;