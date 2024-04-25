import { cart, totalAmount } from "/assets/js/sharedVariables.js" ;

const ordreList = document.querySelector(".checkout-order-list");
const totalAmountSection = document.querySelector(".total-amount");


function orderSummary(){
    let result = "";

    cart.forEach(item => {
        result += `
        <div class="checkout-order-product">
            <div class="order-product-name">${item.title}</div>
            <div class="order-product-quantity">${item.amount}</div>
            <div class="order-product-price">$${item.price}</div>
        </div>
        `
        ordreList.innerHTML = result;
        totalAmountSection.innerHTML = '$' + totalAmount;
    });
}

document.addEventListener("DOMContentLoaded",()=>{
    orderSummary();
})