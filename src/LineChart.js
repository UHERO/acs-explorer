import React from 'react';
import { XYFrame } from 'semiotic';
import { scaleTime } from 'd3-scale';
import './LineChart.css';

const medianEarnings = [
  {
    state: 'California',
    coordinates: [
      { earnings: 34325, date: '2008-01-01' },
      { earnings: 33492, date: '2009-01-01' },
      { earnings: 33016, date: '2010-01-01' },
      { earnings: 32910, date: '2011-01-01' },
      { earnings: 32873, date: '2012-01-01' },
    ],
  },
  {
    state: 'Hawaii',
    coordinates: [
      { earnings: 33546, date: '2008-01-01' },
      { earnings: 32245, date: '2009-01-01' },
      { earnings: 32102, date: '2010-01-01' },
      { earnings: 33620, date: '2011-01-01' },
      { earnings: 33135, date: '2012-01-01' },
    ],
  },
];

const LineChart = () => (
  <XYFrame
    title={'Median Earnings'}
    size={[700, 500]}
    lines={medianEarnings}
    xScaleType={scaleTime()}
    xAccessor={d => new Date(d.date)}
    yAccessor={'earnings'}
    lineStyle={{ stroke: '#1D667F' }}
    lineRenderMode={'sketchy'}
    margin={{
      left: 80,
      bottom: 50,
      right: 10,
      top: 40,
    }}
    axes={[
      { orient: 'left' },
      { orient: 'bottom', tickFormat: d => d.getMonth() + "/" + d.getYear() },
    ]}
  />
);

export default LineChart;
