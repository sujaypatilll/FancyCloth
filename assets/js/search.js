let searchProductsContainer = document.querySelector(".search-product-list")
const productCardTemplate = document.querySelector("[data-product-template]")
const searchInput = document.querySelector(".searchTerm")
const searchBtn = document.querySelector(".searchButton")
let items = []

searchBtn.addEventListener("click",()=>{
    items.forEach(product =>{
        searchInput.value = ''
        product.element.classList.remove("hidden");
    })
})

function search(e){
    let value = e.target.value.toLowerCase(); // Convert search query to lowercase for case-insensitive comparison
    items.forEach(product => {
        const titleMatch = product.title.toLowerCase().includes(value);
        
        const categoryMatch = product.category.some(category => category.toLowerCase().includes(value));
        
        const isVisible = titleMatch || categoryMatch;
        
        product.element.classList.toggle("hidden", !isVisible);
    });
}
searchInput.addEventListener("keypress", e => search(e));



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

document.addEventListener("DOMContentLoaded", () => {
    const productslist = new Products()
    productslist.getProducts().then((products) => {
        products.forEach(product => {
            let card = productCardTemplate.content.cloneNode(true).children[0]
            let titleElement = card.querySelector(".search-product-title")
            let categoryElement = card.querySelector(".search-product-category")
            let imageElement = card.querySelector(".search-product-img")
            let priceElement = card.querySelector(".search-product-price")
            
            // Assign product data to the corresponding elements
            titleElement.textContent = product.title
            categoryElement.textContent = product.category
            imageElement.src = product.image
            priceElement.textContent = '$' + product.price
            searchProductsContainer.appendChild(card)
            const propertyValues = Object.values(product.category);
            items.push({ id : product.id , title : product.title, category : propertyValues , image : product.image , price: product.price, element : card})
        });
    }).then(()=>{
        items.forEach((product) => {
            product.element.addEventListener(("click"), ()=>{
                const productId = product.id;
                localStorage.setItem('ProductSelected', productId);
                window.location.href = './productView.html';
            })
        })
    })
})
