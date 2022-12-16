
function gridData() {
    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width = 50;
    var height = 50;
    var click = 0;
    var margin = 30

    // iterate for rows	
    for (var row = 0; row < 7; row++) {
        data.push(new Array());
        // iterate for cells/columns inside rows
        for (var column = 0; column < 15; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                click: click
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width + margin;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height + margin;
    }
    return data;
}

var gridData = gridData();
// I like to log the data to the console for quick debugging
console.log(gridData);

var grid = d3.select("#grid")
    .append("svg")
    .attr("width", "1410px")
    .attr("height", "520px");

var row = grid.selectAll(".row")
    .data(gridData)
    .enter().append("g")
    .attr("class", "row");
var color = 'white'
var displayCircles = 100

drawGraph()
var number = 0
function drawGraph() {
    var column = row.selectAll(".circle")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("class", "circle")
        .attr("id", function (d, i) { return i })
        .attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; })
        .attr("width", function (d) { return d.width; })
        .attr("height", function (d) { return d.height; })
        .style('rx', "100px")
        .style("fill", 'var(--primary)')

}
function updategraph() {
    grid.selectAll("rect")
        .transition()
        .ease(d3.easePoly)
        .duration(2000)
        .style("fill", (d,i)=>i<displayCircles ? 'var(--primary)':color)
}

var chanegeColorClickedTime = 0;
$("#changeColor").on("click", function (e) {
    chanegeColorClickedTime += 1;
    if(chanegeColorClickedTime == 0){
        displayCircles = 98
    }
    else if(chanegeColorClickedTime == 1){
        $("#percents").html('44%');
        displayCircles = 44
    }else if(chanegeColorClickedTime == 2){
        $("#percents").html('14%');
        displayCircles = 14
    }else if(chanegeColorClickedTime ==3 ){
        $("#percents").html('1%');
        displayCircles = 1
        $("#changeColor").attr('onclick', "toPage('S7')");
    }else if(chanegeColorClickedTime >=4){
    }
    updategraph();
    console.log('clicked', chanegeColorClickedTime, ' displayCircles', displayCircles)
})

   
   
