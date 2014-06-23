/* jshint unused:false */
/* global google */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#addKid').click(addKid);
    $('#addPet').click(addPet);
    $('.children').on('click', '.remove', removeKid);
    $('.pets').on('click', '.remove', removePet);
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
          window.location= '/dashboard';
        });
      }
    });
    e.preventDefault();
  }

  function removeKid(){
    if($('.holdKid').length > 1){
      $(this).parent().remove();
    }
  }

  function removePet(){
    if($('.holdPet').length > 1){
      $(this).parent().remove();
    }
  }

  function addKid(){
    $('.holdKid:last').after('<span class="holdKid additional"><select class="kid" name="kids"><option value="na">NA</option><option value="son">Son</option><option value="daughter">Daughter</option></select><input class="kidName" name="kidName" placeholder="Name (leave blank if NA)"></input><a class="remove link-effect"><span class="glyphicon glyphicon-trash"></span></a></span>');
  }

  function addPet(){
    $('.holdPet:last').after('<span class="holdPet additional"><input class="pet" name="pets" placeholder="Animal Type (leave blank if NA)"></input><input class="petName" name="petName" placeholder="Name (leave blank if NA)"></input><a class="remove link-effect"><span class="glyphicon glyphicon-trash"></span></a></span>');
  }
})();

function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
