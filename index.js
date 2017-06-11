import * as d3 from 'd3';
<<<<<<< HEAD
import drawPie from './drawPie';

d3.csv('databasexls.csv', function(data) {
  data.forEach((datum, index) => {
    datum["Grant Amount"] = parseInt(datum["Grant Amount"].replace(/\D/g, ""));
    FOCUS_AREA_MAPPING[datum["Focus Area"]].push(datum);
  });

  for (let key in FOCUS_AREA_MAPPING) {
    let grantObjArr = FOCUS_AREA_MAPPING[key],
        name = key.replace(/\W|\s/g, "");

    drawPie(name, grantObjArr);
  }
});

const GLOBAL_HEALTH = [];
const BIOSECURITY = [];
const CRIMINAL_JUSTICE = [];
const FARM_ANIMAL_WELFARE = [];
const HISTORY_OF_PHIL = [];
const LAND_USE = [];
const MACROECONOMIC_POLICY = [];
const OTHER_AREAS = [];
const RISKS_FROM_AI = [];
const INTELLIGENCE = [];
const SCIENTIFIC_RESEARCH = [];
const CATASTROPHIC_RISKS = [];
const IMMIGRATION = [];
const USPOLICY = [];

// Maps focus area string to relevant const
const FOCUS_AREA_MAPPING = {
  "Criminal Justice Reform": CRIMINAL_JUSTICE,
  "Farm Animal Welfare": FARM_ANIMAL_WELFARE,
  "Macroeconomic Stabilization Policy": MACROECONOMIC_POLICY,
  "Immigration Policy": IMMIGRATION,
  "Land Use Reform": LAND_USE,
  "History of Philanthropy": HISTORY_OF_PHIL,
  "Biosecurity and Pandemic Preparedness": BIOSECURITY,
  "Potential Risks from Advanced Artificial Intelligence": RISKS_FROM_AI,
  "Global Catastrophic Risks": CATASTROPHIC_RISKS,
  "Scientific Research": SCIENTIFIC_RESEARCH,
  "Global Health & Development": GLOBAL_HEALTH,
  "Other areas": OTHER_AREAS,
  "U.S. Policy": USPOLICY
};
=======
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
>>>>>>> master
