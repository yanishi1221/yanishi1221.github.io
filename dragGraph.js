
d3.csv("h_bargraph.csv", function (data) {
    var inforBox_Width = 100
    inforBox_height = 300
    margin = { top: 20, right: 200, bottom: 100, left: 40 },
        width = 1000 - margin.left - margin.right - inforBox_Width,
        height = 600 - margin.top - margin.bottom,
        delim = 4;

    var svg = d3.select("#drag_graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right + inforBox_Width)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + 60 + "," + 0 + ")")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // var inforBox = svg.append('g')
    //     .attr('class', 'infor_box')
    //     .attr('width', inforBox_Width - 100)
    //     .attr('height', inforBox_height)
    //     .style("fill", "red")

    // inforBox.append('g')
    //     .attr('class', 'infoMap')

    // inforBox.append('g')
    //     .attr('class', 'infoText')
    //     .append('g')
    //     .attr('class', 'centerHorizontal')
    //     .text('Population')
    //     .attr('id', 'pop_value')

    //x axis
    var x = d3.scaleLinear()
        .domain([0, .1])
        .rangeRound([0, width]);
    var formatPercent = d3.format(".1%");

    var graph = svg.append("g")
        .attr('class', "graph")
    graph.append("g")
        .attr("transform", "translate(" + inforBox_Width + "," + height + ")")
        .call(d3.axisBottom(x).tickFormat(formatPercent))
        .style("text-anchor", "end")
        .style('font-size', '0.7rem')
    //Y axis
    var y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function (d) { return d.City; }))


    //.data(data)

    // .attr("transform", "translate(" + inforBox_Width + ",0 )")
    // .style('font-size', '0.7rem')
    // .call(d3.axisLeft(y).tickSizeInner(0))
    var yPosition = d3.scaleLinear()
        .domain([0, data.length])
        .rangeRound([0, height]);


    var axisY = graph
        .append("g")
        .attr('class', 'axis-y')
        .selectAll('.axisCity')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'axisCity')
        .on('mousemove', d => {
            d3.select('#dragMap')
            .html('<img src="'+ d.Image+'" alt="" height="100%" class="distributeHorizontal">')
            d3.select('#city')
                .html('<h4>' + d.City + '</h4>')
            d3.select('#drag_info_pop')
                .html('<div>' + d.Population + '</div>')
            d3.select('#drag_info_area')
                .html('<div>' + d.Area + '</div>')
            d3.select('#drag_info_gdp')
                .html('<div>' + d.GDP + '</div>')
            d3.select('#drag_info_schools')
                .html('<div>' + d.TOP140 + '</div>')

        })

    axisY.append('rect')

        .attr('x', "-40")
        .attr("y", function (d, i) { return yPosition(i) + delim / 2 })
        .attr("width", 200)
        .attr('height', y.bandwidth() - 10 - delim)
        .attr('fill-opacity', '1')
        .attr('fill', "var(--white)")
        .style("stroke-width", 2)
        .attr('stroke', "var(--black)")

    axisY
        .append('text')
        .style('font-size', '1rem')
        .attr('x', "-30")
        .attr('y', function (d, i) { return yPosition(i) + yPosition(0.5); })
        .text(function (d) { return d.City })






    // Moveable barChart
    var brushX = d3.brushX()
        .extent(function (d, i) {
            return [
                [0, yPosition(i) + delim / 2],
                [width, yPosition(i) + height / data.length - delim / 2 - 10]
            ];
        })
        .on("brush", brushmoveX)
        .on("end", brushendX);


    var svgbrushX = graph
        .selectAll('.brush')
        .data(data)
        .enter()
        .append('g')
        .attr("transform", "translate(" + inforBox_Width + ",0 )")
        .attr('class', 'brush')
        .append('g')
        .call(brushX)
        .call(brushX.move, function (d) { return [0, d.Value].map(x); });

    svgbrushX
        .append('text')
        .attr('x', function (d) { return x(d.Value) - 10; })
        .attr('y', function (d, i) { return yPosition(i) + yPosition(0.5); })
        .attr('dy', '.35em')
        .attr('dx', 15)
        .style('fill', "black")
        .text(function (d) { return d3.format(".1%")(d.Value); })//format label to 100%


    //设置颜色：选择brush -> .selection (rect)，然后用上次课上的方法，根据数据设置颜色
    svgbrushX.select('.selection')
        .attr('id', d => d.City)
        .attr('fill-opacity', '1')
        .attr('fill', d => d.City === "Beijing 北京" ? "#000" : "#ECE3D5")
        // A === B ? X : Y 语法等同于if(A === B){return X}else{return Y} 
        .attr('stroke', '#000')
        .attr('stroke-width', '2')
        .filter(d => d.City === "Beijing 北京").on('.brush', null)

    function brushendX() {
        if (!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type === "brush") return;
        if (!d3.event.selection) { // just in case of click with no move
            svgbrushX
                .call(brushX.move, function (d) {
                    return [0, d.Value].map(x);
                });
        }
    }

    function brushmoveX() {
        if (!d3.event.sourceEvent) return;
        if (d3.event.sourceEvent.type === "brush") return;
        if (!d3.event.selection) return;
        var d0 = d3.event.selection.map(x.invert);
        var d = d3.select(this).select('.selection');
        d.datum().Value = d0[1]; // Change the value of the original data
        update();
    }

    //---------UPDATE VERTICAL and HORIZONTAL

    function update() {
        svgbrushX
            .call(brushX.move, function (d) {
                return [0, d.Value].map(x);
            })
            .selectAll('text')
            .attr('x', function (d) { return x(d.Value) - 10; })
            .text(function (d) { return d3.format(".1%")(d.Value); }); //format label to 100%

    }

    var svgRect = graph
        .selectAll('.CorrectAnswer')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'CorrectAnswer')

    svgRect.append('rect')
        .attr("transform", "translate(" + inforBox_Width + ",0 )")
        .attr("y", function (d, i) { return yPosition(i) + delim / 2 })
        .attr("x", 0)
        .attr("width", 0)
        .attr('height', y.bandwidth() - 10 - delim)
        .attr('fill-opacity', '1')
        .attr('fill', "#000")


    svgRect.append('text')
        .attr('x', function (d) { return x(d.CorrectValue) + 3; })
        .attr('y', function (d, i) { return yPosition(i) + yPosition(0.5); })
        .attr('dy', '.35em')
        .attr('dx', 15)
        .attr('class', "answerText")
        //.style('display','none')
        .style('fill', "white")
        .style("opacity", 0)
        .text(function (d) { return d3.format(".1%")(d.CorrectValue); })//format label to 100%


    $("#dragAnswer").on("click", function (e) {
        console.log('clicked')
        svgRect.select('rect')
            .transition()
            .duration(2000)
            .attr("width", d => d.City === "Beijing 北京" ? 0 : x(d.CorrectValue))
        svgRect.select('text')
            .transition()
            .delay(1700)
            .style("opacity", 1)
        svgbrushX.on(".brush", null);
        $("#dragAnswer").html('Next')
        $("#dragAnswer").attr('onclick', "toPage('S11')");


    });

})




