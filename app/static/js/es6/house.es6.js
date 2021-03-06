/* jshint unused:false */
/* global google, addMarker, user, neighbors */

(function(){
  'use strict';

  $(document).ready(init);

  var map;

  function init(){
    initMap();
    $('#house').css({
      'height': '400px',
    });
    $(window).resize(function(){
      $('#house').css({
        'height': '400px',
      });
    });
  }

  function initMap(){
    var lat = user.coordinates[0];
    var lng = user.coordinates[1];
    var house = new google.maps.LatLng(lat, lng);

    var panoramaOptions = {
    position: house,
    pov: {
      heading: 175,
      pitch: 10,
      zoom: 1
    }
  };
  var panorama = new  google.maps.StreetViewPanorama(document.getElementById('house'),panoramaOptions);
}


})();
