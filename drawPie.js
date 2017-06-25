import * as d3 from 'd3';

export default function (id, grantGroup) {
  appendDiv(id, function () {
    let selectedSliceText;
    let sum = grantGroup.reduce((s, g) => s + g['Grant Amount'], 0),
        svg = d3.select("#" + id).append("svg:svg"),
        margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 500 + Math.pow(Math.log(sum , 2), 2) - margin.left,
        height = 500 + Math.pow(Math.log(sum, 2), 2) - margin.top,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" +
                                  width / 2 + margin.left + "," +
                                  height / 2 +  margin.top + ")"
                                );

    svg.attr("width", width).attr("height", height);

    let pie = d3.pie()
          .sort(null)
          .value((d) => d["Grant Amount"])

    let color = d3.scaleOrdinal(nRandomColors(grantGroup.length));

    let path = d3.arc()
          .outerRadius(radius - 60)
          .innerRadius(100)
          .cornerRadius(10)

    let label = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(radius - 40)

    let arc = g.selectAll(".arc")
          .data(pie(grantGroup))
          .enter()
            .append("g")
            .attr("class", "arc-" + id)

    // New plan: fit grant description, title and links in the center of the pie chart
    arc.append("text")
      .data(pie(grantGroup))
      .attr("transform", (d) => {
        let center = path.centroid(d),
            x = center[0],
            y = center[1],
            h = Math.sqrt(x * x + y * y);

        return "translate(" + Math.floor((x / h)) + 30 + "," +
                              Math.floor((y / h)) + ")";
      })
      .attr("id", (d) => id + "-text-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
      .style("display", "none")
      .html(d => d.data["Organization Name"].toLocaleString())

    arc.append("path")
      .attr("d", path)
      .attr("fill", (d, i) => color(i))
      .on("mouseover", (d, i) => centerText(d, i))

    function centerText(d,i) {
      let text = d3.select("#" + id + "-text-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""));

      if(!selectedSliceText || text.attr("id") !== selectedSliceText.attr("id")) {
        if(selectedSliceText) selectedSliceText.style("display", "none");
        text.style("display", "block");
        selectedSliceText = text;
      }
    }

  });
}

function randomColor() {
  let colorStr = "#";
  const CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

  for(let i = 0; i < 6; i++) {
    let randIdx = Math.floor(Math.random() * CHARS.length);
    colorStr += CHARS[randIdx];
  }

  return colorStr;
}

function nRandomColors(n) {
  const colors = [];

  for(let i = 0; i < n; i++) {
    colors.push(randomColor());
  }

  return colors;
}

function appendDiv(id, callback) {
  var div = document.createElement("div");
  div.id = id;
  div.class = "pie-chart";
  document.body.appendChild(div);

  if(document.getElementById(id)) {
    return callback();
  } else {
    throw Error;
  }
}
