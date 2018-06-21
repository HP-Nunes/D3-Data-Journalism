var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
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

// Initial Y Params
var chosenYAxis = "limProb";

// function used for updating y-scale var upon click on axis label
function yScale(csvData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(csvData, d => d[chosenYAxis]) * 0.8,
        d3.max(csvData, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, width]);
  
    return yLinearScale;
  
  }
  
  // function used for updating yAxis var upon click on axis label
  function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXaxis, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d =>newYScale(d[chosenYaxis]))
    ;

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "G_Income") {
        var label = "Estimated Median Income--inflation-adjusted dollar--for the Civilian Population";
    }
    else if (chosenXAxis === "V_Income") {
        var label = "Estimated Median Income--inflation-adjusted dollar--for the Veteran Population";
    }
    else if (chosenXAxis === "G_Dis") {
        var label = "Estimated Percentage of the General Population with any Disability";
    }
    else if (chosenXAxis === "V_Dis") {
        var label = "Estimated Percentage of the Veteran Population with any Disability";
    }
    else if (chosenXAxis === "G_Ed") {
        var label = "Estimated Percentage of the General Population over 25 with less than a High School Diploma";
    }
    else {
        var label = "Estimated Percentage of the Veteran Population over 25 with less than a High School Diploma";
    }

    if (chosenYAxis === "limProb") {
      var label = "Adults who are limited in any activities because of physical, mental, or emotional problems";
    }
    else if (chosenYAxis === "diffConc") {
      var label = "Do you have serious difficulty concentrating, remembering, or making decisions?";
    }
    else if (chosenYAxis === "phyAct") {
      var label = "During the past month, did you participate in any physical activities?";
    }
    else {
      var label = "How is your general health? (Poor)";
    }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.State}<br>${label} ${d[chosenXAxis]}<br>${label} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
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

  var yLinearScale = yScale(csvData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".55");

  // Create group for  6 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

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
    .attr("y", 40)
    .attr("value", "G_Dis") // value to grab for event listener
    .classed("inactive", true)
    .text("");
    
    var V_DisLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "V_Dis") // value to grab for event listener
    .classed("inactive", true)
    .text("");

    var G_EdLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "G_Ed") // value to grab for event listener
    .classed("inactive", true)
    .text("");

    var V_EdLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "V_Ed") // value to grab for event listener
    .classed("inactive", true)
    .text("");

  var limProbLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "limProb") // value to grab for event listener
    .classed("active", true)
    .text("");

  var diffConcLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "diffConc") // value to grab for event listener
    .classed("inactive", true)
    .text("");

    var phyActLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "phyAct") // value to grab for event listener
    .classed("inactive", true)
    .text("");

    var genHealthLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "genHealth") // value to grab for event listener
    .classed("inactive", true)
    .text("");

    // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // y axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(csvData, chosenXAxis);

        // updates y axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "limProb") {
        limProbLabels
            .classed("active", true)
            .classed("inactive", false);
        diffConcLabels
            .classed("active", false)
            .classed("inactive", true);
        phyActLabels
            .classed("active", false)
            .classed("inactive", true);
        genHealthLabels
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "diffConcLabels") {
            limProbLabels
                .classed("active", false)
                .classed("inactive", true);
            diffConcLabels
                .classed("active", true)
                .classed("inactive", false);
            phyActLabels
                .classed("active", false)
                .classed("inactive", true);
            genHealthLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else if (chosenYAxis === "phyActLabels") {
            limProbLabels
                .classed("active", false)
                .classed("inactive", true);
            diffConcLabels
                .classed("active", false)
                .classed("inactive", true);
            phyActLabels
                .classed("active", true)
                .classed("inactive", false);
            genHealthLabels
                .classed("active", false)
                .classed("inactive", true);
            }
        else {
            limProbLabels
                .classed("active", false)
                .classed("inactive", true);
            diffConcLabels
                .classed("active", false)
                .classed("inactive", true);
            phyActLabels
                .classed("active", false)
                .classed("inactive", true);
            genHealthLabels
                .classed("active", true)
                .classed("inactive", false);
        }
      }
    });
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
        // updates x scale for new data
        xLinearScale = xScale(csvData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
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
