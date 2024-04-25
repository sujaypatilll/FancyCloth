// sharedVariables.js
export var cart = [];
export var buttonsDOM = [];
export var totalAmount = 0;     

export function updateTotalAmount(total){
    totalAmount = total;
}

export function updateCart(newCart) {
    cart = newCart;
}

export function addToCart(newItem){
    cart = [...cart,newItem];
}

export function filterCart(id){
    cart = cart.filter(item => item.id !== id);
}

export function updateButtons(newbuttons){
    buttonsDOM = newbuttons;
}


