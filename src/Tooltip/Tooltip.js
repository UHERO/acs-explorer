import React from 'react';

const Tooltip = (props) => {
    const { tooltip } = props;
    const display = tooltip.display;
    const tractData = tooltip.data;
    const position = tooltip.pos;
    let visibility = 'hidden';
    let xValue = '', yValue = '', tract = '';
    let style = { visibility: visibility };
    if (display) {
        const data = tractData.tract;
        const xVar = tractData.xVar;
        const yVar = tractData.yVar;
        tract = data.properties['census_tra'];
        xValue = data.properties[xVar].toLocaleString();
        yValue = data.properties[yVar].toLocaleString();
        visibility = 'visible';
        style = {
            'visibility': visibility,
            'width': position.width,
            'position': 'relative',
            'left': position.left,
            'top': position.top,
            'padding': '10px',
            'backgroundColor': '#FFF',
            'boxShadow': '#505050 1px 2px 2px',
            'borderRadius': '4px',
            'fontSize': '1em',
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