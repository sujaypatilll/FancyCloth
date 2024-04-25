import { cart,updateCart, buttonsDOM, updateButtons, addToCart, filterCart, updateTotalAmount } from './sharedVariables.js';



const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-section');
const checkoutbtn =  document.querySelector(".checkout-btn");
const loader = document.querySelector(".loader");




//getting the products
class Products{
    async getProducts(){
        try{
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item =>{
                const {title,price} = item.fields;
                const id = item.id;
                const image = item.fields.image;
                const category = item.fields.category;
                return {title,price,id,image,category};
            })
            return products;
        }
        catch(error){
            console.log(error);
        }
    }    
}

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            const { title, price,image, category } = product;
            
            // Convert the array of categories into a single string
            const categoryString = Array.isArray(category) ? category.join(' ') : category;

            result += `
                <div class="product" data-id=${product.id}>
                    <img src=${image} alt="">
                    <div class="product-info">
                        <div class="product-info-left">
                            <p class="product-category">${categoryString}</p>
                            <p class="product-name">${title}</p>
                            <p class="product-price">${price}</p>
                        </div>
                        <div class="product-info-right">
                        <button class="bag-btn" data-id=${product.id}>
                        <svg class="icon cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                        Add to cart
                        </button>
                        </div>
                    </div>
                </div>
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        //buttonsDOM = buttons;
        updateButtons(buttons);
        buttons.forEach(button =>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id == id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }
                button.addEventListener("click",(event)=>{
                    event.stopPropagation()
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    // get product from products
                    let cartItem = {...Storage.getProduct(id), amount : 1};
                    // add product to the cart
                    // cart = [...cart,cartItem];
                    addToCart(cartItem);
                    //save cart in local storage
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart item
                    this.addCartItem(cartItem)
                    //show the cart
                    this.showCart()
                });
        });
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        updateTotalAmount(tempTotal.toFixed(2))
    }
       addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <svg class="quantity-up quantity-btn" data-id=${item.id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>
            <p class="item-amount">${item.amount}</p>
            <svg class="quantity-down quantity-btn" data-id=${item.id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
        </div>
        `
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    setupApp(){
        updateCart(Storage.getCart());
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener("click",() =>{
            this.clearCart();
        });
        //cart functionality
        cartContent.addEventListener("click", (event)=>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('quantity-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount += 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('quantity-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount -= 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
               
            }
            
        });
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    removeItem(id){
        // cart = cart.filter(item => item.id !== id);
        filterCart(id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<svg class="icon cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
        Add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

//Local Storage

class Storage{
    static saveProduct(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id == id);
    }
    static saveCart(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}





document.addEventListener("DOMContentLoaded",() =>{
    
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupApp();
    // get all products
    products.getProducts().then(products =>{
            loader.classList.add("hidden");
            productsDOM.classList.remove("hidden");
            ui.displayProducts(products);
            Storage.saveProduct(products);
        
    }).then(()=>{
        ui.getBagButtons();
            ui.cartLogic();
            const productButtons = document.querySelectorAll('.product');
            productButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productId = button.getAttribute('data-id');
                    localStorage.setItem('ProductSelected', productId);
                    window.location.href = './productView.html';
                });
            
            });
            checkoutbtn.addEventListener("click", ()=>{
                window.location = "./checkout.html"
            })
    }); 


})