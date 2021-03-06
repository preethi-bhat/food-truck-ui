var userLatitude;
var userLongitude;
var geocoder;

// DOM Ready =============================================================
$(document).ready(function() {

    // Register button click
    $('#btnFoodSearchNearMe').on('click', doFoodSearchNearMe);
    $('#btnFoodSearchNearAddr').on('click', doFoodSearchNearAddr);    
});

// Show the user's position on the map
function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon)
    mapholder = document.getElementById('mapholder')
    mapholder.style.height = '300px';
    mapholder.style.width = '750px';

    var myOptions = {
    	center:latlon,zoom:14,
   		mapTypeId:google.maps.MapTypeId.ROADMAP,
    	mapTypeControl:false,
    	navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    
    var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
    var marker = new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
}

// Add markers on the map corresponding to food trucks
function addMarkers(userLatitude, userLongitude, foodTrucks) {
    var locations = [
    	  ['Your location', userLatitude, userLongitude]
        ];
        
    $.each(foodTrucks.results, function(index, solution){
        var foodTruckLocation = [];
        foodTruckLocation.push(solution.applicant)
        foodTruckLocation.push(solution.latitude)
        foodTruckLocation.push(solution.longitude)
        locations.push(foodTruckLocation)
    })

    var map = new google.maps.Map(document.getElementById('mapholder'), {
          zoom: 13,
          center: new google.maps.LatLng(userLatitude, userLongitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        // When the marker is clicked, show the truck applicant name
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
    }    
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

// Get the latitude and the longitude;
function successFunction(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    console.log('navigator:' + userLatitude + "," + userLongitude)
    showPosition(position)
}

function errorFunction() {
    console.log("Geocoder failed. Could not find user's current location");
}

function initialize() {
    geocoder = new google.maps.Geocoder();
}

/**
// Commenting the autocomplete functionality as there are a few bugs
// It would be better to introduce a delay so that the number of calls to the server 
// is manageable. 

// Send request as and when we get input from the user
$("#foodTruckSearchParams").on('input', function() {
  	var foodTruckSearchParamFromUser = $("#foodTruckSearchParams").val();
  	doFoodSearchNearMe();
});

// Send request as and when we get input from the user
$("#foodTruckSearchParamsAddr").on('input', function() {
  	var foodTruckSearchParamFromUser = $("#foodTruckSearchParamsAddr").val();
  	doFoodSearchNearAddr();
});
*/

// Fill table with data
function populateTable(data) {

    // Empty content string
    var tableContent = '';

    $('#foodTruckResults table tbody tr').remove()
     var row = 0;
        $.each(data.results, function(index, solution){
        
                var tableContent = ""

                row++;
                tableContent += '<tr class="item-' + row%2 + '">';
                tableContent += '<td>' + solution.fooditems + '</td>';
                tableContent += '<td>' + solution.address + '</td>';
                tableContent += '<td>' + solution.applicant + '</td>';
                tableContent += '<td>' + solution.distance + '</td>';

                tableContent += '</tr>';
                $('#foodTruckResults table').last().append(tableContent);         
        })
};

// Function to find food trucks near user's current location
function doFoodSearchNearMe(event) {
    var foodTruckSearchParamFromUser = $("#foodTruckSearchParams").val();
    
    // If it is, compile all user info into one object
    var foodSearchParams = {
        'searchQuery': foodTruckSearchParamFromUser,
        'userLatitude':userLatitude,
        'userLongitude':userLongitude
    }

    $.ajax({
        url : 'https://biz-service.herokuapp.com/food/localresults',
        //url : 'http://localhost:3001/food/localresults',
        type: "POST",
        data : foodSearchParams,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            populateTable(data);
            addMarkers(userLatitude, userLongitude, data)
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
     
        }
    });    
};

// Function to find food trucks near user specified location
function doFoodSearchNearAddr(event) {
    var foodTruckSearchParamFromUser = $("#foodTruckSearchParamsAddr").val();
    
    // If it is, compile all user info into one object
    var foodSearchParams = {
        'searchQuery': foodTruckSearchParamFromUser
    }

    $.ajax({
        url : 'https://biz-service.herokuapp.com/food/addressresults',
        //url : 'http://localhost:3001/food/addressresults',
        type: "POST",
        data : foodSearchParams,
        success: function(data, textStatus, jqXHR)
        {
            //data - response from server
            populateTable(data);
            console.log(data.mapLat, data.mapLng);
            addMarkers(data.mapLat, data.mapLng, data)
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
     
        }
    });    
};
