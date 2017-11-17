/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

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

function addToCart(pizza, size, price) {
    //Додавання однієї піци в кошик покупок
    var add = false;
    for(var i=0; i<Cart.length; i++){
        if(Cart[i].pizza == pizza && Cart[i].size == size){
            Cart[i].quantity += 1;
            add = true;
        }
    }
    if(!add){
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1,
            price: price
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

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity -= 1;

            if(cart_item.quantity == 0)
                removeFromCart(cart_item);
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".remove").click(function(){

            removeFromCart(cart_item);

            //Оновлюємо відображення
            updateCart();
        });

        $('.clear_orders').click(function () {
            for(var i=0; i<Cart.length; i++)
                removeFromCart(Cart[i]);

            updateCart();
        });

        $cart.append($node);
    }

    var total_price = 0;
    for(var i=0; i<Cart.length; i++){
        total_price += Cart[i].price * Cart[i].quantity;
    }

    $('.sum-number').each(function(){
        $(this).text(total_price + " грн");
    });
    $('.amount').each(function () {
        $(this).text(Cart.length);
    });

    Cart.forEach(showOnePizzaInCart);

    localStorage.Cart = JSON.stringify(Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;