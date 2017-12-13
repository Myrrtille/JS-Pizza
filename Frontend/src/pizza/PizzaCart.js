/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var API = require('../API');

myStorage = localStorage;

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

var TOTAL_PRICE = 0;

function getTotal(){
    return total_price;
}


function addToCart(pizza, size, price) {
    //Додавання однієї піци в кошик покупок
    var add = false;
    for(var i=0; i<Cart.length; i++){
        if(Cart[i].pizza.id == pizza.id && Cart[i].size == size){
            Cart[i].quantity += 1;
            Cart[i].price_label += Cart[i].price;

            add = true;
        }
    }
    if(!add){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price: price,
            price_label: price
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

$(".clear-orders").on("click", function(){
    Cart = [];
    updateCart();
});

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    for(var i=0; i<Cart.length; i++) {
        if (Cart[i] == cart_item) {
            Cart.splice(i, 1);
            break;
        }
    }

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    Cart = localStorage.Cart ? JSON.parse(localStorage.Cart) : [];

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    localStorage.Cart = JSON.stringify(Cart);
    //Очищаємо старі піци в кошику
    $cart.html("");

    if(Cart.length === 0){
        $cart.html("<div class=\"cart-empty\">\n" +
            "                    \Пусто в холодильнику?\n" +
            "                    <br>\n" +
            "                    \Замовте піцу!\n" +
            "                </div>");
        $('#order-button').prop('disabled', true);
    }else {
        $('#order-button').prop('disabled', false);
        //Онволення однієї піци
        function showOnePizzaInCart(cart_item) {
            var html_code = Templates.PizzaCart_OneItem(cart_item);

            var $node = $(html_code);

            $node.find(".plus").click(function () {
                //Збільшуємо кількість замовлених піц
                cart_item.quantity += 1;
                cart_item.price_label += cart_item.price;

                //Оновлюємо відображення
                updateCart();
            });
            $node.find(".minus").click(function () {
                //Збільшуємо кількість замовлених піц
                cart_item.quantity -= 1;
                cart_item.price_label -= cart_item.price;

                if (cart_item.quantity == 0)
                    removeFromCart(cart_item);
                //Оновлюємо відображення
                updateCart();
            });
            $node.find(".remove").click(function () {

                removeFromCart(cart_item);

                //Оновлюємо відображення
                updateCart();
            });

            $('.clear_orders').click(function () {
                for (var i = 0; i < Cart.length; i++)
                    removeFromCart(Cart[i]);

                updateCart();
            });

            $cart.append($node);

        }

        Cart.forEach(showOnePizzaInCart);
    }

    var total_price = 0;
    for(var i=0; i<Cart.length; i++){
        total_price += Cart[i].price_label;
    }

    $('.sum-number').each(function(){
        $(this).text(total_price);
    });
    $('.amount').each(function () {
        $(this).text(Cart.length);
    });

    if(window.location == "http://localhost:5050/"){
        $('.cart-item-amount').css("display","none");
        //$('.cart-circle-b').attr('hidden', true);
        $('.cart-circle-b').css("display", "inline-block");
        $('.cart-pizza-amount').css("display", "inline-block");
    }else if (window.location == "http://localhost:5050/order.html"){
        $('.cart-item-amount').css("display","inline-block");
        $('.cart-circle-b').css("display", "none");
       // $('.cart-pizza-amount').css("display", "none");
    }

}

function createOrder(name, phone, callback){
    API.createOrder({
        name: name,
        phone: phone,
        order: Cart
    }, function (err, result) {
        if(err){
            return callback(err);
        }
        callback(null, result);
    });
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;
exports.createOrder = createOrder;

exports.PizzaSize = PizzaSize;