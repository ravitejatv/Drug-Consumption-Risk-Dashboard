function generate_earthplot(earthData, earthColumns) {
    selectedData = earthData.map(function(value, index) { return value[3]; });
    const freqMap = selectedData.reduce((selectedData, e) => selectedData.set(e, (selectedData.get(e) || 0) + 1), new Map());
    earthxVal = Array.from(freqMap.keys());
    earthyVal = Array.from(freqMap.values());
    var svg = d3.select(".earthsvg"),
        margin = 40,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;
    const config = {
        speed: 0.005,
        verticalTilt: 0,
        horizontalTilt: 0
    }
    let locations = [
        { "latitude": 55.3781, "longitude": -3.4360, "country": "UK" },
        { "latitude": 56.1304, "longitude": -106.3468, "country": "Canada" },
        { "latitude": -25.2744, "longitude": 133.7751, "country": "Australia" },
        { "latitude": 37.0902, "longitude": -95.7129, "country": "USA" },
        { "latitude": 53.1424, "longitude": -7.6921, "country": "Republic of Ireland" },
        { "latitude": -40.9006, "longitude": 174.8860, "country": "New Zealand" }
    ];
    const markerGroup = svg.append('g')
    const projection = d3.geoOrthographic().scale(60).translate([75, 60]);
    const path = d3.geoPath().projection(projection);
    const center = [width / 2, height / 2];

    drawGlobe();
    drawGraticule();
    enableRotation();

    var div = d3.select("body").append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);

    function drawGlobe() {
        d3.queue()
            .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')
            .await((error, worldData) => {
                svg.selectAll(".segment")
                    .data(topojson.feature(worldData, worldData.objects.countries).features)
                    .enter().append("path")
                    .attr("class", "segment")
                    .attr("d", path)
                    .style("stroke", "#888")
                    .style("stroke-width", "1px")
                    .style("fill", (d, i) => '#e5e5e5')
                    .style("opacity", ".6");
                drawMarkers();
            });
    }

    function drawGraticule() {
        const graticule = d3.geoGraticule()
            .step([10, 10]);

        svg.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path)
            .style("fill", "#fff")
            .style("stroke", "#ccc");
    }

    function enableRotation() {
        d3.timer(function(elapsed) {
            projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
            svg.selectAll("path").attr("d", path);
            drawMarkers();
        });
    }

    function drawMarkers() {
        const markers = markerGroup.selectAll('circle')
            .data(locations);
        markers
            .enter()
            .append('circle')
            .merge(markers)
            .attr('cx', d => projection([d.longitude, d.latitude])[0])
            .attr('cy', d => projection([d.longitude, d.latitude])[1])
            .attr('fill', d => {
                const coordinate = [d.longitude, d.latitude];
                gdistance = d3.geoDistance(coordinate, projection.invert(center));
                return gdistance > 1.57 ? 'none' : 'steelblue';
            })
            .attr('r', 7)
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(getTooltipScatter(d))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        markerGroup.each(function() {
            this.parentNode.appendChild(this);
        });
    }

    function getTooltipScatter(d) {
        return "<b>" + earthyVal[earthxVal.indexOf(d['country'])] + "</b>";
    }
}