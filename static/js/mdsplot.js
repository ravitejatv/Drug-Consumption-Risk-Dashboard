function generate_mdsplot(dataX, dataY, columns) {
    var svg = d3.select(".mdssvg"),
        margin = 35,
        width = svg.attr("viewBox").split(" ")[2] - margin,
        height = svg.attr("viewBox").split(" ")[3] - margin;
    svg.selectAll("g > *").remove();
    svg.selectAll("circle").remove();
    var xScale, yScale;
    if (Math.abs(d3.min(dataX)) < Math.abs(d3.max(dataX)))
        xScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.max(dataX)), 1.1 * Math.abs(d3.max(dataX))]).range([0, width]);
    else
        xScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.min(dataX)), 1.1 * Math.abs(d3.min(dataX))]).range([0, width]);

    if (Math.abs(d3.min(dataY)) < Math.abs(d3.max(dataY)))
        yScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.max(dataY)), 1.1 * Math.abs(d3.max(dataY))]).range([height, 0]);
    else
        yScale = d3.scaleLinear().domain([-1.1 * Math.abs(d3.min(dataY)), 1.1 * Math.abs(d3.min(dataY))]).range([height, 0]);


    var g = svg.append("g")
        .attr("transform", "translate(" + 25 + "," + 10 + ")");

    g.append("g")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.axisBottom(xScale).ticks(2))
        .append("text")
        .attr("y", 22)
        .attr("x", width - 75)
        .attr("text-anchor", "end")
        .attr("stroke", "black");
    // .text("First Dimension");

    g.append("g")
        .attr("transform", "translate(" + width / 2 + ",0)")
        .call(d3.axisLeft(yScale).ticks(2))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-3.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black");
    // .text("Second Dimension");

    var scatterDatatotal = dataX.map((item, index) => { return [item, dataY[index]] });

    g.selectAll(".circle")
        .data(scatterDatatotal)
        .enter().append("circle")
        .attr("r", function(d) { return 1.5; })
        .attr("cx", function(d) {
            return xScale(d[0]);
        })
        .attr("cy", function(d) {
            return yScale(d[1]);
        })

    g.selectAll(".text")
        .data(scatterDatatotal)
        .enter()
        .append("text")
        .style("font-size", "10px")
        .attr("text-anchor", "end")
        .attr("x", function(d, i) {
            return xScale(d[0]) - 5;
        })
        .attr("y", function(d, i) {
            return yScale(d[1]);
        })
        .attr("stroke", '#022c7a')
        .text(function(d, i) {
            return columns[i];
        });
}