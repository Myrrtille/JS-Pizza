
//var API = require('Frontend/src/API');

$(function(){
    $(window).load(function(){
        var map;
        var directionsService;
        var directionsDisplay;
        var marker;
        var marker_home;

        function initMap() {
            //var script = document.createElement('script');
            //script.type = 'text/javascript';

            //document.body.appendChild(script);

            map = new google.maps.Map(document.getElementById('googleMap'), {
                center: {lat: 50.464379, lng: 30.519131},
                zoom: 11
            });

            var point = new google.maps.LatLng(50.464379, 30.519131);
            marker = new google.maps.Marker({
                position: point,
//map	- це змінна карти створена за допомогою new
                map: map,
                icon: "assets/images/map-icon.png"
            });

            marker_home = new google.maps.Marker({
                position: point,
//map	- це змінна карти створена за допомогою new
                map: map,
                icon: "assets/images/home-icon.png"
            });

            marker_home.setVisible(false);

            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService = new google.maps.DirectionsService();
            directionsDisplay.setMap(map);
            directionsDisplay.setOptions({suppressMarkers: true, suppressInfoWindows: true});

            //Дізнаємося адресу місця куди натиснули мишкою
            google.maps.event.addListener(map,
                'click',function(me){
                    var coordinates	=	me.latLng;
                    createRoute(coordinates);
                    geocodeLatLng(coordinates,	function(err,	adress){
                        if(!err)	{
                            console.log(adress);
                        }	else	{
                            console.log("Немає адреси")
                        }
                    })
                });

        }
  //     google.maps.event.addDomListener(window, 'load', initialize);

        function geocodeLatLng(latlng,	 callback){
//Модуль за роботу з адресою
            var geocoder	=	new	google.maps.Geocoder();
            geocoder.geocode({'location':	latlng},	function(results,	status)	{
                if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
                    var adress =	results[1].formatted_address;
                    callback(null,	adress);
                }	else	{
                    callback(new	Error("Can't	find	adress"));
                }
            });
        }

        function createRoute(address){
            var point	=	new	google.maps.LatLng(50.464379,30.519131);
            var request = {
                origin: point,
                destination: address,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                waypoints: [
                    {
                        location: point,
                        stopover:false
                    },{
                        location: address,
                        stopover:true
                    }
                ],
                optimizeWaypoints: true,
                provideRouteAlternatives: true,
                avoidHighways: true,
                avoidTolls: true
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    var routes = result.routes;
                    var leg = routes[0].legs;
                    var lenght = leg[0].distance.text;
                    var duration = leg[0].duration.text;
                }
            });

            marker_home.position = address;
            marker_home.setVisible(true);
        }

        exports.initMap = initMap();
        exports.geocodeLatLng = geocodeLatLng();
        exports.createRoute = createRoute();
    });
});

