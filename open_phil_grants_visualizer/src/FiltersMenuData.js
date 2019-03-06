class FiltersMenuData {
  constructor(allData) {
    this.allData = allData
    this.data = {
      distinctFocusAreas: this.prepareOptions(this.distinctFocusAreas()),
      distinctYears: this.prepareOptions(this.distinctYears()),
      distinctOrgs: this.prepareOptions(this.distinctOrgs()),
    }
  }

  distinctFocusAreas = () => {
    return [...new Set(this.allData
      .map(datum => datum["Focus Area"]))]
      .sort();
  }

  distinctYears = () => {
    return [...new Set(this.allData
      .map(datum => datum["Date"].match(/(\d+)\/(\d+)/)[1]))]
      .sort((a, b) => b - a);
  }

  distinctOrgs = () => {
    return [...new Set(this.allData
      .map(datum => datum["Organization Name"].trim()))]
      .sort();
  }

  prepareOptions(list) {
    return [
      { text: '', value: '' },
      ...list.map(item => ({ text: item, value: item }))
    ];
  }
}

export default FiltersMenuData;
