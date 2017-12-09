/**
 * Created by chaika on 25.01.16.
 */


$(function(){

    var map;
    var directionsService;
    var directionsDisplay;
    var marker;
    var marker_home;

    window.onload = initMap;

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

                        $(".order-adress").html("<b>Адреса доставки: </b>\n" +
                            adress +
                            "                </b>");
                    }	else	{
                        console.log("Немає адреси")
                    }
                })
            });

    }

//Дізнаємося адресу за координатами
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

    function createRoute(address, callback){
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
                $(".order-time").html("<b>Приблизний час доставки: </b>\n" +
                    duration +
                    "                </b>");
            }
        });

        marker_home.position = address;
        marker_home.setVisible(true);
    }

    function geocodeAddress(address,	 callback)	{
        var geocoder	=	new	google.maps.Geocoder();
        geocoder.geocode({'address':	address},	function(results,	status)	{
            if	(status	===	google.maps.GeocoderStatus.OK &&	results[0])	{
                var coordinates	=	results[0].geometry.location;
                createRoute(coordinates, callback);
                $(".order-adress").html("<b>Адреса доставки: </b>\n" +
                    address +
                    "                </b>");

            }	else	{
                callback(new	Error("Can	not	find the	adress"));
            }
        });
    }

   // google.maps.event.addDomListener(window,	 'load',	initMap);

    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    //var Pizza_List = require('./Pizza_List');

    PizzaCart.initialiseCart();
    PizzaMenu.initialiseMenu();

    var bool_name = false;
    var bool_phone = false;
    var bool_address = true;

    function checkNameInput() {
        var stringValue = $('.order-input-name').val();
        //if(stringValue.charAt(0))
        var reg=/[^а-яА-ЯїЇєЄіІёЁa-zA-Z ]/;
        if(reg.test(stringValue) || stringValue.length == 0){
            $('#form-name').addClass("has-error");
            document.getElementsByClassName('name-help-label')[0].style.display='inline-block';
            bool_name = false;
        }else{
            $('#form-name').removeClass("has-error");
            $('#form-name').addClass("has-success");
            document.getElementsByClassName('name-help-label')[0].style.display='none';
            bool_name = true;
        }
    }

    function checkPhoneInputError(){
        $('#form-phone').addClass("has-error");
        document.getElementsByClassName('phone-help-label')[0].style.display='inline-block';
        bool_phone = false;
    }

    function checkPhoneInputSuccess(){
        $('#form-phone').removeClass("has-error");
        $('#form-phone').addClass("has-success");
        document.getElementsByClassName('phone-help-label')[0].style.display='none';
        bool_phone = true;
    }

    function checkPhoneInput(){
        var stringValue = $('.order-input-phone').val();
        var size = stringValue.length;

        if(stringValue.charAt(0) == '+'){
            if(stringValue.charAt(1) == '3'){
                if(stringValue.charAt(2) == '8'){
                    if(stringValue.charAt(3) == '0'){
                        var rest = stringValue.substring(4, stringValue.length);
                        var reg = /^\d+$/;
                        if(!reg.test(rest)){
                            checkPhoneInputError();
                        }else if (rest.length == 9){
                            checkPhoneInputSuccess();
                        }
                    }else{
                        checkPhoneInputError();
                    }
                }else{
                    checkPhoneInputError();
                }
            }else{
                checkPhoneInputError();
            }
        }else if(stringValue.charAt(0) === '0'){
            var rest = stringValue.substring(1, stringValue.length);
            var reg = /^\d+$/;
            if(!reg.test(rest)){
                checkPhoneInputError();
            }else if(rest.length == 9){
                checkPhoneInputSuccess();
            }
        }else{
            checkPhoneInputError();
        }
    }



    $('.order-input-name').on('input', function(){
       checkNameInput();
       sendData();
    });

    $('.order-input-phone').on('input', function(){
        checkPhoneInput();
        sendData();
    });

    $('.order-input-adress').on('input', function(callback){
        var home = $('.order-input-adress').val();
        //alert(home);
        try{
            geocodeAddress(home);
            $('#form-address').addClass("has-success");
        }catch(Error){
            $('#form-address').addClass("has-error");
        }

    });

    function sendData(){
        if(bool_name && bool_phone && bool_address){
            var name = $('.order-input-name').val();
            var phone = $('.order-input-phone').val();
            PizzaCart.createOrder(name, phone);
        }
    }

});

