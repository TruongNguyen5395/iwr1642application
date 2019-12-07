
// var mqtt = require('mqtt');

// var options = {
//    port:  14898,
//    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
//    username: "pqabugnq",
//    password: "cHTTED1dggfc",
//  };
  
//  var client  = mqtt.connect('mqtt://postman.cloudmqtt.com', options)
  
//     client.on('connect', function() { // When connected
//         console.log('Connected');
//    // subscribe to a topic
//    client.subscribe('ips', function() {
//      // when a message arrives, do something with it
//      client.on('message', function(topic, message, packet) {
//          var msg = JSON.parse(message);
//          console.log(msg.Tag + "," +msg.x + "," + msg.y);
//           x = (msg.x/9.05) * 4720 + 1440 ;
//           y = -(msg.y/4.2) * 2190 + 2850;
//           console.log(x + "," + y);
//          //setlocation(msg.x , msg.y);
//         });
//     });
//   });
//document.getElementById('image-map')
/*var map = L.map('image-map', {
    minZoom: 1,
    maxZoom: 4,
    center: [0, 0],
    zoom:1,
    crs: L.CRS.Simple,
    attributionControl: false
  });
  
  L.control.attribution({
    prefix: false
  }).addAttribution('HT @ HCMUT Lab').addTo(map);
  
  // House: https://i.imgur.com/cenqiCf.jpg
  // Palace SVG (1280 x 806): https://dl.dropbox.com/s/yhrpnftsuis15z6/Topkapi_Palace_plan.svg
  // dimensions of the image
  var w = 1900 * 2,
      h = 890 * 2,
      url = '../assets/img/LabCaoThang-Layout.svg';
  
  // calculate the edges of the image, in coordinate space
  var southWest = map.unproject([0, h], map.getMaxZoom()-1);
  var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
  var bounds = new L.LatLngBounds(southWest, northEast);
  
  // add the image overlay, 
  // so that it covers the entire map
  L.imageOverlay(url, bounds).addTo(map);
  
  // tell leaflet that the map is exactly as big as the image
  map.setMaxBounds(bounds);
  
  map.locate({
      setView: false,
      watch : true,
      timeout: 1000,
      enableHighAccuracy: true
  });

  //var latlng = L.latlng(x,y);    
  
  /*var min=1;
  var max1=9.05, max2=4.2; 
  var random1 = Math.random() * (+max1 - +min) + +min;
  var random2 = Math.random() * (+max2 - +min) + +min;
  
  x = (random1/9.05) * 4720 + 1440 ;
  y = -(random2/4.2) * 2190 + 2850;


  // pixel coords
  function setlocation(newx,newy) {
  x=newx;
  y=newy;
  x = (x/9.05) * 4720 + 1440 ;
  y = -(y/4.2) * 2190 + 2850;
  
  var customPin = L.divIcon({
    className: 'location-pin',
    html: '<img src="https://static.robinpowered.com/roadshow/robin-avatar.png"><div class="pin"></div><div class="pulse"></div>',
    iconSize: [30, 30],
    iconAnchor: [18, 30]
  });

  var marker = L.marker(map.unproject([x, y], map.getMaxZoom()), {
    icon: customPin
  }).addTo(map);

  marker.bindPopup("<b>Tag</b><br> x : " + x + " , " + "y : " + y); 
}
  //}
 
  
  //Add marker
  //var newMarkerGroup = new L.LayerGroup();
 
  
   

/*
function onLocationFound(e) {
    var radius = e.accuracy/2;
}

/*var imageObj = new Image();
imageObj.src = "../assets/img/LabCaoThang-Layout.svg";//load any image
//place the points in the canvas
var MyLayer = L.FullCanvas.extend({
  drawSource: function(point) {
    var ctx = this.getCanvas().getContext("2d");
    ctx.drawImage(imageObj, point.x - 1, point.y - 1, 2, 2);
  }
});*/