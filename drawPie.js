/**
  Todo:
    animate slice selection,
    add links
    style
*/


import * as d3 from 'd3';

export default function (id, grantGroup) {
  appendDiv(id, function () {
    let selectedSlice, selectedSliceName, selectedSliceAmount;
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

    // Draw curve in circle
    let nameCurve = arc.append("path")
      .attr("transform", () => `translate(${-width / 8.25},${-height / 8})`)
      .attr("id", `OrgNameCurve-${grantGroup[0]["Focus Area"]}`)
      .attr("d", "M10 80 Q 95 10 180 80")
      .style("fill", "none")
      .style("stroke", "0")

    let amountCurve = arc.append("path")
      .attr("transform", () => `translate(${-width / 8.25},${-height / 12})`)
      .attr("id", `AmountCurve-${grantGroup[0]["Focus Area"]}`)
      .attr("d", "M10 80 Q 95 170 180 80")
      .style("fill", "none")
      // .style("stroke", "line")

    let centerPath = arc.append("path")
        .attr("id", `CenterPath-${grantGroup[0]["Focus Area"]}`)
        .attr("d", `M ${-width} 0 Q ${-width} 0 ${width} 0`)
        .style("stroke", "none")

    // Attach grant name to curve
    arc.append("text")
      .append("textPath")
      .data(pie(grantGroup))
      .attr("xlink:href", (d) => `#OrgNameCurve-${d.data["Focus Area"]}`)
      .attr("id", (d) => id + "-text-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
      .attr("startOffset", "50%")
      .attr("fill", (d, i) => color(i))
      .style("display", "none")
      .style("text-anchor","middle") //place the text halfway on the arc
      .text(d => `${parseOrgName(d.data["Organization Name"])}`)
      .on("mouseover", (d) => toggleOrgNameTooltip(id, d))
      .on("mouseout", (d) => toggleOrgNameTooltip(id, d))

    // Append grantAmount
    arc.append("text")
      .append("textPath")
      .data(pie(grantGroup))
      .attr("xlink:href", (d) => `#AmountCurve-${d.data["Focus Area"]}`)
      .attr("fill", (d, i) => color(i))
      .attr("id", (d) => id + "-amount-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
      .attr("startOffset", "50%")
      .style("text-anchor","middle") //place the text halfway on the arc
      .style("display", "none")
      .style("height", "100")
      .html(d => {
        return `$${d.data["Grant Amount"].toLocaleString()}`
      })

    // Draw org name tooltips
    arc
     .data(pie(grantGroup))
     .append("text")
     .append("textPath")
     .attr("xlink:href", (d) => `#CenterPath-${d.data["Focus Area"]}`)
     .attr("id", (d) => id + "-tooltip-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
     .attr("fill", (d, i) => color(i))
     .attr("startOffset", "50%")
     .style("display", "none")
     .style("text-anchor","middle")
     .text((d) => {
       if(d.data["Organization Name"].length > 27) {
        return d.data["Organization Name"]
      } else {
        return "";
      }
     })

    // Draw arcs
    arc.append("path")
      .attr("d", path)
      .attr("id", (d, i) => `arc-${id}-${i}`)
      .attr("fill", (d, i) => color(i))
      .on("mouseover", (d, i) => centerText(id, d, i))
      .on("mouseenter", function(d, i) {
        selectedSlice = d3.select(this);

        resetOtherSlices(id, i)

        selectedSlice
          .transition()
          .duration(1000)
          .attr("d", path.outerRadius(radius - 45))
      })
      .on("mouseleave", function(d) {
        selectedSlice = undefined;
      })

    function resetOtherSlices(id, selectedId) {
      let arcs = d3.selectAll(`.arc-${id}`)
      for(let i = 0; i <  arcs.nodes().length; i++) {
        if(selectedId === i) continue;
        let node = d3.select(`#arc-${id}-${i}`);

        node
          .transition()
          .duration(1000)
          .attr("d", path.outerRadius(radius - 60));
      }
    }

    function centerText(id, d,i) {
      let text = d3.select("#" + id + "-text-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, "")),
          amount = d3.select("#" + id + "-amount-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""));

      if(!selectedSliceName || text.attr("id") !== selectedSliceName.attr("id")) {
        if(selectedSliceName) selectedSliceName.style("display", "none");
        if(selectedSliceAmount) selectedSliceAmount.style("display", "none");

        text.style("display", "block");
        amount.style("display", "block");
        selectedSliceName = text;
        selectedSliceAmount = amount;
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

/**
  Helper methods
*/

// Try this instead: https://bl.ocks.org/mbostock/7555321
function orgFontSize(name) {
  let sizeDiff = name.length - 30 > 0 ? name.length - 30 : 0;

  if(sizeDiff === 0) return "16px";

  let timesDecrement = Math.ceil(sizeDiff / 8),
      size = 16 - (timesDecrement * 1);

  return size + "px";
}

function parseOrgName(name) {
  if(name.length > 27) {
    let parsedName = [],
        splitName = name.split(" ");

    if(["A", "An", "The", "Of"].indexOf(splitName[0]) != -1) {
      splitName.shift();
    }

    for(let i = 0; i < splitName.length; i++) {
      let word = splitName[i];

      if(word[0] && word[0] === word[0].toUpperCase()) parsedName.push(word[0]);
    }

    return parsedName.join(" ");
  }

  return name;
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

function toggleOrgNameTooltip(id, d) {
  let tooltipId = id + "-tooltip-" + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""),
      tooltip = d3.selectAll("#" + tooltipId);

  if(tooltip.style("display") === "none") {
    tooltip.style("display", "block");
  } else {
    tooltip.style("display", "none");
  }
}
