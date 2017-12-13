/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');

var Pizza_List = [];

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var pizza_shown = [];

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {

        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big, pizza.big_size.price);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small, pizza.small_size.price);
        });


        $pizza_list.append($node);
    }

    $('.pizza-count').each(function () {
        $(this).text(list.length);
    });

    $('.count-title').each(function () {
        $(this).text(pizzaMenuLabel);
    });

    list.forEach(showOnePizza);
}

var pizzaMenuLabel = "Усі піци";

$(".nav-pills li").on("click", function(){
    $(".nav-pills").find(".active").removeClass("active");
    $(this).addClass("active");

    var filter = this.id;
    filterPizza(filter);
});

function filterPizza(filter) {
//Масив куди потраплять піци які треба показати

    pizza_shown = [];

    if(filter === "all"){
        pizzaMenuLabel = "Усі";
        pizza_shown = Pizza_List;
    }else if(filter === "meat"){
        pizzaMenuLabel = "М'ясні піци";
        Pizza_List.forEach(function(pizza){
            if(pizza.content.meat)
                pizza_shown.push(pizza);
        });
    }else if(filter === "pineapple"){
        pizzaMenuLabel = "Піци з ананасами";
        Pizza_List.forEach(function(pizza){
            if(pizza.content.pineapple)
                pizza_shown.push(pizza);
        });
    }else if(filter === "mushroom"){
        pizzaMenuLabel = "Піци з грибами";
        Pizza_List.forEach(function(pizza){
            if(pizza.content.mushroom)
                pizza_shown.push(pizza);
        });
    }else if(filter === "ocean") {
        pizzaMenuLabel = "Піци з морепродуктами";
        Pizza_List.forEach(function (pizza) {
            if (pizza.content.ocean)
                pizza_shown.push(pizza);
        });
    }else if(filter === "vega") {
        pizzaMenuLabel = "Вегетаріанські піци";
        Pizza_List.forEach(function (pizza) {
            if (!pizza.content.meat && !pizza.content.ocean)
                pizza_shown.push(pizza);
        });
    }

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    API.getPizzaList(function(err,list ){
        if(err){
            alert("Can't load page.")
        }else{
            Pizza_List = list;
            pizza_shown = Pizza_List;
            showPizzaList(Pizza_List)
        }

    });
    //Показуємо усі піци
    //showPizzaList(Pizza_List);
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
