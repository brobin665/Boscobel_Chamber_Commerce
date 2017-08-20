// Brian Robinson UW-Madison GIS & WMP  Geog 778 Capstone Course
//Boscobel Chamber of Commerce Interactive Map
//August 2017

function createMap(){
	/*// create map object and set view
	var map = L.map('map').setView([43.134429, -90.705404],11);
	// add basemap layer
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJvYmluNjY1IiwiYSI6ImNpc2p1MXkzZzAybWgydnB1NWVvY2llOGkifQ.ufsYZx_ojLbkU4JSpgzH5g',
	{attribution: '&copy; Mapbox &copy; OpenStreetMap  '
	}).addTo(map);*/
	
	
	L.mapbox.accessToken ='pk.eyJ1IjoiYnJvYmluNjY1IiwiYSI6ImNpc2p1MXkzZzAybWgydnB1NWVvY2llOGkifQ.ufsYZx_ojLbkU4JSpgzH5g';
	var map =L.mapbox.map('map').setView([43.134429, -90.705404],12).addControl(L.mapbox.geocoderControl('mapbox.places',{
		autocomplete: true ,
		position:'topleft'
	}));
	L.mapbox.styleLayer('mapbox://styles/brobin665/cj4wewtkb1unv2rqfn89v80k7').addTo(map);
	map.attributionControl.setPosition('bottomleft');
	L.control.locate({
		returnToPrevBounds: true,
		flyTo: true,
		strings: {
			title: "My location"
		}
		}).addTo(map);
	
	//geocoder.query('Boscobel, WI');

	
	
	//create direction objects
	
	var directions= L.mapbox.directions(),
		directionsLayer =L.mapbox.directions.layer(directions).addTo(map),
		directionsInputControl = L.mapbox.directions.inputControl('inputs', directions).addTo(map),
		directionsErrorsControl =L.mapbox.directions.errorsControl('errors', directions).addTo(map),
		directionsRoutesControl = L.mapbox.directions.routesControl('routes',directions).addTo(map),
		directionInstructionsControl= L.mapbox.directions.instructionsControl('instructions', directions).addTo(map);

	
	// create layer variables to hold the different types of points
	var lodging =new L.geoJson(),
		nat_out =new L.geoJson(),
		can_kay =new L.geoJson(),
		hunt =new L.geoJson(),
		trails =new L.geoJson(),
		g_a =new L.geoJson(),
		lq =new L.geoJson(),
		din =new L.geoJson(),
		groc =new L.geoJson(),
		cs =new L.geoJson(),
		m_a =new L.geoJson(),
		bars = new L.geoJson(),
		shop = new L.geoJson();
		
	// Get data via function from json files using ajax
	getData(map,lodging,nat_out, can_kay,hunt,trails, g_a, din, lq,groc, cs, m_a, bars,shop);
	
	// Variables for layer control
	var map_layers =  {
	"<img src='img/lodging.png' height=24> Lodging": lodging,
	"<img src='img/no.png' height=24> Nature & Outdoors": nat_out,
	"<img src='img/canoe.png' height=24> Canoeing/Kayaking": can_kay,
	"<img src='img/hunt.png' height=24> Hunting": hunt,
	"<img src='img/trail.png' height=24> Trails":trails,
	"<img src='img/bars.png' height=24> Liquor Stores": lq,
	"<img src='img/bar.png' height=24> Bars": bars, 
	"<img src='img/coffee.png' height=24> Coffee Shops": cs,
	"<img src='img/dining.png' height=24> Dining":din,
	"<img src='img/shop.png' height=24> Shopping":shop,
	"<img src='img/grocery.png' height=24> Groceries": groc,
	"<img src='img/gifts.png' height=24> Gifts & Antiques": g_a,
	"<img src='img/ma.png' height=24> Musuems & Attractions": m_a
	};
	
	// Add layer control to map
	L.control.layers(null,map_layers).addTo(map);
	
	// Code for Search bar on multiple layers.  Doesn't work. Have tried multiple solutions. 
	// Tried all three solutions here, and ran into same issues https://stackoverflow.com/questions/42934369/leaflet-search-on-multiplelayers-wont-work
	// Followed example here from plugin source   https://github.com/stefanocudini/leaflet-search/blob/master/examples/multiple-layers.html
	
	// Patch for mutliple layer search   DIDNT WORK
	/*L.Control.Search.include({
  _recordsFromLayer: function() { //return table: key,value from layer
    var that = this,
      retRecords = {},
      propName = this.options.propertyName,
      loc;

    function searchInLayer(layer) {
      if (layer instanceof L.Control.Search.Marker) return;

      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        if (this._getPath(layer.options, propName)) {
          loc = layer.getLatLng();
          loc.layer = layer;
          retRecords[that._getPath(layer.options, propName)] = loc;

        } else if (that._getPath(layer.feature.properties, propName)) {

          loc = layer.getLatLng();
          loc.layer = layer;
          retRecords[that._getPath(layer.feature.properties, propName)] = loc;

        } else {
          throw new Error("propertyName '" + propName + "' not found in marker");
        }
      } else if (layer.hasOwnProperty('feature')) { //GeoJSON

        if (layer.feature.properties.hasOwnProperty(propName)) {
          loc = layer.getBounds().getCenter();
          loc.layer = layer;
          retRecords[layer.feature.properties[propName]] = loc;
        } else {
          throw new Error("propertyName '" + propName + "' not found in feature");
        }
      } else if (layer instanceof L.LayerGroup) {
        //TODO: Optimize
        layer.eachLayer(searchInLayer, this);
      }
    }

    this._layer.eachLayer(searchInLayer, this);

    return retRecords;
  }
});*/
	/*var poi = [lodging,nat_out];
	var poiLayers = new L.layerGroup(poi);
	
	 var search =L.control.search({
		layer: lodging,
		initial: true,
		propertyName: 'name',
		buildTip: function(text, val) {
			var type = val.layer.feature.properties.type;
			return '<a href="#" class="'+type+'">'+text+'<b>'+type+'</b></a>';
		 }
	});
	
	search.addTo(map);*/
	

}

