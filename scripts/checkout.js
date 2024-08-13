import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { cart } from "../data/cart.js";
import '../data/cart_oops.js';

renderOrderSummary();
renderPaymentSummary();

let cartQuantity = 0;
cart.forEach((item) => {
    cartQuantity += item.quantity;
});
document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.js-quantity').innerHTML = `${cartQuantity} item`;
    document.querySelector('.js-item-count').innerHTML = `Items (${cartQuantity}):`;
});