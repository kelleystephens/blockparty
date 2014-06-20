/* jshint unused:false, camelcase:false */
/* global user, moment, _ */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    getPermits();
    getViolations();
    getFire();
    getPolice();
    getEvents();
  }

  function getPermits(){
    var latitude = user.coordinates[0];
    var longitude = user.coordinates[1];
    var url = `http://data.nashville.gov/resource/3h5w-q8b7.json?$where=within_circle(mapped_location, ${latitude}, ${longitude}, 402.336)&$order=date_issued DESC`;
    $.getJSON(url, function(data) {
      $.each(data, (i, p)=>{
        var dateIssued = moment(p.date_issued).format('MM/DD/YYYY');
        var contact = p.contact;
        var address = p.address;
        var purpose = p.purpose;
        $('#bldg').append(`<p>Issue Date: ${dateIssued}</p><p>Contact: ${contact}</p><p>Address: ${address}</p><p>Purpose: ${purpose}</p>`);
      });
    });
  }

  function getViolations(){
    var latitude = user.coordinates[0];
    var longitude = user.coordinates[1];
    var url = `http://data.nashville.gov/resource/479w-kw2x.json?$where=within_circle(mapped_location, ${latitude}, ${longitude}, 402.336) AND status = 'OPEN'&$order=date_received DESC`;
    $.getJSON(url, function(data) {
      $.each(data, (i, v)=>{
        var dateReceived = moment(v.date_received).format('MM/DD/YYYY');
        var address = v.property_address;
        var problem = v.reported_problem;
        $('#codes').append(`<p>Date Received: ${dateReceived}</p><p>Address: ${address}</p><p>Violation: ${problem}</p>`);
      });
    });
  }

  function getFire(){
    var latitude = user.coordinates[0];
    var longitude = user.coordinates[1];
    var locations = [];
    var stations = [];
    var home = {x:latitude, y:longitude};
    var url = `http://data.nashville.gov/resource/frq9-a5iv.json?$where=within_circle(mapped_location, ${latitude}, ${longitude}, 20000)`;
    $.getJSON(url, function(data) {
      $.each(data, (i, f)=>{
        var location = {num: f.station_number, x: f.mapped_location.latitude, y: f.mapped_location.longitude};
        var station = f;
        locations.push(location);
        stations.push(station);
      });
      locations.sort(function(a, b){
        return distance(home,a)-distance(home,b);
      });
      function distance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
      }
      var closest = _.find(stations, {'station_number': locations[0].num});
      $('#fire').append(`<p>Address: ${closest.street_address}, ${closest.city}, ${closest.state} ${closest.zip_code}</p>`);
    });
  }

  function getPolice(){
    var latitude = user.coordinates[0];
    var longitude = user.coordinates[1];
    var locations = [];
    var stations = [];
    var home = {x:latitude, y:longitude};
    var url = `http://data.nashville.gov/resource/y5ik-ut5s.json?$where=within_circle(mapped_location, ${latitude}, ${longitude}, 20000)`;
    $.getJSON(url, function(data) {
      $.each(data, (i, p)=>{
        var location = {name: p.precinct_name, x: p.mapped_location.latitude, y: p.mapped_location.longitude};
        var station = p;
        locations.push(location);
        stations.push(station);
      });
      locations.sort(function(a, b){
        return distance(home,a)-distance(home,b);
      });
      function distance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
      }
      var closest = _.find(stations, {'precinct_name': locations[0].name});
      $('#police').append(`<p>Address: ${closest.street}, ${closest.city}, ${closest.state} ${closest.zip_code}</p>
                            <p>Commander: ${closest.precinct_commander}</p>
                            <p>Phone Number: ${closest.phone_number}</p>
                            <div>Website: <a href='${closest.website.url}'>${closest.website.url}</a></div>`);
    });
  }

  function getEvents(){
    var url = `http://data.nashville.gov/resource/vygj-v677.json?$order=date DESC&$limit=10`;
    $.getJSON(url, function(data) {
      $.each(data, (i, e)=>{
        var date = moment(e.date).format('MM/DD/YYYY');
        var event = e.event;
        var location = e.location;
        $('#events').append(`<p>Event: ${event}</p><p>Date: ${date}</p><p>Location: ${location}</p>`);
      });
    });
  }

})();
