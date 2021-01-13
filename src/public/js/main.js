let maxNumberOfItems = 6;
let currentDay;



switch (new Date().getDay()){
case 0:
    currentDay = "Sunday";
    break;
  case 1:
    currentDay = "Monday";
    break;
  case 2:
    currentDay = "Tuesday";
    break;
  case 3:
    currentDay = "Wednesday";
    break;
  case 4:
    currentDay = "Thursday";
    break;
  case 5:
    currentDay = "Friday";
    break;
  case 6:
    currentDay = "Saturday";
}
let order;
    if (localStorage.getItem("order") === null) {
        order = []
    }else{
        order = JSON.parse(localStorage.getItem("order"))
        document.addEventListener('DOMContentLoaded', (event) => {
          let carritoSelector = document.querySelector('.carrito');
          carritoSelector.style.display = "initial";
        })
        }