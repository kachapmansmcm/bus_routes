var isRunning = false;
var busLocations = [];
var interval = null;
function startStop(){
  let button = document.getElementById('startButton');
  if (isRunning){
    isRunning = false;
    button.className = "btn btn-primary";
    button.innerHTML =  "Start Live Bus Updates";
    clearInterval(interval);

  } else {
    isRunning = true;
    button.className = "btn btn-danger";
    button.innerHTML =  "Stop Live Bus Updates";
    run();
    interval = setInterval(run, 15000);
  }
}
//pulls pulls the bus locations and call the function to create markers.
async function run(){
    const locations = await getBusLocations();
    busLocations = [];
    busLocations = locations;
    createMarkers(busLocations);
    console.log(new Date());
}

async function getBusLocations(){
    const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
    const response = await fetch(url);
    const json = await response.json();
    return json.data;

}


//add your own access token
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FjaGFwbWFuIiwiYSI6ImNrbmdma3hzbDFzbTgycG1pcTVwazZ4czgifQ.ze5RjH8T0sB7WA-XgdPA8w';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-71.083409, 42.356757],
  zoom: 13,
});


//take the Array of JSON from the api and turns them into map markers
var markerArray = []
function createMarkers(busLocations){
  //clear the map before making new icons
  markerArray.forEach(marker => {marker.remove()});
  markerArray = [];
  busLocations.forEach(element => {
    let busIcon = document.createElement('busIcon');
    busIcon.className = 'fas fa-bus fa-2x';
    busIcon.style.color = "red";
    busIcon.title = element.id;
    let message = createAlert(element);
    busIcon.addEventListener('click', function () {
      window.alert(message);
      });
    let lat = element.attributes.latitude;
    let long = element.attributes.longitude;
    let marker = new mapboxgl.Marker({element: busIcon})
      .setLngLat([long, lat])
      .addTo(map);
    //store markers for removal.
    markerArray.push(marker);
  })
}
//creates a quick popup alert for each bus.
function createAlert(element){
  let status = element.attributes.current_status;
  let stop_id = element.relationships.stop.data.id;
  let busNum = element.id;
  let occupancy = element.attributes.occupancy_status;

  let message = `
  Bus Number: ${busNum}
  Current Status: ${status}
  Stop: ${stop_id}
  Occupancy: ${occupancy}`;

  return message;
}
