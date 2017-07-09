import * as d3 from 'd3';

export default function (id, grantGroup) {
  appendCard(id,
             grantGroup[0]["Focus Area URL"],
             grantGroup[0]["Focus Area"],
  function () {
    let selectedSlice, selectedSliceName, selectedSliceAmount;
    let sum = grantGroup.reduce((s, g) => s + g['Grant Amount'], 0),
        svg = d3.select("#" + id).append("svg:svg"),
        margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 700 - margin.left,
        height = 700 - margin.top,
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" +
                                  width / 2 + "," +
                                  height / 2 + ")"
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
      .attr("transform", () => `translate(${-width / 7},${-height / 7})`)
      .attr("id", `OrgNameCurve-${grantGroup[0]["Focus Area"]}`)
      .attr("d", "M10 80 Q 95 10 180 80")
      .style("fill", "none")
      .style("stroke", "0")

    let amountCurve = arc.append("path")
      .attr("transform", () => `translate(${-width / 7},${-height / 12})`)
      .attr("id", `AmountCurve-${grantGroup[0]["Focus Area"]}`)
      .attr("d", "M10 80 Q 95 170 180 80")
      .style("fill", "none")

    let centerPath = arc.append("path")
        .attr("id", `CenterPath-${grantGroup[0]["Focus Area"]}`)
        .attr("d", `M ${-width} 0 Q ${-width} 0 ${width} 0`)
        .style("stroke", "none")

    // Attach grant name to curve
    arc.append("text")
      .append("textPath")
      .data(pie(grantGroup))
      .attr("xlink:href", (d) => `#OrgNameCurve-${d.data["Focus Area"]}`)
      .attr("id", (d) => "name" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
      .attr("startOffset", "50%")
      .attr("fill", (d, i) => color(i))
      .style("display", "none")
      .style("text-anchor","middle") //place the text halfway on the arc
      .style("color", (d, i) => color(i))
      .html(d => `
        <a href="${d.data["Organization Website"]}">
        ${parseOrgName(d.data["Organization Name"])}
        </a>
      `)
      .on("mouseover", (d) => toggleOrgNameTooltip(id, d))
      .on("mouseout", (d) => toggleOrgNameTooltip(id, d))

    // Append date to curve
    // arc.append("text")
    //   .append("textPath")
    //   .data(pie(grantGroup))
    //   .attr("xlink:href", (d) => `#OrgNameCurve-${d.data["Focus Area"]}`)
    //   .attr("id", (d) => "name" + id + d.data["Date"].toLocaleString().replace(/\W|\s/g, ""))
    //   .attr("startOffset", "50%")
    //   .attr("fill", (d, i) => color(i))
    //   .attr("transform", () => `translate(${100},${100})`)
    //   .style("display", "none")
    //   .style("text-anchor","middle") //place the text halfway on the arc
    //   .text(d => `${d.data["Date"]}`)
    //   .on("mouseover", (d) => toggleOrgNameTooltip(id, d))
    //   .on("mouseout", (d) => toggleOrgNameTooltip(id, d))


    // Append grantAmount
    arc.append("text")
      .append("textPath")
      .data(pie(grantGroup))
      .attr("xlink:href", (d) => `#AmountCurve-${d.data["Focus Area"]}`)
      .attr("id", (d) => "amount-" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
      .attr("startOffset", "50%")
      .attr("fill", (d, i) => color(i))
      .style("text-anchor","middle") //place the text halfway on the arc
      .style("display", "none")
      .style("height", "100")
      .html(d => {
        return `
        <a href="${d.data["URL"]}">
          $${d.data["Grant Amount"].toLocaleString()}
        </a>`
      })
      .style("color", (d, i) => color(i) )

    // Draw org name tooltips
    arc
     .data(pie(grantGroup))
     .append("text")
     .append("textPath")
     .attr("xlink:href", (d) => `#CenterPath-${d.data["Focus Area"]}`)
     .attr("id", (d) => "tooltip" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""))
     .attr("fill", (d, i) => color(i))
     .attr("startOffset", "50%")
     .style("display", "none")
     .style("text-anchor","middle")
     .text((d) => {
       if(d.data["Organization Name"].length > 27) {
        return `(${d.data["Organization Name"]})`
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
      .html(d => {
        return `
        <a href="${d.data["URL"]}">
          $${d.data["Grant Amount"].toLocaleString()}
        </a>`
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
      let text = d3.select("#" + "name" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, "")),
          amount = d3.select("#" + "amount-" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, "")),
          date = d3.select("#" + "name" + id + d.data["Date"].toLocaleString().replace(/\W|\s/g, ""));

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

function appendCard(id, url, focusArea, callback) {
  createCard(id, url, focusArea);
  var div = document.createElement("div");
  div.id = id;
  div.class = "pie-chart";
  document.getElementById(`${id}-card`).appendChild(div);

  if(document.getElementById(id)) {
    return callback();
  } else {
    throw Error;
  }
}

function toggleOrgNameTooltip(id, d) {
  let tooltipId = "tooltip" + id + d.data["Organization Name"].toLocaleString().replace(/\W|\s/g, ""),
      tooltip = d3.selectAll("#" + tooltipId);

  if(tooltip.style("display") === "none") {
    tooltip.style("display", "block");
  } else {
    tooltip.style("display", "none");
  }
}

function createCard(id, url, focusArea) {
  let row = document.createElement('div');
  row.classList.add("row");
  row.innerHTML = `<div class="col s12 m7">
    <div class="card">
      <div class="card-image" id="${id}-card">
        <span class="card-title">${id}</span>
      </div>
      <div class="card-content">
        <p></p>
      </div>
      <div class="card-action">
        <a href=${url}>Open Phil: ${focusArea}</a>
      </div>
    </div>
  </div>`;

  document.body.appendChild(row)
}
