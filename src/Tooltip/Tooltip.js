import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = (props) => {
  const { tooltip } = props;
  const display = tooltip.display;
  const tractData = tooltip.data;
  const position = tooltip.pos;
  let visibility = 'hidden';
  let xValue = '',
    yValue = '',
    mapValue = '',
    tract = '';
  let style = { visibility };
  if (display) {
    const data = tractData.tract;
    const xVar = tractData.xVar;
    const yVar = tractData.yVar;
    const mapVar = tractData.mapVar;
    tract = data.properties.census_tra;
    xValue = data.properties[xVar].toLocaleString();
    yValue = data.properties[yVar].toLocaleString();
    mapValue = data.properties[mapVar].toLocaleString();
    visibility = 'visible';
    style = {
      visibility,
      width: position.width,
      position: 'relative',
      left: position.left,
      top: position.top,
      padding: '10px',
      backgroundColor: '#FFF',
      boxShadow: '#505050 1px 2px 2px',
      color: '#505050',
      fontSize: '1em',
      fontFamily: 'sans-serif',
      lineHeight: '20px',
      zIndex: '10',
    };
  }
  if (!display) {
    visibility = 'hidden';
  }
  return (
    <div className="chart-tooltip" style={style}>
      <b style={{ fontWeight: 'bold' }}>{tract}</b>
      <br />
      {`${props.tooltip.data.xVar.replace(/_/g, ' ')}: ${xValue}`}
      <br />
      {`${props.tooltip.data.yVar.replace(/_/g, ' ')}: ${yValue}`}
      <br />
      {`${props.tooltip.data.mapVar.replace(/_/g, ' ')}: ${mapValue}`}
    </div>
  );
};

Tooltip.propTypes = {
  tooltip: PropTypes.object,
}

export default Tooltip;
