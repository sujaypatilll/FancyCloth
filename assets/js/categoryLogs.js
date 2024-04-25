import {selectedCategory} from "./sharedVariables"

const category = [...document.querySelectorAll(".category")];

category.forEach(element => {
    element.addEventListener("click", ()=>{
        const catid = element.dataset.catid ? element.dataset.catid : '';
        selectedCategory = catid;
        console.log(selectedCategory);
            
    })
});