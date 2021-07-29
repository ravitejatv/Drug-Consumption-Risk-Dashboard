function generate_scatterplot(selectedData, scoreData, selectValue, scoreColsDesc) {
    for (var i = 0; i < scoreData.length; i++) {
        for (var j = 0; j < scoreData[i].length; j++)
            scoreData[i][j] = parseInt(scoreData[i][j])
    }

    var svg = d3.select(".scattersvg"),
        margin = 55,
        padding = 20,
        n = 5,
        width = svg.attr("viewBox").split(" ")[2] - margin,
        height = svg.attr("viewBox").split(" ")[3] - margin;

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("g > *").remove();



    for (var i = 0; i < n; i++) {
        scatterDataX = scoreData[i]
        scatterDataY = selectedData

        var xScale, yScale;
        xScale = d3.scaleLinear().domain([0, 1.01 * 70]).range([0, width]);
        yScale = d3.scaleBand().domain(scatterDataY).range([height / (n + 2), 0]);

        if (drug_desc.includes(selectValue)) {
            scatterDataYDomain = ['CL0', 'CL1', 'CL2', 'CL3', 'CL4', 'CL5', 'CL6']
            yScale = d3.scaleBand().domain(scatterDataYDomain).range([height / (n + 2), 0]);
        } else if (selectValue == 'Age') {
            ageDomain = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
            yScale = d3.scaleBand().domain(ageDomain).range([height / (n + 2), 0]);
        } else if (selectValue == 'Education') {
            educationDomain = ['B16', 'A16', 'A17', 'A18', 'NOCER', 'PROCER', 'UNI', 'MS', 'PHD']
            yScale = d3.scaleBand().domain(educationDomain).range([height / (n + 2), 0]);
        }

        matX = 25
        matY = 120 + (i * 150)
        var g = svg.append("g")
            .attr("transform", "translate(" + matX + "," + matY + ")");

        g.append("g")
            .attr("transform", "translate(" + matX + ",0)")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom(xScale))
            .append("text")
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(getTooltipScatter(d3.select(this).html()))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .attr("y", 30)
            .attr("x", matX + 200)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text(columnDesc[scoreColsDesc[i]])

        g.append("g")
            .call(d3.axisLeft(yScale))
            .attr("transform", "translate(" + matX + "," + -100 + ")")
            .attr("class", "axis axis--y")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-4.5em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            // .text(selectValue);

        var scatterDatatotal = scatterDataX.map((item, index) => { return [item, scatterDataY[index]] });

        g.selectAll(".circle")
            .data(scatterDatatotal)
            .enter().append("circle")
            .attr("transform", "translate(" + matX + "," + -100 + ")")
            .attr("r", function(d) { return 1.5; })
            .attr('fill-opacity', 0.2)
            .attr("cx", function(d) {
                return xScale(d[0]);
            })
            .attr("cy", function(d) {
                return yScale(d[1]) + yScale.bandwidth() / 2;
            })
            .attr('fill', function(d, i) {
                return '#022c7a';
            })
    }
}

function getTooltipScatter(xValue) {
    if (xValue == "Nscore") {
        return "<b>" + xValue + "</b>" + "<br/>" + "• Often feel vulnerable or insecure" + "<br/>" + "• Struggle with difficult situations"
    } else if (xValue == "Escore") {
        return "<b>" + xValue + "</b>" + "<br/>" + "• Make friends easily" + "<br/>" + "• Speak without thinking"
    } else if (xValue == "Oscore") {
        return "<b>" + xValue + "</b>" + "<br/>" + "• Enjoy trying new things" + "<br/>" + "• Be more creative"
    } else if (xValue == "Ascore") {
        return "<b>" + xValue + "</b>" + "<br/>" + "• Are always ready to help out" + "<br/>" + "• Believe the best about others"
    } else if (xValue == "Cscore") {
        return "<b>" + xValue + "</b>" + "<br/>" + "• Keep things in order" + "<br/>" + "• Are goal-driven"
    }
}