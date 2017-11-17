/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

var pizza_shown = Pizza_List;

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
        $(this).text(pizza_shown.length);
    });

    list.forEach(showOnePizza);
}

$(".nav-pills li").on("click", function(){
    $(".nav-pills").find(".active").removeClass("active");
    $(this).addClass("active");

    var filter = this.id;
    filterPizza(filter);
});

function filterPizza(filter) {
//Масив куди потраплять піци які треба показати

    pizza_shown = [];

    for(var i=0; i<Pizza_List.length; i++){
        if(filter === "all")
            if(Pizza_List[i].all)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
        if(filter === "meat")
            if(Pizza_List[i].meat)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
        if(filter === "pineapple")
            if(Pizza_List[i].pineapple)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
        if(filter === "mushroom")
            if(Pizza_List[i].mushroom)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
        if(filter === "ocean")
            if(Pizza_List[i].ocean)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
        if(filter === "vega")
            if(Pizza_List[i].vega)
                pizza_shown[pizza_shown.length] = Pizza_List[i];
    }

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
