import * as d3 from 'd3';
import _ from 'lodash';

import drawPie from './drawPie';

d3.csv('database.csv', function(data) {
  const dataByFocusArea = _.groupBy(data, 'Focus Area');

  listDataByFocusArea(dataByFocusArea);
});

function listDataByFocusArea(dataByFocusArea) {
  Object.keys(dataByFocusArea).forEach((focusArea, index) => {
    let id = focusArea.replace(/\W|\s/g, "").toLowerCase(),
        grantGroup = dataByFocusArea[focusArea];

    grantGroup = deleteUndisclosed(grantGroup);

    appendNewTextElement(textElement('h1', focusArea));
    appendNewAnchorElement(id);

    // listDataInGrantGroup(grantGroup);

    grantGroup.forEach(grant =>
      grant["Grant Amount"] = parseInt(grant["Grant Amount"].replace(/\D/g, ""))
    );

    drawPie(id, grantGroup);
  })
}

function deleteUndisclosed(grantGroup) {
  const disclosed = [];

  for(let grant of grantGroup) {
    if(grant["Grant Amount"]) {
      disclosed.push(grant);
    }
  }

  return disclosed;
}

// function listDataInGrantGroup(grantGroup) {
//   grantGroup.forEach((grantData, index) => {
//     appendNewTextElement(textElement('p', grantText(grantData, index)));
//   });
// }

function appendNewAnchorElement(href) {
  let a = document.createElement("a");
  a.href = href;
  document.body.appendChild(a);
}

function textElement(htmlTag, text) {
  let newElement = document.createElement(htmlTag)
  newElement.textContent = text;
  return newElement;
}

function appendNewTextElement(textElement) {
  document.body.appendChild(textElement);
}

function grantText(grantData, index) {
  return `${index + 1}) ${grantData.Grant} | ${grantData["Grant Amount"]}`;
}
