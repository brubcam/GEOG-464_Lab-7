// declare the map variable here to give it a global scope
let myMap;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
);
var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
let baseLayers = {
	"CartoDB": CartoDB_Positron,
	"OpenStreetMap": OpenStreetMap_Mapnik
	//,...
};

function initialize(){
    loadMap();
};

function loadMap(mapid){
	//console.log(mapid);

	if(mapid == "mapa") {
		//now reassign the map variable by actually making it a useful object, this will load your leaflet map
		myMap = L.map('mapdiv', {
			center: [46.58, -78.19]
			,zoom: 5
			,maxZoom: 18
			,minZoom: 3
			,layers: CartoDB_Positron
		});

		//fetch the data
		fetchData("https://raw.githubusercontent.com/brubcam/GEOG-464_Lab-7/refs/heads/main/DATA/data/train-stations.geojson");
	};

	if(mapid == "mapb") {
		myMap = L.map('mapdiv', {
			center: [46.58, -78.19]
			,zoom: 5
			,maxZoom: 18
			,minZoom: 3
			,layers: CartoDB_Positron
		});
		
		//fetch the data
		fetchData("https://raw.githubusercontent.com/brubcam/GEOG-464_Lab-7/refs/heads/main/DATA/data/train-stations.geojson");
	};

	//declare basemap selector widget
	let lcontrol = L.control.layers(baseLayers);
	//add the widget to the map
	lcontrol.addTo(myMap);
};

function fetchData(url){
    //load the data
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json, {style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
        })
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
};

function styleAll(feature, latlng) {
	//console.log(feature.properties.stat_ID);
	
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}

	if (feature.properties.postal_code.length > 0) {
		styles.fillColor = 'cyan'
	}
	
	return styles;
};

function addPopups(feature, layer) {
	//console.log(feature);
	//console.log(layer);
	//console.log(layer._radius = 80);
	//console.log(layer.options.fill = false);
	//console.log(layer.getLatLng());

	layer.bindPopup();
};

//window.onload = initialize();