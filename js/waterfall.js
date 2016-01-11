// the data that will come from external csv file / JSON - later on:

// source: https://investor.google.com/pdf/2014Q4_google_earnings_data.pdf
var originalData = [
  {"entry": "Revenues",
  "amount": "66001"},
  {"entry": "Cost of Revenues",
  "amount": "-25691"},
  {"entry": "Research and Development",
  "amount": "-9832"},
  {"entry": "Sales and Marketing",
  "amount": "-8131"},
  {"entry": "General and Administrative",
  "amount": "-5851"},
  {"entry": "Income from Operations",
  "sum": "true"},
  {"entry": "Interest and other income",
  "amount": "763"},
  {"entry": "Income from continuing operations before income taxes",
  "sum": "true"},
  {"entry": "Provision for income taxes",
  "amount": "-3331"},
  {"entry": "Net income from continuing operations",
  "sum": "true"},
  {"entry": "Net income from discontinued operations",
  "amount": "516"},
  {"entry": "Net income",
  "sum": "true"}
];

// settings
var spacing = 0.3;
var data = [], total = 0, lineData = [], lineHeight = 0;
var currency = "$";
var labelWidth = 100;
var labelPadding = 5;
var labelLines;
var labelMarginAboveRect = 10;

originalData.slice(0, data.length - 1).forEach(function(el) {
  if(type(el["amount"])) { lineHeight += type(el["amount"]); }
  lineData.push({
    x: el["entry"],
    y: lineHeight
  });
})

originalData.forEach(function(el) {
  if (!type(el["amount"])) {
    data.push({
      entry:      el["entry"],        // Label name for entry
      color:      "#666",             // color to give to bar
      lowValue:   d3.min([0, total]), // lowest value of the bar - used to determine lowerBound of Y axis
      yStart:     d3.max([0, total]), // upper value of the bar - used for starting y coordinate
      numLabel:   total               // Label number for entry
    })
  }
  else if (type(el["amount"]) > 0) {
    data.push({
      entry:      el["entry"],
      color:      "#093",
      lowValue:   total,
      yStart:     total + type(el["amount"]),
      numLabel:   type(el["amount"])
    })
    total += type(el["amount"]);
  }
  else {
    data.push({
      entry:      el["entry"],
      color:      "#f60",
      lowValue:   total + type(el["amount"]),
      yStart:     total,
      numLabel:   type(el["amount"])
    })
    total += type(el["amount"]);
  }
})

function type(d) { return +d;}

var margin = {top: 20, right: 10, bottom: 220, left: 60},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], spacing);

var xLine = d3.scale.ordinal()
  .rangeRoundBands([])

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10);

var svg = d3.select("#waterfall").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lowerBound = d3.min([0, d3.min(data, function(d) { return d.lowValue; })]);
  x.domain(data.map(function(d) { return d.entry}));
  y.domain([lowerBound, d3.max(data, function(d) { return d.yStart; })]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Balance [millions of dollars]");

var rects = svg.selectAll(".rect")
    .data(data)
  .enter().append("rect")
    .attr("class", "rect")
    .attr("x", function(d) { return x(d.entry); })
    .attr("width", x.rangeBand())
    .attr("fill", function(d) { return d.color; })
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("y", height)
    .attr("height", 0)
  rects.transition()
    .duration(1200)
    .attr("y", function(d) { return y(d.yStart); })
    .attr("height", function(d) { return y(d.lowValue) - y(d.yStart) })
    .attr("entry", function(d) { return d.entry; })
    .attr("numLabel", function(d) { return d.numLabel; });

var dottedLineLength = spacing / (1-spacing);
svg.selectAll(".line")
    .data(lineData)
  .enter().append("line")
  .attr("class", "line")
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", ("2, 2"))
  .attr("x1", function(d) { return x(d.x) + x.rangeBand(); })
  .attr("x2", function(d) { return x(d.x) + (1 + dottedLineLength) * x.rangeBand(); })
  .attr("y1", height)
  .attr("y2", height)
  .transition()
  .duration(1200)
  .attr("y1", function(d) { return y(d.y); })
  .attr("y2", function(d) { return y(d.y); });

function wrap(text, width, alignCentre) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineLength,
        oldLineLength,
        lineNumber = 0,
        lineHeight = 1, // ems
        y = text.attr("y"),
        firstWord = false,
        dy = 0,
        dx,
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", 0);
    while (firstWord || !!(word = words.pop())) {
      if (!firstWord) line.push(word);
      else firstWord = false;
      tspan.text(line.join(" "));
      oldLineLength = lineLength;
      lineLength = tspan.node().getComputedTextLength();
      labelLines = lineNumber + 1;
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        if (alignCentre) {
          dx = (width - oldLineLength) / 2;
          d3.select(this.lastChild).attr("dx", dx)
          firstWord = true;
        }
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", 0).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
    if (alignCentre) {
      lineLength = tspan.node().getComputedTextLength();
      dx = (width - lineLength) / 2;
      d3.select(this.lastChild).attr("dx", dx)
    }
  });
}

var currencyFormat = d3.format(",");

var label = svg.append("g")
  .attr("id", "label")

var labelBackground = label.append("rect")
  .attr("fill", "#eee")
  .attr("id", "label-background")

var labelTextGroup = label.append("g")
  .attr("id", "label-text-group")

// shadowing
var filter = label.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

var labelText = labelTextGroup.append("text")
  .text("")
  .attr("id", "label-text");

var labelAmount = labelTextGroup.append("text")
  .text("")
  .attr("id", "label-amount")

function makeNewLabel(selection) {
  labelText.text(selection.attr("entry") + ":")
    .call(wrap, labelWidth - 2*labelPadding, true)
  tspan = labelAmount
    .text(currency + " " + currencyFormat(selection.attr("numLabel")) + "m")
    .call(wrap, labelWidth, true)
    .attr("dy", labelText.node().getBBox().height)
    .attr("font-weight", "700");

  var labelSpace = (labelWidth - labelTextGroup.node().getBBox().width) / 2;

  labelBackground
    .attr("height", labelTextGroup.node().getBBox().height + 2*labelPadding)
    .attr("width", labelWidth + 2 * labelPadding)
    .attr("x", labelTextGroup.node().getBBox().x - labelSpace - labelPadding)
    .attr("y", labelTextGroup.node().getBBox().y - labelPadding)
    .style("filter", "url(#drop-shadow)")

  var labelX = selection.attr("x") - (labelWidth/ 2) + (x.rangeBand() / 2);
  var labelY = d3.max([0, selection.attr("y")
    - labelTextGroup.node().getBBox().height - labelMarginAboveRect]);
  label.attr("transform", "translate(" + labelX + ", " + labelY + ")")
}

rects.on("mouseover", function(d) {
  d3.select("#label").classed("hidden", false);
  makeNewLabel(d3.select(this));
})
.on("mouseout", function() {
  d3.select("#label").classed("hidden", true);
})
