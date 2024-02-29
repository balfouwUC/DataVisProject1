// Make the scatterplot
d3.csv('Data/national_health_data (1).csv')
  .then(data => {
    console.log('Data loading complete');

    let scatterplot = new Scatterplot({
        'parentElement': '#scatterplot',
        'containerHeight': 500,
        'containerWidth': 900
    }, data);
  }).catch(error => {
    console.error('Error loading the data.');
  });

// Make the histogram
d3.csv('Data/national_health_data (1).csv')
  .then(data => {
    console.log('Data Loading complete');

    let histogram = new Histogram({
      'parentElement': '#histogram',
      'containerHeight': 500,
      'containerWidth': 900
    }, data);
  }).catch(error => {
    console.error('Error loading the data.');
  });

// Make the first map
Promise.all([
  d3.json('Data/counties-10m.json'),
  d3.csv('Data/national_health_data (1).csv')
]).then(data => {
  console.log('Data Loading complete');
  const geoData = data[0];
  const countyData = data[1];

  console.log(geoData);
  geoData.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < countyData.length; i++) {
      if(d.id == countyData[i].cnty_fips){
        d.properties.data = countyData[i];
      }
    }
  });
  const choropleth = new Choropleth({
    parentElement: '#choropleth-1',
  }, geoData)
})
.catch(error => {
  console.error('Error loading the data.')
});

// Make the second map
Promise.all([
  d3.json('Data/counties-10m.json'),
  d3.csv('Data/national_health_data (1).csv')
]).then(data => {
  console.log('Data Loading complete');
  const geoData = data[0];
  const countyData = data[1];

  console.log(geoData);
  geoData.objects.counties.geometries.forEach(d => {
    for (let i = 0; i < countyData.length; i++) {
      if(d.id == countyData[i].cnty_fips){
        d.properties.data = countyData[i];
      }
    }
  });
  const choropleth = new Choropleth({
    parentElement: '#choropleth-2',
  }, geoData)
})
.catch(error => {
  console.error('Error loading the data.')
});