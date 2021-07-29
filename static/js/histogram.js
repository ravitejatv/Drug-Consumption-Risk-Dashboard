function generate_hisplot(selectedData, selectValue) {
    var svg = d3.select(".barhistsvg");
    svg.selectAll("g > *").remove();
    xVal = selectedData;
    var margin = 40,
        width = svg.attr("viewBox").split(" ")[2] - margin,
        height = svg.attr("viewBox").split(" ")[3] - margin;
    var xScale = d3.scaleLinear().domain([0, 1.1 * d3.max(xVal)]).range([0, width]);
    yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 22 + ")");

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("y", 30)
        .attr("x", width - 75)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        // .text(selectValue);


    var histogram = d3.histogram()
        .value(function(d) { return d; })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(10));


    var bins = histogram(xVal);

    yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);
    g.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Frequency");

    g.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return (xScale(d.x1) - xScale(d.x0) - 1 < 0) ? 0 : xScale(d.x1) - xScale(d.x0) - 1; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .on("mouseover", function(d) {
            d3.select(this)
                .style('fill', 'red');
            var d = d3.select(this).data()[0];
            var xtip = xScale((d3.select(this).data()[0]["x0"] + d3.select(this).data()[0]["x1"]) / 2);
            var ytip = yScale(d.length) - 10;
            g.append("text")
                .text(d.length)
                .attr("id", "tooltext")
                .attr("stroke", "red")
                .attr("transform", function(d) { return "translate(" + xtip + "," + ytip + ")"; });
        })
        .on("mouseout", function(d) {
            d3.select(this).style('fill', '#022c7a');
            d3.selectAll('.val')
                .remove();
            d3.selectAll('#tooltext')
                .remove();
        })
        .style("fill", "#022c7a");


}