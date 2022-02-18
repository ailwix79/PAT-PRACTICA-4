
window.addEventListener('load', getData);

async function getData() {

    const Nasa_API = 'mxBbZ4QkKet4IjgxUTOcJ38uGcoDGBwaKzS7OYcM';
    const start_date = '2019-02-13'
    const end_date = '2019-04-13'
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${end_date}&api_key=${Nasa_API}`;
    var res = await fetch(url)
        .then(response => response.json())
        .then(data => showData(data))
        .catch(e => {
            console.log(e);
        })
}