function getData(map, lodging, nat_out, can_kay, hunt, trails, g_a, din, lq, groc, cs, m_a, bars, shop){
    $.ajax("data/boscobel.geojson", {
        dataType: "json",
        success: function(response){
			cs =  L.geoJson(response, {
				// use filter to select points by property type
				filter: function(feature, layer){
					//search.indexFeatures(cs,['name', 'type','address', 'phone_number']);
					return feature.properties.type == "Coffee Shops";
				},
				// assign an icon to each feature
				pointToLayer: function(feature, latlng) {
                     var coffee_icon = L.icon({
                      iconSize: [35, 35],
                      iconUrl: 'img/coffee.png'
					 });
					return L.marker(latlng, {icon: coffee_icon});
				},
				//bind a popup to each feature
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}
			}).addTo(cs);
			
			hunt =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Hunting";
				},
				pointToLayer: function(feature, latlng) {
                     var hunt_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/hunt.png'
					 });
					return L.marker(latlng, {icon: hunt_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(hunt);
          lodging =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Lodging";
				},
				pointToLayer: function(feature, latlng) {
                     var lodge_icon = L.icon({
                      iconSize: [35, 35],
                      iconUrl: 'img/lodging.png'
					 });
					return L.marker(latlng, {icon: lodge_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(lodging);
			
		nat_out =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Nature and Outdoors";
				},
				pointToLayer: function(feature, latlng) {
                     var no_icon = L.icon({
                      iconSize: [35,35],
                      iconUrl: 'img/no.png'
					 });
					return L.marker(latlng, {icon: no_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(nat_out);
		can_kay =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Canoeing/Kayaking";
				},
				pointToLayer: function(feature, latlng) {
                     var can_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/canoe.png'
					 });
					return L.marker(latlng, {icon: can_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(can_kay);
		
		trails =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Trails";
				},
				pointToLayer: function(feature, latlng) {
                     var trail_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/trail.png'
					 });
					return L.marker(latlng, {icon: trail_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(trails);
		g_a =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Gifts & Antiques";
				},
				pointToLayer: function(feature, latlng) {
                     var gift_icon = L.icon({
                      iconSize: [35, 35],
                      iconUrl: 'img/gifts.png'
					 });
					return L.marker(latlng, {icon: gift_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(g_a);
		lq =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Liquor Stores"; 		
				},
				pointToLayer: function(feature, latlng) {
                     var bar_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/bars.png'
					 });
					return L.marker(latlng, {icon: bar_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(lq);
		bars =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Bars";
					 		
				},
				pointToLayer: function(feature, latlng) {
                     var beer_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/bar.png'
					 });
					return L.marker(latlng, {icon: beer_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(bars);
		din=  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Dining"; 		
				},
				pointToLayer: function(feature, latlng) {
                     var din_icon = L.icon({
                      iconSize: [35, 35],
                      iconUrl: 'img/dining.png'
					 });
					return L.marker(latlng, {icon: din_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(din);
		groc =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Groceries"; 		
				},
				pointToLayer: function(feature, latlng) {
                     var groc_icon = L.icon({
                      iconSize: [35,35],
                      iconUrl: 'img/grocery.png'
					 });
					return L.marker(latlng, {icon: groc_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(groc);
		m_a =  L.geoJson(response, {
				filter: function(feature, layer){
					return feature.properties.type == "Museums and Attractions"; 		
				},
				pointToLayer: function(feature, latlng) {
                     var ma_icon = L.icon({
                      iconSize: [27, 27],
                      iconUrl: 'img/ma.png'
					 });
					return L.marker(latlng, {icon: ma_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
			}).addTo(m_a);
		shop = L.geoJson(response, {
			filter: function(feature, layer){
				return feature.properties.type == "Shopping";
			},
				pointToLayer: function(feature, latlng) {
                     var shop_icon = L.icon({
                      iconSize: [35, 35],
                      iconUrl: 'img/shop.png'
					 });
					return L.marker(latlng, {icon: shop_icon});
				},
				onEachFeature: function (feature, layer) {
				var popup_content = '<b>' +feature.properties.name + '</b></br>'+ feature.properties.address + '</br>' + feature.properties.phone_number + "</br><a href='" + feature.properties.website + "'>" + feature.properties.website + '</a></br>' + feature.properties.description;
                   layer.bindPopup(popup_content);
				}		
		}).addTo(shop);
		
				
        }
    });
}
	
$(document).ready(createMap);
	
