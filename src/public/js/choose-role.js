// const user = document.querySelector('#user');
const usersToggle = document.getElementById('user');
const managersToggle = document.getElementById('manager');
const devileriesToggle = document.getElementById('delivery-person');


usersToggle.addEventListener('click', () => {
    let divToGrow = document.getElementById('user-text');
    divToGrow.classList.toggle("transform-active-user");
    let check1 = document.querySelector('.transform-active-manager');
    let check2 = document.querySelector('.transform-active-delivery-person');
    if(check1){check1.classList.remove("transform-active-manager")}
    if(check2){check2.classList.remove("transform-active-delivery-person")}
})

managersToggle.addEventListener('click', () => {
    let divToGrow = document.getElementById('manager-text');
    divToGrow.classList.toggle("transform-active-manager");
    let check1 = document.querySelector('.transform-active-user');
    let check2 = document.querySelector('.transform-active-delivery-person');
    if(check1){check1.classList.remove("transform-active-user")}
    if(check2){check2.classList.remove("transform-active-delivery-person")}
})
devileriesToggle.addEventListener('click', () => {
    let divToGrow = document.getElementById('delivery-person-text');
    divToGrow.classList.toggle("transform-active-delivery-person");
    let check1 = document.querySelector('.transform-active-user');
    let check2 = document.querySelector('.transform-active-manager');
    if(check1){check1.classList.remove("transform-active-user")}
    if(check2){check2.classList.remove("transform-active-manager")}
})
