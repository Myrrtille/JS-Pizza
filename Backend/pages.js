/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Вибір Піци'
    });
    //document.getElementById('order-button').show();
    //document.getElementById('cart-item-amount').hide();

};

exports.orderPage = function(req, res) {
    res.render('common/orderPage', {
        pageTitle: 'Замовлення'
    });

   // document.getElementById('order-button').hide();
    //document.getElementById('cart-item-amount').show();
};