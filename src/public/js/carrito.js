const carritoBox = document.querySelector('#carrito-box');
const totalSelector = document.querySelector('#total');

if (localStorage.getItem("order") === null) {
    carritoBox.innerHTML = "<p>Your shopping cart is empty. <a src='/categories'>Click here</a> to start adding items!"
}else{
    
    //Generate orders from local storage
    for(i=0; i<order.length; i++){
        carritoBox.innerHTML += `<b><div class="cart-order"><p class="cart-order-title">` + order[i][0] + `</p><b><div class="cart-counter"><span class="cart-span" id="minus_button">-</span><span class="cart-span">` + order[i][2] + `</span><span class="cart-span" id="plus_button">+</span></div></b><span>$<span class="price">` + order[i][1] + `</span></span><img class="x" src="img/x.svg"></div><textarea class="cart-comment" placeholder="Add details"></textarea></b></div>`
    }

    //get total

    prices = document.querySelectorAll('.price')

    function getTotal(){
        let addition = 0
        prices.forEach(price => {
            newPrice = parseFloat(price.innerHTML)
            addition = addition + newPrice
        })
        return addition.toFixed(2)
    }
    totalSelector.innerHTML = getTotal()


    let plusBtns = document.querySelectorAll('#plus_button');
    plusBtns.forEach(plusBtn => {
        plusBtn.addEventListener('click', (e)=>{
            let quantity = plusBtn.previousSibling.innerHTML
            quantity = parseInt(quantity)
            if(quantity<maxNumberOfItems){
                quantity++
                order[Array.from(plusBtns).indexOf(e.target)][2] = quantity
                localStorage.setItem("order", JSON.stringify(order));
                plusBtn.previousSibling.innerHTML = quantity
            }
        })
    });

    let minusBtns = document.querySelectorAll('#minus_button');
    minusBtns.forEach(minusBtn => {
        minusBtn.addEventListener('click', (e)=>{
            let quantity = minusBtn.nextSibling.innerHTML
            quantity = parseInt(quantity)
            console.log(quantity)
            if(quantity>0){
                
                quantity--
                order[Array.from(minusBtns).indexOf(e.target)][2] = quantity
                localStorage.setItem("order", JSON.stringify(order));
                minusBtn.nextSibling.innerHTML = quantity
            }
        })
    });
}