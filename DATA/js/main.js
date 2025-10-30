// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
);

//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = {
	"CartoDB": CartoDB_Positron
	//,...
};

function initialize(){
    loadMap();
};

function loadMap(){
	//now reassign the map variable by actually making it a useful object, this will load your leaflet map
	myMap = L.map('mapdiv', {
		center: [46.58, -78.19]
		,zoom: 5
		,maxZoom: 18
		,minZoom: 3
		,layers: CartoDB_Positron
	});

	//fetch the data
	fetchData("https://raw.githubusercontent.com/geog-464/geog-464.github.io/main/Amtrak_Stations.geojson")

	//declare basemap selector widget
	let lcontrol = L.control.layers(baseLayers);
	//add the widget to the map
	lcontrol.addTo(myMap);
};

function fetchData(){
    //load the data
    fetch()
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json).addTo(myMap);
        })
};

window.onload = initialize();