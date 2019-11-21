


function createFeatures(earthquakeData) {

    var earthquakes = L.geoJson(earthquakeData,{
        pointToLayer: function (feature, loc) {
          return L.circleMarker(loc, {
            radius: feature.properties.mag*7,
            fillColor: colors(feature.properties.mag),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        })
            .bindPopup("<h3>" + "Location: " + feature.properties.place +
              "</h3><hr><p>" + "Date/Time: " + new Date (feature.properties.time) + "<br>" +
              "Magnitude: " + feature.properties.mag + "</p>");
      }
    });

    createMap(earthquakes);
   
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a legend to display information about our map
  

    const legend = L.control({
        position: "bottomright"
    });
    

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'legend');
        let grades = [1,2,3,4,5];
        let labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];


        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
        '<i style="background:' + colors(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

      legend.addTo(myMap);

}



function colors(c)
{
  switch (Math.ceil(c)) {
    case 1:
      return "lightyellow";
    case 2:
      return "gold";
    case 3:
      return "darkorange";
    case 4:
      return "orangered";
    case 5:
      return "red";
    default:
      return "darkred";
  }
}


(async function(){

    let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    const data = await d3.json(queryUrl, function(data) {
            createFeatures(data.features);
        });
    
})()