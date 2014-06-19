/* jshint unused:false */
/* global google, addMarker, user, neighbors */

(function(){
  'use strict';

  $(document).ready(init);

  var winHeight = $(window).height();
  var map;
  var weatherLayer;
  var markers = [];

  function init(){
    initMap();
    $('#map').css({
      'height': winHeight,
    });
    $(window).resize(function(){
      $('#map').css({
        'height': winHeight,
      });
    });
    assignMarkers();
  }

  function initMap(){
    var lat = user.coordinates[0];
    var lng = user.coordinates[1];
    var styles = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#a2daf2'}]}];
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    weatherLayer = new google.maps.weather.WeatherLayer({temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT});
    weatherLayer.setMap(map);
  }

  function assignMarkers(){
    neighbors.forEach(n=>{
      var lat = n.coordinates[0];
      var lng = n.coordinates[1];
      var title = n.name;
      var icon = {url:'/img/143.png', size: new google.maps.Size(25, 25), scaledSize: new google.maps.Size(25, 25)};
      var info = n.address;
      var content = `<div style='background-image: url(${n.photo})' class='pic'></div><a href='/meet/${n._id}' class='name'>${n.name}</a><div class='addr'>${n.address}</div>`;
      addMarker(lat, lng, title, icon, info, content);
    });
  }

  function addMarker(lat, lng, title, icon, info, content){
  var latLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({map:map, position:latLng, title:name, icon:icon, info:info, animation: google.maps.Animation.DROP});

  markers.push(marker);

  var infowindow = new google.maps.InfoWindow({
      content: content
  });

  google.maps.event.addListener(marker, 'click', function(){
    infowindow.open(map,marker);
  });
}


})();
