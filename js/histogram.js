class Histogram{
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: {top: 50, right: 50, bottom: 20, left: 50},
            tooltipPadding: _config.tooltipPadding || 15
        }

        this.data = _data

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
          .attr('width', vis.config.containerWidth)
          .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);
        
        this.updateVis();
    }

    updateVis(){
        let vis = this;
        let desiredData1 = d3.select('#histogram-value-1').property('value');
        let desiredData2 = d3.select('#histogram-value-2').property('value');

        vis.xScale = d3.scaleLinear()
            .domain([0, Math.max(d3.max(vis.data, d => parseFloat(d?.[desiredData1])), d3.max(vis.data, d => parseFloat(d?.[desiredData2])))])
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxisGroup = vis.chart.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axis x-axis")
            .call(vis.xAxis);

        vis.histogram1 = d3.histogram()
            .value(function(d) { return d?.[desiredData1]; })
            .domain(vis.xScale.domain())
            .thresholds(vis.xScale.ticks(50)) // Number of bins, change this to a variable later
        vis.histogram2 = d3.histogram()
            .value(function(d) { return d?.[desiredData2]; })
            .domain(vis.xScale.domain())
            .thresholds(vis.xScale.ticks(50)) // Number of bins, change this to a variable later

        vis.chart.bins1 = vis.histogram1(vis.data);
        vis.chart.bins2 = vis.histogram2(vis.data);

        vis.yScale = d3.scaleLinear()
           .domain([0, Math.max(d3.max(vis.chart.bins1, function(d) {return d.length; }), d3.max(vis.chart.bins2, function(d) {return d.length; }))])
           .range([vis.height, 0 ])
        vis.yAxis = d3.axisLeft(vis.yScale)
        vis.xAxisGroup = vis.chart.append("g")
            .attr("class", "axis y-axis")
            .call(vis.yAxis);

        this.renderVis()
    }

    renderVis(){
        let vis = this;
        let desiredData1 = d3.select('#histogram-value-1').property('value');
        let desiredData2 = d3.select('#histogram-value-2').property('value');

        vis.bars1 = vis.chart.append('g')
            .selectAll('rect')
            .data(vis.chart.bins1)
            .enter()
            .append('rect')
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + vis.xScale(d.x0) + "," + vis.yScale(d.length) + ")"; })
                .attr("width", function(d) { return vis.xScale(d.x1) - vis.xScale(d.x0) -1 ; })
                .attr("height", function(d) { return vis.height - vis.yScale(d.length); })
                .style("fill", "#69b3a2")
                .style('opacity', 0.6);

        vis.bars2 = vis.chart.append('g')
            .selectAll('rect')
            .data(vis.chart.bins2)
            .enter()
            .append('rect')
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + vis.xScale(d.x0) + "," + vis.yScale(d.length) + ")"; })
                .attr("width", function(d) { return vis.xScale(d.x1) - vis.xScale(d.x0) -1 ; })
                .attr("height", function(d) { return vis.height - vis.yScale(d.length); })
                .style("fill", "#404080")
                .style('opacity', 0.6);
        
        vis.bars1
            .on('mouseover', (event,d) => {
                d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                    <div class="tooltip-title">${d.length} counties with ${desiredData1.replaceAll('_', ' ')} in range ${d.x0}-${d.x1}</div>
                    
                `);
            });
        
        vis.bars2
            .on('mouseover', (event,d) => {
                d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                    <div class="tooltip-title">${d.length} counties with ${desiredData2.replaceAll('_', ' ')} in range ${d.x0}-${d.x1}</div>
                    
                `);
            });

        vis.bars1
            .on('mousemove', (event, d) => {
                d3.select('#tooltip')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px');
            });

        vis.bars2
            .on('mousemove', (event, d) => {
                d3.select('#tooltip')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px');
            });
        
        vis.bars1
            .on('mouseleave', (event, d) =>{
                d3.select('#tooltip')
                .style('display','none');
            });

        
        vis.bars2
            .on('mouseleave', (event, d) =>{
                d3.select('#tooltip')
                .style('display','none');
            });

        vis.chart.append("circle").attr("cx",500).attr("cy",30).attr("r", 6).style("fill", "#69b3a2")
        vis.chart.append("circle").attr("cx",500).attr("cy",60).attr("r", 6).style("fill", "#404080")
        vis.chart.append("text").attr("x", 520).attr("y", 30).text(desiredData1.replaceAll('_', ' ')).style("font-size", "15px").attr("alignment-baseline","middle")
        vis.chart.append("text").attr("x", 520).attr("y", 60).text(desiredData2.replaceAll('_', ' ')).style("font-size", "15px").attr("alignment-baseline","middle")
            
        vis.dataSelector = d3.select('#histogram-value-1').on('change', (event) => {
            vis.chart.remove();
            vis.initVis();
        });
        vis.dataSelector = d3.select('#histogram-value-2').on('change', (event) => {
            vis.chart.remove();
            vis.initVis();
        });
    }
}