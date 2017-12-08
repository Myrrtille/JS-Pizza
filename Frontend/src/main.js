/**
 * Created by chaika on 25.01.16.
 */


$(function(){



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

    function sendData(){
        if(bool_name && bool_phone && bool_address){
            var name = $('.order-input-name').val();
            var phone = $('.order-input-phone').val();
            PizzaCart.createOrder(name, phone);
        }
    }

});

