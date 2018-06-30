import React from 'react';

const Tooltip = (props) => {
    const { tooltip } = props;
    const display = tooltip.display;
    const tractData = tooltip.data;
    const position = tooltip.pos;
    let visibility = 'hidden';
    let x = 0, y = 0;
    let width = 225, height = 100;
    let xValue = '', yValue = '', tract = '';
    let top = 0, left = 0;
    let style = { visibility: visibility };
    if (display) {
        const data = tractData.tract;
        const xVar = tractData.xVar;
        const yVar = tractData.yVar;
        tract = data.properties['census_tra'];
        x = parseInt(position.x);
        y = parseInt(position.y);
        left = x + 50;
        xValue = data.properties[xVar].toLocaleString();
        yValue = data.properties[yVar].toLocaleString();
        visibility = 'visible';
        if (y > height) {
            top = y - height - 370;
        }
        if (y < height) {
            top = Math.round(y) + 30 - 390;
        }
        if (x > width) {
            left = x + 30 - width;
        }
        style = {
            'visibility': visibility,
            'width': width,
            'position': 'relative',
            'left': left + 'px',
            'top': top + 'px',
            'padding': '10px',
            'backgroundColor': '#FFF',
            'boxShadow': '#505050 1px 2px 2px',
            'borderRadius': '4px',
            'fontSize': '1.1em',
            'fontFamily': 'sans-serif',
            'lineHeight': '20px'
        }
    }
    if (!props.tooltip.display) {
        visibility = 'hidden';
    }
    return <div className='chart-tooltip' style={style}>
        <b style={{ 'fontWeight': 'bold' }}>{tract}</b><br />
        {props.tooltip.data.xVar.replace(/_/g, ' ') + ': ' + xValue}<br />
        {props.tooltip.data.yVar.replace(/_/g, ' ') + ': ' + yValue}
    </div>
}

export default Tooltip;