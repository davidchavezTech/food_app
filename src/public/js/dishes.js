const dishNameSelector = document.querySelector('#dish-name');
const dishPriceSelector = document.querySelector('#dish-price');
const dishQuantitySelector = document.querySelector('#dish-quantity');
const minusBtn = document.querySelector('#minus_button');
const plusBtn = document.querySelector('#plus_button');
const newTotalSelector = document.querySelector('#newTotal');
// order.length = 2
// localStorage.setItem("order", JSON.stringify(order));



let index

function quantity(){
    function findDishInArray(arrayPassed) {
        return arrayPassed[0] == dishNameSelector.innerHTML
    }
    return order.findIndex(findDishInArray);
}
//Check if there is an record for this order, if so, set the quantity counter accordingly
index = quantity()
if(index >= 0){
    dishQuantitySelector.innerHTML = order[index][2]
}
// Set total price
function totalPriceCalculation(btn){
    
    if(dishQuantitySelector.innerHTML>0 || btn){
        let price = parseFloat(dishPriceSelector.innerHTML)
        let quant = parseInt(dishQuantitySelector.innerHTML)
        newTotalSelector.innerHTML = price * quant
    }
}
totalPriceCalculation()
plusBtn.addEventListener('click', ()=>{
    currentQuantity = dishQuantitySelector.innerHTML
    currentQuantity = parseInt(currentQuantity)
    if(currentQuantity < maxNumberOfItems){
        dishQuantitySelector.innerHTML = currentQuantity + 1
        index = quantity()
        if(index >= 0){
            order[index] = [dishNameSelector.innerHTML, dishPriceSelector.innerHTML, currentQuantity + 1]
            localStorage.setItem("order", JSON.stringify(order));
        }else{
            order.push([dishNameSelector.innerHTML, dishPriceSelector.innerHTML, 1]);
            localStorage.setItem("order", JSON.stringify(order));
    }
    totalPriceCalculation();
    }
})

minusBtn.addEventListener('click', ()=>{
    currentQuantity = dishQuantitySelector.innerHTML
    currentQuantity = parseInt(currentQuantity)
    if(currentQuantity > 0){
        currentQuantity = currentQuantity - 1
        order[quantity()] = [dishNameSelector.innerHTML, dishPriceSelector.innerHTML, currentQuantity]
        localStorage.setItem("order", JSON.stringify(order));
        dishQuantitySelector.innerHTML = currentQuantity
        totalPriceCalculation(1);
    }
})

    
console.log(order);