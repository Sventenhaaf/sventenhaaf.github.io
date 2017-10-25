var post = document.getElementById("post");
post.addEventListener("click", e => {
  var imgEl = post.childNodes[1];
  if (imgEl.src.split("/postnieuw.gif").length !== 2) {
    [3].forEach(n => {
      post.childNodes[n].style.display = "none"
    })
    imgEl.src = "./img/postnieuw.gif";
  } else {
    [3].forEach(n => {
      post.childNodes[n].style.display = "block"
    })
    imgEl.src = "./img/post.png";
  }
})














var svg = d3.select("svg")
var colors = ["#FE6610", "#346164", "#111111", "#346164", "#00A8AF", "#346164", "#465D6D", "#346164", "#2C88AF", "#346164"]
var indices = d3.range(0, colors.length);
svg.selectAll("rect")
    .data(indices, function(d) { return d; })
    .enter()
  .append("rect")
    .attr("class", "block")
    .attr("y", 30)
    .attr("x", function(d, i) { return i * 30 + 10; })
    .attr("width", 2)
    .attr("height", 2)
    .attr('opacity', 0)
    .style("fill", function(d) { return colors[d]; })
    .transition()
      .delay(function(d,i) {
        return Math.pow(i, 1/8) * 300;
      })
      .duration(500)
      .attr('opacity', 1)
      .attr('width', 20)
      .attr('height', 20)
      .ease("elastic")

var exitdata = [];
indices.forEach(function(el) { if (el % 2 === 0) { exitdata.push(el); }})
update(exitdata);

function update(data) {
  var byeblocks = svg.selectAll("rect")
    .data(data, function(d) { return d; });

  var stayblock = svg.selectAll("rect")
    .data(data, function(d) {return d - 1; })
        .attr("class", "update")
      .transition()
        .delay(1000)
        .duration(500)
        .attr("x", function(d) { return 15 * d + 85 })
        .ease("elastic")

  byeblocks.exit()
      .attr("class", "exit")
    .transition()
      .delay(500)
      .style("fill", "#aac")
    .transition()
      .duration(500)
      .attr("y", 160)
      .style("fill-opacity", 1e-6)
      .remove();
}


// ========== TEXT ============= //

d3.select(".title")
  .transition()
  .delay(1000)
  .duration(500)
  .style("opacity", "1")

d3.select("#section1")
  .transition()
  .delay(1150)
  .duration(500)
  .style("opacity", "1")


d3.select("#section2")
  .transition()
  .delay(1300)
  .duration(500)
  .style("opacity", "1")


d3.select("#section3")
  .transition()
  .delay(1450)
  .duration(500)
  .style("opacity", "1")










///
