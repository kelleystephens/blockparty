/* jshint unused:false */
/* global google */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#addKid').click(addKid);
    $('#addPet').click(addPet);
    $('#locate').click(locate);
  }

  function locate(e){
    var street = $('#street').val();
    var city = $('#city').val();
    var state = $('#state option:selected').text();
    var zip = $('#zip').val();
    var address = `${street}, ${city}, ${state} ${zip}`;
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: address}, function(results, status){
      if(status === 'OK'){
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        ajax('/location', 'post', {address:address, coordinates:[lat, lng]}, obj=>{
          window.location= `/dashboard/${obj._id}`;
        });
      }
    });
    e.preventDefault();
  }

  function addKid(){
    $('.kidName:last').after('input').after('<select class="kid" name="kids"><option value="na">NA</option><option value="son" selected=user.kids === "[son]">Son</option><option value="daughter" selected=user.kids === "[daughter]">Daughter</option></select><input class="kidName" name="kidName" placeholder="Name (leave blank if NA)"></input>');
  }

  function addPet(){
    $('.petName:last').after('<input class="pet" name="pets" placeholder="Animal Type (leave blank if NA)"></input><input class="petName" name="petName" placeholder="Name (leave blank if NA)"></input>');
  }
})();

function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
