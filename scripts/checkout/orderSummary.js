import { cart,addToCart, removeFromCart, updateDeliveryOptions } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { formatCurrency } from "../utils/money.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    let productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionsId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    //changes
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd,MMMM D");

    cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id
      } js-cart-item-container">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity
      }</span>
                  </span>
                  <span class="update-quantity-link link-primary" data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <span class="update-on" id="update-target-id-${matchingProduct.id}">
                  <span>
                  <input type="number" class="update-box" id="update-quantity-${matchingProduct.id}" autofocus/>
                  </span>
                  <span class="link-primary js-save-update" data-product-id = "${matchingProduct.id}">
                  Save
                  </span>
                  </span>
                  <span data-product-id = "${matchingProduct.id
      }" class="delete-quantity-link link-primary js-delete-link">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>`;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOptions) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOptions.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd,MMMM D");
      const priceString =
        deliveryOptions.priceCents === 0
          ? "FREE shipping"
          : `$${deliveryOptions.priceCents / 100}`;

      const isChecked = deliveryOptions.id === cartItem.deliveryOptionsId;

      html += `
          <div class="delivery-option js-delivery-option" data-delivery-option-id="${deliveryOptions.id
        }" data-product-id="${matchingProduct.id}">
                        <input 
                          type="radio" 
                          ${isChecked ? "checked" : ""}
                          class="delivery-option-input"
                          name="delivery-option-${matchingProduct.id}">
                        <div>
                          <div class="delivery-option-date">
                            ${dateString}
                          </div>
                          <div class="delivery-option-price">
                            ${priceString}
                          </div>
                        </div>
          </div>
        `;
    });
    return html;
  }

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      updateQuantityHeader();
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      //changes
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOptions(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
      updateQuantityHeader();
    });
  });

  // Only use to toggle delivery box.
  document.querySelectorAll('.update-quantity-link').forEach((update)=>{
    update.addEventListener('click', ()=>{
      const productId = update.dataset.productId;
      toggleUpdateBox(productId);
    });
  });

  // Main delivery box logic.
  document.querySelectorAll(".js-save-update").forEach((save)=>{
    save.addEventListener('click',()=>{
      const productId = save.dataset.productId;
      let quantity = Number(document.getElementById(`update-quantity-${productId}`).value);
      quantity = (quantity === 0) ? 1 : quantity;
      addToCart(productId, quantity);
      toggleUpdateBox(productId);
      renderOrderSummary();
      renderPaymentSummary();
      updateQuantityHeader();
    })
  });
}

function updateQuantityHeader() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  document.querySelector('.js-quantity').innerHTML = `${cartQuantity} item`;
}

function toggleUpdateBox(id) {
  document.getElementById(`update-target-id-${id}`).classList.toggle('update-on');
}