
window.addEventListener('load', getData);

async function getData() {
    const Nasa_API = 'mxBbZ4QkKet4IjgxUTOcJ38uGcoDGBwaKzS7OYcM';
    const start_date = '2019-02-13'
    const end_date = '2019-02-17'
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${Nasa_API}`;

    var res = await fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            parseInterestingData(data)})

        .catch(e => {
            console.log(e);
        })

        // Si te pasas de dias devuelve 400
}

async function parseInterestingData({near_earth_objects}) {
    var dates = Object.keys(near_earth_objects);
    var neo_data_miss_distance = {};
    var neo_data_diameter = {};
    var neo_data_relative_velocity = {};
    var diameter_array = [];
    var miss_distance_array = [];
    var relative_velocity_array = [];
    var scale_factor = 200;

    for(i=0;i<dates.length;i++) {
      for(j=0;j<near_earth_objects[dates[i]].length;j++) {
        diameter_array[j] = scale_factor*near_earth_objects[dates[i]][j]['estimated_diameter']['kilometers']['estimated_diameter_max'];
        miss_distance_array[j] = parseInt(near_earth_objects[dates[i]][j]['close_approach_data'][0]['miss_distance']['kilometers']);
        relative_velocity_array[j] = parseInt(near_earth_objects[dates[i]][j]['close_approach_data'][0]['relative_velocity']['kilometers_per_hour']);
      }
      neo_data_diameter[dates[i]] = diameter_array;
      neo_data_miss_distance[dates[i]] = miss_distance_array;
      neo_data_relative_velocity[dates[i]] = relative_velocity_array;

      diameter_array = [];
      miss_distance_array = [];
      relative_velocity_array = [];
    }

    createVarScatter({neo_data_relative_velocity, dates, neo_data_diameter, neo_data_miss_distance})
}

async function createVarScatter({neo_data_relative_velocity, dates, neo_data_diameter, neo_data_miss_distance}) {
    var data = [];

    for(i=0;i<dates.length;i++) {
      data[i] = {
        name: dates[i],
        x: neo_data_relative_velocity[dates[i]],
        y: neo_data_miss_distance[dates[i]],
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: neo_data_diameter[dates[i]],
          color: Math.floor(Math.random()*16777215).toString(16)}
      }
    }
    plotValues({data});
}

async function plotValues({data}) {
    var layout = {
        title: {
          text:'Near earth objects NEO NASA API. Obtained on ' + Date().toString(),
          font: {
            family: 'Courier New, monospace',
            size: 24,
            color: '#000000'
          },
          xref: 'paper',
          x: 0.05,
        },
      
        xaxis: {
          type: 'category',
          title: {
            text: 'relative Velocity in kilometers per hour',
            font: {
              family: 'Courier New, monospace',
              size: 24,
              color: '#000000'
            }
          },
        },
      
        yaxis: {
          title: {
            text: 'miss Distance in kilometers',
            font: {
              family: 'Courier New, monospace',
              size: 24,
              color: '#000000'
            }
          }
        },

        autosize: true,
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        margin: {
          l: 200,
          r: 200,
          b: 200,
          t: 200,
          pad: 4
        },
      
        paper_bgcolor: '#ffffff',
        plot_bgcolor: '#ffffff'
    };

    document.getElementById('loader').style.display = 'none';
    Plotly.newPlot('myDiv', data, layout);
}