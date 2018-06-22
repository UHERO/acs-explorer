import React from 'react';
import { extent, select } from 'd3';
import { scaleQuantile } from 'd3-scale';
import { mouse } from 'd3-selection';
import './Heatmap.css';

const Heatmap = props => {
    const { data, selectedVar } = props;
    console.log('heatmap selectedVar', selectedVar)
    if (data.features) {
        const colorDomain = extent(data.features, function(d) {
            return d.properties[selectedVar];
        });
        const colors = ['#EFF3FF', '#BDD7E7', '#6BAED6', '#3182BD', '#08519C'];
        const colorRange = scaleQuantile().domain(colorDomain).range(colors);
        const width = 150;
        const height = 350;
        const barHeight = height / data.features.length;
        const tooltip = select('.d3tooltip')
            .html('Tooltip');
        const chart = select('#ranked-heatmap')
            .attr('width', width)
            .attr('height', height)
            .append('g');
        chart.selectAll('g')
            .data(data.features).enter().append('g')
            .append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => { return i * barHeight })
            .attr('width', 150)
            .attr('height', barHeight)
            .on('mouseover', (d, i) => {
                console.log('mouseover', d)
                tooltip.html('<b>' + d.properties.census_tra + '</b>' + '<br />' + selectedVar.replace(/_/g, ' ') + ': ' + d.properties[selectedVar].toLocaleString())
                    .style('top', i * barHeight - 350 + 'px')
                    .style('opacity', 0.9)
            })
            .on('mouseout', () => {
                tooltip.style('opacity', 0)
                .style('left', '0px')
                .style('top', '0px')
            })
            .style('fill', function(d) {
                return colorRange(d.properties[selectedVar]);
            });
        return (
            <div className='heatmap-container'>
                <svg id='ranked-heatmap' />
                <div className='d3tooltip' />
            </div>
        )
    
    }
    if (!data.features) {
        return <p/>
    }
}

export default Heatmap