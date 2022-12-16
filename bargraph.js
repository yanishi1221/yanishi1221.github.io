function barGraph() {
    d3.csv("data.csv", function (data) {
        //set up margin, h, w;
        var margin = { top: 110, right: 20, bottom: 10, left: 70 },
            w = 1200 - margin.left - margin.right,
            h = 650 - margin.top - margin.bottom;
        //get x axis group values in array
        var groups = d3.map(data, function (d) { return (d.province) }).keys();
        //set up axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([margin.left, w + margin.left])
            .padding([0.2])
        var y = d3.scaleLinear()
            // .domain([0, d3.max(dataset)]) //can define this later
            .range([0, h]);
        var yAxis = d3.scaleLinear()
            .range([h, 0]);

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(["tierone_rates", "tiertwo_rates", "tierthree_rates"])
            .range(['#E7DADA', '#B49BC2', '#AD92A8'])
        //'#C5B0CA',
        //Create SVG element
        svg = d3.select("#vis")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);
        var tooltip = d3.select("div.tooltip");
        svg.append("g")
            .attr("transform", "translate(" + 0 + "," + (h + margin.top) + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
            .style("text-anchor", "end");

        const yaxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // Show the bars
        const bargroups = svg.append("g")
        const updateBargroup = bargroups.append("g")
            .attr('class', 'bargroups')
        const updateTextgroup = bargroups.append("g")
            .attr('class', 'textgroups')



        d3.select("select")
            .on("change", function (d) {
                newData(); //Changes de values of the data
            });

        //initial run
        newData()

        function newData() {
            var selected = d3.select("#d3-dropdown").node().value;
            //define subgroups for stacks(same color rects belong to same subgroup) 
            var subgroups;
            //use switch: https://www.w3schools.com/js/js_switch.asp 
            switch (selected) {
                case "tierone_rates":
                    subgroups = ["tierone_rates"]
                    break;
                case "tiertwo_rates":
                    subgroups = ["tiertwo_rates"]
                    break;
                case "tierthree_rates":
                    subgroups = ["tierthree_rates"]
                    break;
                case "schoolpop":
                    subgroups = ["schoolpop"]
                    break;
                case "population":
                    subgroups = ["population"]
                    break;
                case "tierone_schools":
                    subgroups = ["tierone_schools"]
                    break;
                case "overall_rates":
                    subgroups = ["tierone_rates", "tiertwo_rates", "tierthree_rates"];
                    break;
                default:

            }
            //generate stackedData
            var stackedData = d3.stack()
                .keys(subgroups)
                (data)
            updateBar(stackedData, selected) //pass stackedData to function, because "dataset" is no longer a global var. pass selected value for fill color.

        }


        function updateBar(stackedData, selected) {
            //update y domain and y axis
            y.domain([0, d3.max(stackedData.flat(2))])
            yAxis.domain([0, d3.max(stackedData.flat(2))])
            yaxis.call(d3.axisLeft(yAxis))
            
            var updategroup = updateBargroup.selectAll(".bargroups") //better use class name for selection
                .data(stackedData)
            updategroup.exit().remove();
            updategroup = updategroup.enter().append('g')
                .attr('class', 'bargroups') //add the class name here to make sure it's for updating
                .merge(updategroup)
                .attr("stroke-width", "1px")
                .attr("stroke", "rgb(0,0,0)")
                .attr('tiers', function (d) { return d.key.split('_').join(' '); })
                .attr("fill", function (d) { return color(d.key); })
            var updatebar = updategroup.selectAll("rect")
                .data(function (d) { return d; })
            updatebar.exit().remove();
            updatebar
                .enter()
                .append("rect")
                .attr("y", function (d) {return h + margin.top})
                .merge(updatebar)
                .attr("x", function (d) { return x(d.data.province); })
                .attr("width", x.bandwidth())
                .transition()
                .duration(2000)
                .attr("y", function (d) { return h + margin.top - y(d[1]); })
                .attr("height", function (d) { return y(d[1]) - y(d[0]); })
                .attr("fill", function (d) {
                    if (selected === "overall_rates") {
                        color = d3.scaleOrdinal()
                            .domain(["tierone_rates", "tiertwo_rates", "tierthree_rates"])
                        return "inherit"; // use the fill as its parent, which is g.bargroups
                    } else {
                        color = d3.scaleQuantize()
                            .domain([0, d3.max(stackedData.flat(2))])
                            .range(['#E7DADA', '#C5B0CA', '#AD92A8'])
                        return color(d.data[selected])
                    }
                })
            updateTextgroup.exit().remove();

            var updateText = updateTextgroup.selectAll('text')
                .data(stackedData[0])

            updateText.exit().remove();
            updateText
                .enter()
                .append('text')
                .merge(updateText)
                .attr('dy', '.2em')
                .attr('dx', 10)
                .style('fill', "black")
                .style('font-size', '.7rem')
                .attr('opacity', '0')
                .attr("x", function (d) { return x(d.data.province) - 12; })
                .attr("y", function (d) { return h + margin.top - y(d.data[selected]) - 15; })
                .transition() // <---- Here is the transition
                .duration(4000)
                .delay(function (d, i) { return i * 20; })
                .attr('opacity', '1')
                .text(function (d) {
                    if (
                        selected === "tierone_rates"
                        || selected === "tiertwo_rates"
                        || selected === "tierthree_rates"
                        || selected === "overall_rates"
                    ) {
                        return d.data[selected] + '%';
                    } else if (selected === "population") {
                        return d3.format(".1f")(d.data[selected] / 1000000) + "M";
                    } else {
                        return d.data[selected];
                    }
                })
            //update annotations
            interactiegraph();
        }

        function interactiegraph() {
            var selected = d3.select("#d3-dropdown").node().value;
            svg.selectAll("rect")
                .on("mouseover", function (d) {
                    d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
                    return tooltip.style("hidden", false)
                })
                .on("mousemove", function (d) {
                    tooltip
                        .classed("hidden", false)
                        .style("top", (d3.event.pageY) + "px")
                        .style("left", (d3.event.pageX + 10) + "px")
                        .html(
                            d3.select(this.parentNode).attr('tiers') + '<br>' + d3.format(".2f")(d[1] - d[0]) + "%"
                        )
                }
                )
                .on("mouseout", function (d, i) {
                    d3.select(this).attr("opacity", 0.7).attr("stroke-width", 1);
                    tooltip.classed("hidden", true);
                });

        }

    })
}