var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);


var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

var svg = d3.select("body").insert("svg",":first-child")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
var xg = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")");
xg
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end");
      
var yg = svg.append("g")
      .attr("class", "y axis");
yg
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end");
      
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

function update(){
  
  var xVar = d3.select('#xAXs').node().value,
    yVar = d3.select('#yAXs').node().value;
    
  var checks = {};
  d3.selectAll('input[type=checkbox]').each(function(){
    checks[this.value] = this.checked;
  });
  
  var radAttr = d3.select('input[type=radio]:checked').node().value;
  
  var data = baseData.filter(function(d,i){
    d.x = d[xVar];
    d.y = d[yVar];
    return checks[d.species];
  });

  // set domains
  x.domain(d3.extent(data, function(d) { return d.x; })).nice();
  y.domain(d3.extent(data, function(d) { return d.y; })).nice();

  xg.call(xAxis);
  yg.call(yAxis);
  
  xg.select("text").text(xVar);
  yg.select("text").text(yVar);
  
  // on enter
  var circles = svg.selectAll(".dot")
    .data(data);
    
  circles.enter()
    .append("circle")
    .attr("class", "dot");
    
  circles.exit().remove();

  // on update
  circles.attr("cx", function(d) { return x(d.x); })
    .attr("cy", function(d) { return y(d.y); })
    .style("fill", function(d) { return color(d.species); })
    .attr("r", function(d){ return d[radAttr]; });

}

var baseData = null;
d3.csv("data.csv", function(error, csv) {
  csv.forEach(function(d) {
    d.petalLength = +d.petalLength;
    d.petalWidth = +d.petalWidth;
    d.sepalLength = +d.sepalLength;
    d.sepalWidth = +d.sepalWidth;
  });
  baseData = csv;
  update("petalWidth","petalLength");
});

d3.selectAll('select').on('change',function(){
  update();
});

d3.selectAll('input').on('click', function(){
  update();
})