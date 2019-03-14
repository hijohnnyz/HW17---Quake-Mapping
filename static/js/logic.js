// Selected earthquake feed: "USGS Magnitude All Earthquakes, Past Month"
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Tectonic data from following url
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Query earthquake data along with the fault line data
d3.json(tectonicUrl, function(tdata) {
    d3.json(url, function(data) {
        mapInfo(data, tdata);
    });
});

// Function for map features
function mapInfo(data, tdata) {

    // Feature layer with pop up
    function onEachFeature(feature, layer) {
        
        // Pop up layer for location markers
        layer.bindPopup("<center><h3>" + feature.properties.place +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
        "</h3><hr><p><strong>Time of Occurence: </strong>" + new Date(feature.properties.time) + "</p></center>");
    }
    
    // Earthquake variable declaration
    var earthquakes = L.geoJSON(data, {
      
        // Call pop up function
        onEachFeature: onEachFeature,

        // Creating the layer of magnitude circles
        pointToLayer: function(feature, latlng) {
            
            // Color attributes based on magnitudes
            var color;
            var r = Math.floor(255-30*feature.properties.mag);
            var g = Math.floor(255-40*feature.properties.mag);
            var b = 0;
            color = "rgb("+r+" ,"+g+","+b+")"

            // Marker attributes
            var eqMarker = {
            radius: 3.8*feature.properties.mag,
            fillColor: color,
            weight: 1.5,
            opacity: 0.8,
            fillOpacity: 0.8
            };

            // Return circle marker
            return L.circleMarker(latlng, eqMarker);
        }
    });

    // Fault line variable declaration
    var faultlines = L.geoJSON(tdata);

    // Initialize function with data
    createMap(earthquakes, faultlines); 
}

// Function for loading map 
function createMap(earthquakes, faultlines) {

    // Initial tile layer
    var tileLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Satellite map
    var sat = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    
    // Light map
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    
    // Base map
    var baseMaps = {
    "Outdoors": tileLayer,
    "Satellite": sat,
    "Light": light
    };
    
    // Map overlay
    var overlayMaps = {
    'Earthquakes': earthquakes,
    'Faultlines': faultlines
    };
    
    // Showing the map
    var myMap = L.map("map", {
    center: [19.4326, -99.1332],
    zoom: 3,
    layers: [tileLayer, earthquakes, faultlines]
    });

    // Add controls to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Creating the legend
    var legend = L.control({

        // Position of legend 
        position: 'bottomleft'
    });
    
    // Add elements to legend
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = `<p><i style="background:rgb(255,255,225)"></i>0-1</p>
                        <p><i style="background:rgb(225,215,0)"></i>1-2</p>
                        <p><i style="background:rgb(195,175,0)"></i>2-3</p>
                        <p><i style="background:rgb(165,135,0)"></i>3-4</p>
                        <p><i style="background:rgb(135,95,0)"></i>4-5</p>
                        <p><i style="background:rgb(105,55,0)"></i>5-6</p>
                        <p><i style="background:rgb(75,15,0)"></i>6-7</p>
                        <p><i style="background:rgb(45,0,0)"></i>7-8</p>
                        <p><i style="background:rgb(0,0,0)"></i>8+</p>`;
        return div;
    };

    // Add legend to the map
    legend.addTo(myMap);
}