import * as d3 from 'd3';

d3.csv('databasexls.csv', function(data) {
  data.forEach((datum, index) => {
    let paragraph = document.createElement('p')
    paragraph.textContent = `${index + 1}) ${datum.Grant} | ${datum["Grant Amount"]}`;
    document.body.appendChild(paragraph);
  });
});
