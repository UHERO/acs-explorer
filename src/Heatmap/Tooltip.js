import React from 'react';

const Tooltip = (props) => {
    const { tooltip } = props;
    const display = tooltip.display;
    const position = tooltip.pos;
    const tractData = tooltip.data;
    let visibility = 'hidden';
    let y = 0;
    let height = 100;
    let xValue = '', tract = '';
    let style = { visibility: visibility };
    let top = 0;
    if (display) {
        const data = tractData.tract;
        const xVar = tractData.xVar;
        tract = data.properties['census_tra'];
        y = parseInt(position.y);
        xValue = data.properties[xVar].toLocaleString();
        visibility = 'visible';
        if (y > height) {
            top = y - 500;
        }
        if (y < height) {
            top = y + 125 - 500;
        }
        style = {
            'visibility': visibility,
            'position': 'relative',
            'left': '0px',
            'top': top + 'px',
            'padding': '10px',
            'backgroundColor': '#FFF',
            'boxShadow': '#505050 1px 2px 2px',
            'borderRadius': '4px',
            'fontSize': '1.1em',
            'fontFamily': 'sans-serif',
            'lineHeight': '20px'
        }
    } else {
        visibility = 'hidden';
    }
    
    return <div style={style}>
        <b style={{'fontWeight': 'bold'}}>{tract}</b><br />
        {props.tooltip.data.xVar.replace(/_/g, ' ') + ': ' + xValue}
        </div>
}

export default Tooltip;