import React from 'react';
import { select } from 'd3';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

const Bubblechart = props => {
    const { data, xAxisVar, yAxisVar } = props;
    if (data.features) {
        const width = 350;
        const height = 350;
        const margin = 30;
        const xScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties[xAxisVar]).filter(d => d !== 'N/A'))])
            .rangeRound([margin, width - margin]);
        const yScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties[yAxisVar]).filter(d => d !== 'N/A'))])
            .rangeRound([height - margin, margin]);
        const rScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties[xAxisVar]).filter(d => d !== 'N/A'))])
            .rangeRound([1, 15]);
        const xAxis = axisBottom()
            .scale(xScale)
            .tickFormat(function(d) { return d; });
        const yAxis = axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat(function(d) { return d; });
        select(".bubblechart").selectAll("*").remove();
        const chart = select('.bubblechart')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', function(d) {
                return '0, 0,' + width + ',' + height;
            });
        chart.append('g')
            .attr('transform', function() {
                return 'translate(0,' + (height - margin ) + ')';
            })
            .call(xAxis);
        chart.append('g')
            .attr('transform', function() {
                return 'translate(' + margin + ', 0)';
            })
            .call(yAxis);
        chart.selectAll('bubble')
            .data(data.features)
            .enter()
            .append('circle')
            .style('fill', 'transparent')
            .style('stroke', '#1D667F')
            .style('stroke-width', 2)
            .style('opacity', 0.4)
            .attr('cx', function(d) {
                return xScale(d.properties[xAxisVar]);
            })
            .attr('cy', function(d) {
                return yScale(d.properties[yAxisVar]);
            })
            .attr('r', function(d) {
                return rScale(d.properties[xAxisVar])
            });
        console.log('xScale', xScale);
        return <svg className='bubblechart' />
    }
    if (!data.features) {
        return <p>Bubblechart</p>
    }
}

export default Bubblechart;