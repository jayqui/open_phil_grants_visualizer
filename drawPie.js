import * as d3 from 'd3';

export default function (id, grantGroup) {
  appendDiv(id, function() {
    var svg = d3.select("#" + id).append("svg:svg"),
        width = 700,
        height = 700,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.attr("width", width).attr("height", height);

    var pie = d3.pie()
          .sort(null)
          .value((d) => d["Grant Amount"])

    var color = d3.scaleOrdinal(nRandomColors(grantGroup.length));

    var path = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0)

    var label = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40)

    var arc = g.selectAll(".arc")
          .data(pie(grantGroup))
          .enter()
            .append("g")
            .attr("class", "arc-" + id)

    arc.append("path")
      .attr("d", path)
      .attr("fill", (d, i) => color(i))

    arc.append("text")
      .data(pie(grantGroup))
      .attr("transform", (d) => "translate(" + label.centroid(d) + ")")
      .text(d => d.data["Organization id"] + ", $" + d.data["Grant Amount"])
  });
}

function randomColor() {
  const ColorStr = ["#"];
  const CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

  for(let i = 0; i < 6; i++) {
    let randIdx = Math.floor(Math.random() * CHARS.length);
    ColorStr.push(CHARS[randIdx]);
  }

  return ColorStr.join("");
}

function nRandomColors(n) {
  const colors = [];

  for(let i = 0; i < n; i++) {
    colors.push(randomColor());
  }

  return colors;
}

function appendDiv(id, cb) {
  var div = document.createElement("div");
  div.id = id;
  div.class = "Pie Chart";
  document.body.appendChild(div);

  if(document.getElementById(id)) {
    return cb();
  } else {
    throw Error;
  }
}
