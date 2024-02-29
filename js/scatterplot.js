class Scatterplot{
    constructor(_config, _data){
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: {top: 50, right: 50, bottom: 20, left: 50},
            tooltipPadding: _config.tooltipPadding || 15
        }

        this.data = _data;
        this.idleTimeout = null;

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

        let desiredX = d3.select('#scatterplot-x-value').property('value');
        let desiredY = d3.select('#scatterplot-y-value').property('value');

        // Add X axis
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.data, d => parseFloat(d?.[desiredX]))])
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxisGroup = vis.chart.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .attr("class", "axis x-axis")
            .call(vis.xAxis);

        // Add Y axis
        vis.yScale = d3.scaleLinear()
           .domain([0, d3.max(vis.data, d => parseFloat(d?.[desiredY]))])
           .range([vis.height, 0 ])
        vis.yAxis = d3.axisLeft(vis.yScale)
        vis.xAxisGroup = vis.chart.append("g")
            .attr("class", "axis y-axis")
            .call(vis.yAxis);

        this.renderVis();
    }

    renderVis(){
        let vis = this;

        let desiredX = d3.select('#scatterplot-x-value').property('value');
        let desiredY = d3.select('#scatterplot-y-value').property('value');

        // Add dots
        vis.circles = vis.chart.append('g')
        .selectAll("circle")
        .data(vis.data.filter(function(d, i){return d?.[desiredX] >= 0 && d?.[desiredY] >= 0})) 
        .enter()
        .append("circle")
            .attr("cx", function (d) { return vis.xScale(d?.[desiredX]); } )
            .attr("cy", function (d) { return vis.yScale(d?.[desiredY]); } )
            .attr("r", 7)
            .style("fill", "#69b3a2")
            .style("opacity", 0.3)
            .style("stroke", "white");
        
        vis.circles
            .on('mouseover', (event,d) => {
              d3.select('#tooltip')
                .style('display', 'block')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                .html(`
                  <div class="tooltip-title">${d.display_name}</div>
                  <ul>
                    <li>${desiredX.replaceAll('_', ' ')}: ${d?.[desiredX]}</li>
                    <li>${desiredY.replaceAll('_', ' ')}: ${d?.[desiredY]}</li>
                  </ul>
                `);
            });
        
        vis.circles
            .on('mousemove', (event, d) =>{
                d3.select('#tooltip')
                .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')   
                .style('top', (event.pageY + vis.config.tooltipPadding) + 'px');
            });

        vis.circles
            .on('mouseleave', (event, d) =>{
                d3.select('#tooltip')
                .style('display', 'none')
            });

        vis.xSelector = d3.select('#scatterplot-x-value').on('change', (event) => {
            vis.chart.remove();
            vis.initVis();
        });
        vis.ySelector = d3.select('#scatterplot-y-value').on('change', (event) => {
            vis.chart.remove();
            vis.initVis();
        });
    }
}