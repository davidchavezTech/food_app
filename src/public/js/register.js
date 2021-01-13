const button = document.querySelector('#form-button')
const form = document.getElementById('form')

function errorMsg(msg){
    const errorSpanTag = document.getElementById('errormsg')
    errorSpanTag.innerHTML = msg
    errorSpanTag.classList.add('errormsgcolor')
}
function check1(){
    const inputs =document.querySelectorAll('input');
    let response
    inputs.forEach((item, index)=>{
        if(item.value == ""){
            response = true
        }
    })
    return response
}
function check2(){
    const inputs =document.querySelectorAll('input');
    if(inputs[5].value !== inputs[6].value){
        return true
    }
}
button.addEventListener('click', ()=>{
    answer = check1();
    answer2 = check2();
    if(answer === true) {
        errorMsg("Please fill out all fields")
    }else if (answer2 === true){
        errorMsg("Passwords do not match")
    }else form.submit();
})