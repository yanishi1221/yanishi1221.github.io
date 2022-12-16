

interactivemap();

function interactivemap(interactiveDataKey) {
    d3.csv("data.csv", function (datacsv) {
        //set up margin, h, w;
        var margin = { top: 10, right: 120, bottom: 60, left: -120 },
            w = 700 - margin.left - margin.right,
            h = 750 - margin.top - margin.bottom;

        //get x axis group values in array
        var groups = d3.map(datacsv, function (d) { return (d.group) }).keys();

        //set up axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([margin.left, w + margin.left])
            .padding([0.2])
        var color = d3.scaleQuantize()
            .range(['#E7DADA', '#D6C4D2', '#B49BC2'])

        var projection = d3.geoMercator()
            .center([110, 25])
            .scale([700])
            .translate([500, 550])
            .precision([.1]);
        var path = d3.geoPath()
            .projection(projection);
        var svg = d3.select("#visMap")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .append("g")
        var tooltip = d3.select("div.tooltip");
        console.log()

        d3.json("china.geojson", function (error, china) {
            if (error) throw error;
            svg.selectAll("path")
                .data(china.features)
                .enter()
                .append("path")
                .transition() // <---- Here is the transition
                .duration(2000) // 2 seconds
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("opacity", 0.7)
                .attr("d", path)

            // d3.select("select")
            //     .on("change", function (d) {
            //         newData(); //Changes de values of the data
            //     });
            document.addEventListener('scroll', detectScroll);
            let currentSlideId = "map1";
            let interactiveDataKey = 'gdp'
            //initiate it first-time
            newData(interactiveDataKey);
            interactiegraph(interactiveDataKey);

            function detectScroll() {
                const h = window.innerHeight; //because the slide height is 100vh;
                //slides
                const slides = document.querySelectorAll('.step');
                const [slide_top, slide_bottom] = [h * 0.05, h * 0.95]; //[0, h] also works. Here the padding is to focus the center area of slide.
                const triggerY = 0.5; //a trigger anchor to trace the scrolling, 0.5 is in the middle of screen horizentally.

                window.requestAnimationFrame(() => {
                    slides.forEach(step => {
                        const pageBox = step.getBoundingClientRect();
                        //get the trigger position
                        const trigger = (pageBox.bottom - pageBox.top) * triggerY + pageBox.top;

                        //compare the trigger position to slides, get which slide now
                        if (trigger > slide_top && trigger < slide_bottom) {
                            //only switch chart when the slide is different/changed.
                            if (step.id !== currentSlideId) {
                                //update currentSlideId
                                currentSlideId = step.id;
                                switch (currentSlideId) {
                                    case 'map1':
                                        interactiveDataKey = "gdp"
                                        document.querySelector('#chartTitle').innerHTML = 'List of Chinese administrative divisions by GDP per capita';
                                        document.querySelector('#annotation1').innerHTML = "<10000"
                                        document.querySelector('#annotation2').innerHTML = "<20000"
                                        document.querySelector('#annotation3').innerHTML = "<30000"

                                        break;
                                    case 'map2':
                                        interactiveDataKey = "tierone_schools"
                                        document.querySelector('#chartTitle').innerHTML = 'Double First Class Universities in China';
                                        document.querySelector('#annotation1').innerHTML = "<=1"
                                        document.querySelector('#annotation2').innerHTML = "<8"
                                        document.querySelector('#annotation3').innerHTML = "<34"
                                        // document.querySelector('#visMap').style.backgroundColor = "#ddd"
                                        break;
                                    case 'map3':
                                        interactiveDataKey = "schoolpop"
                                        document.querySelector('#chartTitle').innerHTML = 'Double First Class Universities / Million People in China';
                                        document.querySelector('#annotation1').innerHTML = "<0.5"
                                        document.querySelector('#annotation2').innerHTML = "<1"
                                        document.querySelector('#annotation3').innerHTML = "=1.55"
                                        // document.querySelector('#visMap').style.backgroundColor = "gray"
                                        break;
                                    case 'map4':
                                        interactiveDataKey = "overall_rates"
                                        document.querySelector('#chartTitle').innerHTML = 'Enrollment Rates of Double First Class Universities in China'
                                        document.querySelector('#annotation1').innerHTML = "<18.8%"
                                        document.querySelector('#annotation2').innerHTML = "<37.5%"
                                        document.querySelector('#annotation3').innerHTML = "<56.9%"//document.querySelector('#visMap').style.backgroundColor = "pink"
                                        break;
                                    case 'map5':
                                        interactiveDataKey = "overall_rates"
                                        document.querySelector('#chartTitle').innerHTML = 'List of Chinese administrative divisions by GDP per capita';
                                        document.querySelector('#annotation1').innerHTML = "<18.8%"
                                        document.querySelector('#annotation2').innerHTML = "<37.5%"
                                        document.querySelector('#annotation3').innerHTML = "<56.9%"
                                        // document.querySelector('#visMap').style.backgroundColor = "yellow"
                                        break;
                                    default:
                                }
                                newData(interactiveDataKey)

                            }
                        }
                    })
                });
            }

            function newData(interactiveDataKey) {
                datacsv.sort((a, b) => a[interactiveDataKey] - b[interactiveDataKey])
                color.domain([d3.min(datacsv, d => d[interactiveDataKey]), d3.max(datacsv, d => d[interactiveDataKey])]);
                console.log(interactiveDataKey, d3.min(datacsv, d => d[interactiveDataKey]), d3.max(datacsv, d => d[interactiveDataKey]))
                //color.domain(datacsv.map(d => +d[colorkey]));
                // datacsv.sort((a,b) => a.tierone_rates - b.tierone_rates)
                // color.domain(datacsv.map(d => d.tierone_rates));
                updategraph(interactiveDataKey);
                // console.log(datacsv.map(d => +d[colorkey]), color.domain())

            }
            function updategraph(interactiveDataKey) {
                var updatePaths = svg.selectAll("path")
                    .data(china.features)
                updatePaths.exit().remove();
                updatePaths = updatePaths.enter()
                    .append("path")
                    .merge(updatePaths)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr('fill', function (d) {
                        if ( d.properties.name === "香港HongKong"
                        || d.properties.name === "台湾TaiWan"
                        || d.properties.name === "澳门MaCao") {
                            return "#222"
                        } else {
                            var value = datacsv.find(e => e.province === d.properties.name).gdp;
                            switch (interactiveDataKey) {
                                case "gdp":
                                    value = datacsv.find(e => e.province === d.properties.name).gdp;
                                    break;
                                case "schoolpop":
                                    value = datacsv.find(e => e.province === d.properties.name).schoolpop;
                                    break;
                                case "tierone_schools":
                                    value = datacsv.find(e => e.province === d.properties.name).tierone_schools;
                                    break;
                                case "population":
                                    value = datacsv.find(e => e.province === d.properties.name).population;
                                    break;
                                case "overall_rates":
                                    value = datacsv.find(e => e.province === d.properties.name).overall_rates;
                                    break;
                                default:
                            }
                            return color(value)
                        }
                    }).attr("d", path)

                interactiegraph(interactiveDataKey);
            }
            function interactiegraph(interactiveDataKey) {
                svg.selectAll("path")
                    .on("mouseover", function (d) {
                        console.log('top', d3.event.pageY)
                        d3.select(this).attr("opacity", 1).attr("stroke-width", 2);
                        return tooltip.style("hidden", false)
                        //.html(d.properties.name + " mousemove");

                    })
                    .on("mousemove", function (d) {
                        tooltip.classed("hidden", false)
                            .style("top", (d3.event.pageY) + "px")
                            .style("left", (d3.event.pageX + 10) + "px")
                            .html(function () {
                                //var scrollPos= 'tierone_rates'
                                var value = datacsv.find(e => e.province === d.properties.name).tierone_rates;
                                switch (interactiveDataKey) {
                                    case "gdp":
                                        value = datacsv.find(e => e.province === d.properties.name).gdp;
                                        break;
                                    case "schoolpop":
                                        value = datacsv.find(e => e.province === d.properties.name).schoolpop;
                                        break;
                                    case "tierone_schools":
                                        value = datacsv.find(e => e.province === d.properties.name).tierone_schools;
                                        break;
                                    case "population":
                                        value = datacsv.find(e => e.province === d.properties.name).population;
                                        break;
                                    case "overall_rates":
                                        value = datacsv.find(e => e.province === d.properties.name).overall_rates;
                                        break;
                                    default:
                                }
                                return d.properties.name + '<br>' + value + '%'
                            });

                    })
                    .on("mouseout", function (d, i) {
                        d3.select(this).attr("opacity", 0.7).attr("stroke-width", 1);
                        tooltip.classed("hidden", true);
                    });
            }
        })

    });


}

