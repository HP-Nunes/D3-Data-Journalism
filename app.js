var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 160,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial X Params
var chosenXAxis = "G_Income";

// function used for updating x-scale var upon click on axis label
function xScale(csvData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csvData, d => d[chosenXAxis]) * 0.8,
      d3.max(csvData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "G_Income") {
        var label = "Value: ";
    }
    else if (chosenXAxis === "V_Income") {
        var label = "Value: ";
    }
    else if (chosenXAxis === "G_Dis") {
        var label = "Value: ";
    }
    else if (chosenXAxis === "V_Dis") {
        var label = "Value: ";
    }
    else if (chosenXAxis === "G_Ed") {
        var label = "Value: ";
    }
    else {
        var label = "Value: ";
    }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, 60])
    .html(function(d) {
      return (`${d.State}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, csvData) {
  if (err) throw err;

  // parse data
  csvData.forEach(function(data) {
    data.G_Income = +data.G_Income;
    data.V_Income = +data.V_Income;
    data.G_Dis = +data.G_Dis;
    data.V_Dis = +data.V_Dis;
    data.G_Ed = +data.G_Ed;
    data.V_Ed = +data.V_Ed;
    data.limProb = +data.limProb;
    data.diffConc = +data.diffConc;
    data.phyAct = +data.phyAct;
    data.genHealth = +data.genHealth;
  });

  console.log(csvData)

  // xLinearScale function above csv import
  var xLinearScale = xScale(csvData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(csvData, d => d.limProb)])
  .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.limProb))
    .attr("r", 5)
    .attr("fill", "blue")
    .attr("opacity", ".55");

  // Create group for  6 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/4}, ${height + 20})`);

  var G_IncomeLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "G_Income") // value to grab for event listener
    .classed("active", true)
    .text("Estimated Median Income--inflation-adjusted dollar--for the Civilian Population");

  var V_IncomeLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "V_Income") // value to grab for event listener
    .classed("inactive", true)
    .text("Estimated Median Income--inflation-adjusted dollar--for the Veteran Population");

    var G_DisLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "G_Dis") // value to grab for event listener
    .classed("inactive", true)
    .text("Estimated Percentage of the General Population with any Disability");
    
    var V_DisLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "V_Dis") // value to grab for event listener
    .classed("inactive", true)
    .text("Estimated Percentage of the Veteran Population with any Disability");

    var G_EdLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 100)
    .attr("value", "G_Ed") // value to grab for event listener
    .classed("inactive", true)
    .text("Estimated Percentage of the General Population over 25 with less than a High School Diploma");

    var V_EdLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 120)
    .attr("value", "V_Ed") // value to grab for event listener
    .classed("inactive", true)
    .text("Estimated Percentage of the Veteran Population over 25 with less than a High School Diploma");

  var limProbLabels = labelsGroup.append("text")
    .attr("x", 100)
    .attr("y", 0)
    .attr("value", "limProb") // value to grab for event listener
    .classed("active", true)
    .text("")
    .classed("active", true)
    .classed("inactive", false);;

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        xLinearScale = xScale(csvData, chosenXAxis);

        // updates y axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "V_Income") {
        V_IncomeLabels
            .classed("active", true)
            .classed("inactive", false);
        G_IncomeLabels
            .classed("active", false)
            .classed("inactive", true);
        G_DisLabels
            .classed("active", false)
            .classed("inactive", true);
        V_DisLabels
            .classed("active", false)
            .classed("inactive", true);
        G_EdLabels
            .classed("active", false)
            .classed("inactive", true);
        V_EdLabels
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "G_Income"){
            V_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_IncomeLabels
                .classed("active", true)
                .classed("inactive", false);
            G_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            V_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            G_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            V_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else if (chosenXAxis === "G_DisLabels"){
            V_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_DisLabels
                .classed("active", true)
                .classed("inactive", false);
            V_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            G_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            V_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else if (chosenXAxis === "V_DisLabels"){
            V_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            V_DisLabels
                .classed("active", true)
                .classed("inactive", false);
            G_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            V_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else if (chosenXAxis === "G_EdLabels"){
            V_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            V_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            G_EdLabels
                .classed("active", true)
                .classed("inactive", false);
            V_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else {
            V_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_IncomeLabels
                .classed("active", false)
                .classed("inactive", true);
            G_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            V_DisLabels
                .classed("active", false)
                .classed("inactive", true);
            G_EdLabels
                .classed("active", false)
                .classed("inactive", true);
            V_EdLabels
                .classed("active", true)
                .classed("inactive", false);
        }
      }
    });
});
