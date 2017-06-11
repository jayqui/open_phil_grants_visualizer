import * as d3 from 'd3';
import _ from 'lodash';

d3.csv('databasexls.csv', function(data) {
  const dataByFocusArea = _.groupBy(data, 'Focus Area');

  listDataByFocusArea(dataByFocusArea);
});

function listDataByFocusArea(dataByFocusArea) {
  Object.keys(dataByFocusArea).forEach((focusArea, index) => {
    appendNewElement(textElement('h1', focusArea));

    const grantGroup = dataByFocusArea[focusArea];
    listDataInGrantGroup(grantGroup);
  })
}

function listDataInGrantGroup(grantGroup) {
  grantGroup.forEach((grantData, index) => {
    appendNewElement(textElement('p', grantText(grantData, index)));
  });
}

function textElement(htmlTag, text) {
  let newElement = document.createElement(htmlTag)
  newElement.textContent = text;
  return newElement;
}

function appendNewElement(textElement) {
  document.body.appendChild(textElement);
}

function grantText(grantData, index) {
  return `${index + 1}) ${grantData.Grant} | ${grantData["Grant Amount"]}`;
}
