import React from 'react';

const Tooltip = (props) => {
    let visibility = 'hidden';
    let y = 0;
    let height = 100;
    let xValue = '', tract = '';
    if (props.tooltip.display === true) {
        const position = props.tooltip.pos;
        const data = props.tooltip.data.tract;
        const xVar = props.tooltip.data.xVar;
        tract = data.properties['census_tra'];
        // x = position.x;
        y = position.y;
        xValue = data.properties[xVar].toLocaleString();
        visibility = 'visible';
        if (y > height) {
            // transform = 'translate(' + 0 + ', ' + (y - height) + ')';
        }
        if (y < height) {
            // transform = 'translate(' + 0 + ', ' + (Math.round(y) + 50) + ')';
        }
    } else {
        visibility = 'hidden';
    }
    
    return <div style={{'visibility': visibility, 'position':'relative', 'left': '0px', 'top': y - 450 + 'px'}}>
        <b style={{'font-weight': 'bold'}}>{tract}</b><br />
        {props.tooltip.data.xVar.replace(/_/g, ' ') + ': ' + xValue}
        </div>
}

export default Tooltip;