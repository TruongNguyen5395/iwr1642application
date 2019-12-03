var map = L.map('image-map', {
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
  var layer = new L.imageOverlay(url, bounds).addTo(map);
  map.addLayer(layer);
  // tell leaflet that the map is exactly as big as the image
  map.setMaxBounds(bounds);
  var newMarkerGroup = new L.LayerGroup();

  //var msg = new Array();
  //var markers = new Array();
  document.addEventListener('DOMContentLoaded', function() {
   mqtt_init();
}, false);
  function mqtt_init(){
  // Create a client instance
  client = new Paho.MQTT.Client("postman.cloudmqtt.com", 34898,"myclientid_" + parseInt(Math.random() * 100, 10));
  //Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;
  var options = {
    timeout :3,
    useSSL: true,
    userName: "pqabugnq",
    password: "cHTTED1dggfc",
    onSuccess:onConnect,
    onFailure:doFail
  };

  // connect the client
  client.connect(options);

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("ips");
  }

  function doFail(e){
    console.log(e);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    
    var msg = JSON.parse(message.payloadString);
          x = (msg.x/9.05) * 4720 + 1440 ;
          y = -(msg.y/4.2) * 2190 + 2850;
          console.log(msg.x + "," + msg.y);
          /*L.marker([x1, y1]).addTo(map)
            .bindPopUp("<b>Tag</b><br> x : " + x + " , " + "y : " + y)
            .openPopUp();*/
            
          var customPin = L.divIcon({
            className: 'location-pin',
            html: '<img src="https://static.robinpowered.com/roadshow/robin-avatar.png"><div class="pin"></div><div class="pulse"></div>',
            iconSize: [30, 30],
          iconAnchor: [18, 30]
          });

          var marker = L.Marker.movingMarker(map.unproject([x, y], map.getMaxZoom()), {
              icon: customPin
            }).addTo(map);
        
          marker.bindPopup("<b>Tag</b><br> x : " + x + " , " + "y : " + y);
          marker.start();
  }
}