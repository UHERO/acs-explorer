// See: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
// https://mikewilliamson.wordpress.com/2016/06/03/d3-and-react-3-ways/
import React from 'react';
import { scaleLinear } from 'd3-scale';
import YAxis from './YAxis';
import XAxis from './XAxis';

const Bubblechart = props => {
    const { data, xAxisVar, yAxisVar } = props;
    if (data.features) {
        const filtered = [];
        data.features.forEach((df) => {
            if (df.properties[xAxisVar] !== 'N/A' && df.properties[yAxisVar] !== 'N/A') {
                filtered.push(df);
            }
        });
        const margin = { top: 30, right: 20, bottom: 30, left: 20 };
        const width = 450 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        const xScale = scaleLinear()
            .domain([0, Math.max(...filtered.map(df => df.properties[xAxisVar]))])
            .range([0, width]);
        const yScale = scaleLinear()
            .domain([0, Math.max(...filtered.map(df => df.properties[yAxisVar]))])
            .range([height, 0]);
        const rScale = scaleLinear()
            .domain([0, Math.max(...filtered.map(df => df.properties[xAxisVar]))])
            .rangeRound([1, 15]);
        
        const points = filtered.map((d, i) => {
            return <circle
                key={'circle' + i}
                cx={xScale(d.properties[xAxisVar])}
                cy={yScale(d.properties[yAxisVar])}
                r={rScale(d.properties[xAxisVar])}
                fill={'transparent'}
                stroke={'#1D667F'}
                opacity={0.4}
                strokeWidth={2} />
        });
        return <svg width={450} height={400}>
            <YAxis y={15} labels={yScale.ticks().reverse()} start={0} end={height} />
            <g className='bubblechart' transform={`translate(${margin.left}, ${margin.top})`}>
                { points }
                <XAxis x={height} labels={xScale.ticks()} start={0} end={width} />
            </g>
        </svg>
    }
    if (!data.features) {
        return <p>Bubblechart</p>
    }
}

export default Bubblechart;