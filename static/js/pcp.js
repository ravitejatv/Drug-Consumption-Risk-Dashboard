function generate_pcpplot(pcpData, pcpCategories, pcpColumns) {
    var svg = d3.select(".pcpsvg");
    var g = svg.append("g")
        .attr("transform", "translate(" + 35 + "," + 32 + ")");

    var margin = 40,
        width = svg.attr("viewBox").split(" ")[2] - margin,
        height = svg.attr("viewBox").split(" ")[3] - margin;

    var x = d3.scalePoint().range([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.line(),
        axis = d3.axisLeft(y),
        background,
        foreground;

    selectedInd = -1;
    dimensions = d3.keys(pcpData[0]).filter(function(d) {
        temp = []
        if (pcpCategories[d] == "num") {
            temp = (y[d] = d3.scaleLinear()
                .domain(d3.extent(pcpData, function(p) {
                    return +p[d];
                }))
                .range([height, 0]));
        } else if (pcpCategories[d] == "cat") {
            usageDomain = ['CL0', 'CL1', 'CL2', 'CL3', 'CL4', 'CL5', 'CL6']
            ageDomain = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
            educationDomain = ['B16', 'A16', 'A17', 'A18', 'NOCER', 'PROCER', 'UNI', 'MS', 'PHD']
            if (drugs.includes(pcpColumns[d])) {
                temp = (y[d] = d3.scaleBand()
                    .domain(usageDomain)
                    .range([height, 0]));
            } else if (pcpColumns[d] == 'age') {
                temp = (y[d] = d3.scaleBand()
                    .domain(ageDomain)
                    .range([height, 0]));
            } else if (pcpColumns[d] == 'education') {
                temp = (y[d] = d3.scaleBand()
                    .domain(educationDomain)
                    .range([height, 0]));
            } else {
                temp = (y[d] = d3.scaleBand()
                    .domain(pcpData.map(function(value, index) { return value[d]; }))
                    .range([0, height]));
            }

        }
        return temp;
    })

    x.domain(dimensions);
    // // Add blue foreground lines for focus.
    foreground = g.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(pcpData)
        .enter().append("path")
        .attr("d", path)
        .attr("id", function(d, i) {
            return i;
        })
        .attr("stroke", function(d, i) {
            return 'steelblue';
        })
        .attr("stroke-opacity", 0.2);


    // // Add a group element for each dimension.
    var gd = g.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .on("start", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                gd.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("end", function(d) {
                delete dragging[d];
                background
                    .attr("d", path)
                    .attr("visibility", null);
            }));

    // // Add an axis and title.
    gd.append("g")
        .attr("class", "axis")
        .each(function(d) {
            d3.select(this).call(axis.scale(y[d]));
        })
        .append("text")
        .attr("transform", "translate(-10,0)rotate(-30)")
        .style("text-anchor", "start")
        .attr("stroke", "steelblue")
        .attr("y", -9)
        .text(function(d) {
            return pcpColumns[d];
        });

    // // Add and store a brush for each axis.
    gd.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(y[d].brush = d3.brushY().extent([
                [-8, 0],
                [8, height]
            ]).on("start", brushstart).on("brush", brush)).on("end", brushend);
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }


    // // Returns the path for a given data point.
    function path(d) {

        return line(dimensions.map(function(p) {
            if (pcpCategories[p] == "num")
                return [position(p), y[p](d[p])];
            else
                return [position(p), y[p](d[p]) + y[p].bandwidth() / 2];
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
        if (selectedInd != d3.select(this).data()[0]) {
            selectedInd = d3.select(this).data()[0];
            d3.select('#barhistselect').property('value', pcpColumns[selectedInd]);
            start_barhistplot();
            d3.select('#scatselect').property('value', pcpColumns[selectedInd]);
            start_scatterplots();
        }
    }

    function brush() {
        const actives = [];
        svg.selectAll('.brush')
            .filter(function(d) {
                return d3.brushSelection(this);
            })
            .each(function(d) {
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });
        foreground.style('display', function(d) {
            return actives.every(function(active) {
                const dim = active.dimension;
                if (pcpCategories[dim] == "cat")
                    return active.extent[0] <= (y[dim](d[dim]) + y[dim].bandwidth() / 2) && (y[dim](d[dim]) + y[dim].bandwidth() / 2) <= active.extent[1];
                else
                    return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1];
            }) ? null : "none";
        });
        pcpUplaodData()
    }

    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".brush").style("display", "none");
    }
}

function pcpUpdateData() {
    brushedIndices = []
    var svg = d3.select(".pcpsvg");
    svg.selectAll('.brush').call(d3.brush().move, null);
    svg.selectAll("path").style('display', null)
    pcpUplaodData()
}


function pcpUplaodData() {
    brushedData = []
    var svg = d3.select(".pcpsvg");
    dimensions = svg.selectAll('.brush').data();
    svg.selectAll('path').each(function(d) {
        if (d3.select(this).style("display") != "none" && d3.select(this).attr('id')) {
            scoreBrushedData = data.slice(0, data.length + 1).map(i => i.slice(5, 10))[parseInt(d3.select(this).attr('id'))];
            brushedDataind = []
            for (var i = 0; i < d3.select(this).data()[0].length; i++) {
                brushedDataind.push(d3.select(this).data()[0][i])
            }
            insertArrayAt(brushedDataind, 5, scoreBrushedData)
            brushedData.push(brushedDataind);
        }

    });
    start_barhistplot(brushedData);
    start_scatterplots(brushedData);
}

function insertArrayAt(array, index, arrayToInsert) {
    Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
    return array;
}