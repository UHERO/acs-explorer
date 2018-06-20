import React from 'react';
import { extent, select } from 'd3';
import { scaleQuantile } from 'd3-scale';

const Heatmap = props => {
    const { data, selectedVar } = props;
    if (data.length !== 0) {
        const colorDomain = extent(data.features, function(d) {
            return d.properties[selectedVar];
        });
        const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
        const colorRange = scaleQuantile().domain(colorDomain).range(colors);
        const width = 920;
        const height = 150;
        const barWidth = width / data.features.length;
        console.log('colorDomain', colorRange.quantiles());
        console.log('data', data);
        const chart = select('.ranked-heatmap')
            .attr('width', width)
            .attr('height', height)
            .append('g');
        chart.selectAll('g')
            .data(data.features).enter().append('g')
            .append('rect')
            .attr('x', (d, i) => { return i * barWidth })
            .attr('width', barWidth)
            .attr('height', 150)
            .style('fill', function(d) {
                return colorRange(d.properties[selectedVar]);
            });
        return <svg className='ranked-heatmap' />
    
    }
    if (!data.length) {
        return <p/>
    }
}

export default Heatmap