editBtn = document.querySelector('.editSVG');
container = document.querySelector('.noodles');

//Buttons
editBtn = document.querySelector('.editSVG')
cameraBtn = document.querySelector('.cameraSVG')
moveBtn = document.querySelector('.moveSVG')
addBtn = document.querySelector('.addSVG')
deleteBtn = document.querySelector('.deleteSVG')


editableTitles = document.querySelectorAll('.title-edit')

let categoryContainers = document.querySelectorAll('.category-container')
let newArray = Array.from(categoryContainers)
var cancelVariablesDic = {}
let textElements;


//If enter is pressed, lose input focus.
function isMobile() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false; }
}
let mobile = isMobile();
editableTitles.forEach(element => {
    element.style.width = ((element.value.length + 1) * 20) + 'px';
    element.addEventListener('keyup',function(e){
        if (e.which == 13) this.blur();
    });
});
container.addEventListener('click', (e)=>{
    
    //check if there is a port number, if not, then set var portnumber to ""
    let portnumber = window.location.port
    if(portnumber){
        portnumber = ":" + portnumber
    }else{
        portnumber = ""
    }
    if(e.target.src == window.location.protocol + "//" + window.location.hostname + portnumber + "/img/edit.svg"){

        enableConfirmAndCancelBtns('edit')

        for(i=0;i<newArray.length;i++){
            
            changePtoInput(newArray[i])
           
        }//End of for loop
    }
    //REVERT inputs back to p's
    else if(e.target.id == "commit-edit"){
        
        revertEditingBtns()

        for(i=0;i<newArray.length;i++){
            
                revertInputToP(newArray[i])
    
        e.target.src = window.location.protocol + "//" + window.location.hostname + portnumber + "/img/edit.svg"
        }
    }
    //Changes have been canceled. Use dictionary to put original titles and subtitles back
    else if(e.target.id == "cancel-edit"){
        revertEditingBtns(e.target)

        for (let k in cancelVariablesDic) {
            let category = k.replace(/[0-9]/g, '');
            let index = k.match(/\d+/)[0]; 
            let input = newArray[index].querySelectorAll('input')
            if(category == "titleForCat"){
                let pTitle = document.createElement('p')
                pTitle.classList = input[0].classList[0];
                pTitle.style.top = input[0].style.top;
                pTitle.style.left = input[0].style.left;
                pTitle.innerHTML= cancelVariablesDic[category + index]
                input[0].parentNode.replaceChild(pTitle, input[0]);
            }else if(category == "subtitleForCat"){
                let pSubtitle = document.createElement('p');
                pSubtitle.classList =  input[0].classList[0];
                pSubtitle.style.top = input[0].style.top;
                pSubtitle.style.left = input[0].style.left;
                pSubtitle.innerHTML= cancelVariablesDic[category + index]
                input[0].parentNode.replaceChild(pSubtitle, input[0]);
            }
        }cancelVariablesDic = {}
    }
    //ADD DRAGGABLE EFFECT
    else if(e.target.src == window.location.protocol + "//" + window.location.hostname + portnumber + "/img/move.svg"){

        //Save position of elements in case they cancel
        let i = 0
            
            categoryContainers.forEach(categoryContainer =>{
                console.log('id: ' + i)
                let pElements = categoryContainer.querySelectorAll('p')
                console.log('xT: ' + pElements[0].style.left)
                console.log('yT: ' + pElements[0].style.top)
                console.log('xST: ' + pElements[1].style.left)
                console.log('yST: ' + pElements[1].style.top)
                createVariables('xT', i, pElements[0].style.left)
                createVariables('yT', i, pElements[0].style.top)
                createVariables('xST', i, pElements[1].style.left)
                createVariables('yST', i, pElements[1].style.top)
                i++
            })
        
        //add draggable icon next to each category div
        for(j=0;j<newArray.length;j++){
            let draggableDiv = document.createElement('div');
            draggableDiv.classList = 'drag'
            draggableDiv.innerHTML = `<img src="img/draggable.svg" class="draggable-dots">`
            newArray[j].insertBefore(draggableDiv, newArray[j].firstChild);
        }
        enableConfirmAndCancelBtns('draggable')

        //Enable repositioning of text elements
        textElements = document.querySelectorAll("p");
        textElements.forEach(textElement => {
        
            let str = textElement.classList.value;
            let titleOrSubtitle = str.substring(0, str.length - 1)
            var categoryType = str.charAt(str.length-1);

            // console.log("Element's X offset: " + textElement.offsetLeft)
            // console.log("Element's Y offset: " + textElement.offsetTop)
            mobile == true ? textElement.ontouchstart = dragMouseDown : textElement.onmousedown = dragMouseDown
            function dragMouseDown(e) {
                width = e.target.offsetWidth
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                mobile == true ? pos3 = e.touches[0].clientX : pos3 = e.clientX
                mobile == true ? pos4 = e.touches[0].clientY : pos4 = e.clientY
                mobile == true ? document.ontouchend = closeDragElement : document.onmouseup = closeDragElement

                // call a function whenever the cursor moves:
                mobile == true ? document.ontouchmove = elementDrag : document.onmousemove = elementDrag
            }
            function elementDrag(e) {
                
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                let newXPos = mobile == true ? e.touches[0].clientX : e.clientX
                let newYPos = mobile == true ? e.touches[0].clientY : e.clientY
                pos1 = pos3 - newXPos
                pos2 = pos4 - newYPos
                pos3 = mobile == true ? e.touches[0].clientX : e.clientX;
                pos4 = mobile == true ? e.touches[0].clientY : e.clientY;

                //set the max movement for each text element:
                let a, b, c, d
                //titles
                if(categoryType == 1 && titleOrSubtitle == "cat-title") {
                    a=-7, b =10, c=80, d=130
                }else if(categoryType == 2 && titleOrSubtitle == "cat-title") {
                    a=-2, b =27, c=194, d=220
                }else if(categoryType == 3 && titleOrSubtitle == "cat-title") {
                    a=-6, b =24, c=6, d=45
                }else if(categoryType == 4 && titleOrSubtitle == "cat-title") {
                    a=22, b =41, c=89, d=124
                }
                //subtitles
                else if(categoryType == 1 && titleOrSubtitle == "cat-subtitle") {
                    a=68, b =84, c=65, d=121
                }else if(categoryType == 2 && titleOrSubtitle == "cat-subtitle") {
                    a=50, b =90, c=166, d=216
                }else if(categoryType == 3 && titleOrSubtitle == "cat-subtitle") {
                    a=63, b =90, c=-17, d=32
                }else if(categoryType == 4 && titleOrSubtitle == "cat-subtitle") {
                    a=86, b =96, c=63, d=118
                }
                // set the element's new position:
                let offsetleft = textElement.offsetLeft
                
                if((textElement.offsetTop - pos2 >= a && textElement.offsetTop - pos2 <= b) && (textElement.offsetLeft - pos1 >= c && textElement.offsetLeft - pos1 <= d)){
                    textElement.style.top = (textElement.offsetTop - pos2) + "px";
                    textElement.style.left = (offsetleft - pos1) + "px";
                }
                //OPTIONAL: Disable dragging if it hits bounding box's limits
                // else{
                //     closeDragElement()
                // }
            }
        })
    }
    else if(e.target.id == "commit-draggable"){
        textElements.forEach(textElement =>{
            textElement.onmousedown = null
        })
        let draggables = document.querySelectorAll('.drag')
        draggables.forEach(draggable =>{
            draggable.remove()
            revertEditingBtns()
        })
        closeDragElement()
    }
    //CANCEL draggables edition:
    else if(e.target.id == "cancel-draggable"){
        i=0
        console.log(cancelVariablesDic)
        var giveValue = function (k) {
            return cancelVariablesDic[k];
        };

        for (let k in cancelVariablesDic) {
            let key = k.replace(/[0-9]/g, '');
            let id = k.match(/\d+/)[0]; 
            let pElements = categoryContainers[id].querySelectorAll('p')
            if(key == 'xT'){
                pElements[0].style.left = giveValue(k)
            }else if (key == 'xST'){
                pElements[1].style.left = giveValue(k)
            }else if (key == 'yT'){
                pElements[0].style.top = giveValue(k)
            }else if (key == 'yST'){
                pElements[1].style.top = giveValue(k)
            }
        }cancelVariablesDic = {}
        textElements.forEach(textElement =>{
            textElement.onmousedown = null
        })
        let draggables = document.querySelectorAll('.drag')
        draggables.forEach(draggable =>{
            draggable.remove()
            revertEditingBtns()
        })
        closeDragElement()
    }
    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        mobile == true ? document.ontouchmove = null : document.onmousemove = null
        mobile == true ? document.ontouchend = null : document.onmouseup = null                
    }
})
function changePtoInput(array){
    var variable;
    switch (array.getAttribute("category_type")) {
      case "1":
        variable = 6;
        break;
      case "2":
        variable = 3;
        break;
      case "3":
        variable = 3;
        break;
      case "4":
          variable = 7;

    }
                //save data from <p> title
                
                //select <p>
                
                let pTitle = array.children[0].children[variable].children[0]
                //select <p>'s text(title) and store it
                let title = array.children[0].children[variable].children[0].innerHTML
                //select <p>'s (title) absolute positioning and store it
                
                let titlePositionX = pTitle.offsetLeft
                let titlePositionY = pTitle.offsetTop
                //select <p>'s class and store it
                let savedClass = array.children[0].children[variable].children[0].classList.value

                //create a variable and store it in dictionary (cancelVariablesDic) in case they cancel the edition
                createVariables('titleForCat', i, title)

                //Create input element for title and replace the p element with it

                let inputTitle = document.createElement('input')
                inputTitle.classList = savedClass + ' title-edit';
                inputTitle.setAttribute('maxlength', 11)
                // debugger
                inputTitle.style.left = titlePositionX + 'px'
                inputTitle.style.top = titlePositionY + 'px'
                inputTitle.value=title
                inputTitle.setAttribute("onkeypress","this.style.width = ((this.value.length + 1) * 20) + 'px'")
                inputTitle.style.width=((inputTitle.value.length + 1) * 20) + 'px'
                let newOffset = inputTitle.style.width.replace(/\D/g,'');
                newOffset = parseInt(newOffset, 10)/3
                inputTitle.style.transform = 'translateX(-' + newOffset + 'px)'
                pTitle.parentNode.replaceChild(inputTitle, pTitle);

                //create event listener for Enter and set it to lose focus

                inputTitle.addEventListener('keyup',function(e){
                                if (e.which == 13){
                                    inputTitle.blur();
                                }
                                });

                //save data from <p> subtitle
                
                //select <p>
                let pSubtitle = array.children[0].children[variable].children[1]
                //select <p>'s text(subtitle) and store it
                let savedSubtitle = array.children[0].children[variable].children[1].innerHTML
                //select <p>'s (subtitle) absolute positioning and store it
                let subtitlePositionX = pSubtitle.offsetLeft
                let subtitlePositionY = pSubtitle.offsetTop
                //select <p>'s class and store it
                let subtitleSavedClass = array.children[0].children[variable].children[1].classList.value
                
                //create a variable and store it in dictionary (cancelVariablesDic) in case they cancel the edition
                createVariables('subtitleForCat', i, savedSubtitle)
                 
                //Create input element for subtitle and replace the p element with it

                let subtitleInput = document.createElement('input');
                subtitleInput.classList = subtitleSavedClass + ' subtitle-edit';
                subtitleInput.setAttribute('maxlength', 35)
                subtitleInput.value=savedSubtitle
                subtitleInput.style.left = subtitlePositionX + 'px'
                
                subtitleInput.style.top = subtitlePositionY + 'px'
                subtitleInput.setAttribute("onkeypress","this.style.width = ((this.value.length + 1) * 6) + 'px'")
                subtitleInput.style.width=((subtitleInput.value.length + 1) * 6) + 'px'
                newOffset = subtitleInput.style.width.replace(/\D/g,'');
                newOffset = parseInt(newOffset, 10)/3
                subtitleInput.style.transform = 'translateX(-' + newOffset + 'px)'
                pSubtitle.parentNode.replaceChild(subtitleInput, pSubtitle);
                
                //create event listener for Enter and set it to lose focus

                subtitleInput.addEventListener('keyup',function(e){
                    if (e.which == 13){
                        subtitleInput.blur();
                    }
                });
}
function revertInputToP(array){
    var variable;
    switch (array.getAttribute("category_type")) {
      case "1":
        variable = 6;
        break;
      case "2":
        variable = 3;
        break;
      case "3":
        variable = 3;
        break;
      case "4":
          variable = 7;

    }
        //------------save data from <input> title
        
        //select <input>
        let inputTitle = array.children[0].children[variable].children[0]
        //select <p>'s text(title) and store it
        let title = array.children[0].children[variable].children[0].value
        //select <p>'s (title) absolute positioning and store it
        let titlePositionX = inputTitle.offsetLeft
        let titlePositionY = inputTitle.offsetTop
        //select <p>'s class and store it
        let savedClass = array.children[0].children[variable].children[0].classList[0]
        
        //Create p element for title and replace the input element with it
    
        let pTitle = document.createElement('p')
        pTitle.classList = savedClass;
        pTitle.innerHTML=title
        pTitle.style.left = titlePositionX + 'px'
        pTitle.style.top = titlePositionY + 'px'
        inputTitle.parentNode.replaceChild(pTitle, inputTitle);

        //---------save data from <p> subtitle
        
        //select <input>
        let inputSubtitle = array.children[0].children[variable].children[1]
        //select <input>'s text(title) and store it
        let savedSubtitle = array.children[0].children[variable].children[1].value
        //select <p>'s (subtitle) absolute positioning and store it
        let subtitlePositionX = inputSubtitle.offsetLeft
        let subtitlePositionY = inputSubtitle.offsetTop
        //select <input>'s class and store it
        let subtitleSavedClass = array.children[0].children[variable].children[1].classList[0]

        //Create input element for subtitle and replace the p element with it

        let pSubtitle = document.createElement('p');
        pSubtitle.classList = subtitleSavedClass;
        pSubtitle.innerHTML=savedSubtitle
        pSubtitle.style.left = subtitlePositionX + 'px'
        pSubtitle.style.top = subtitlePositionY + 'px'
        inputSubtitle.parentNode.replaceChild(pSubtitle, inputSubtitle);
    
}
function enableConfirmAndCancelBtns(btnType){
    editBtn.id = 'commit-' + btnType 
    editBtn.src = '/img/confirm.svg'
    cameraBtn.style = 'display:none'
    moveBtn.style = 'display:none'
    addBtn.style = 'display:none'
    deleteBtn.id = 'cancel-' + btnType 
    deleteBtn.src = '/img/cancel.svg'
}
function revertEditingBtns(){
    editBtn.id = ""
    editBtn.style = "display:auto"
    editBtn.src = "img/edit.svg"
    cameraBtn.id = ""
    cameraBtn.style = "display:auto"
    moveBtn.id = ""
    moveBtn.style = "display:auto"
    addBtn.id = ""
    addBtn.style = "display:auto"
    deleteBtn.id = ""
    deleteBtn.style = "display:auto"
    deleteBtn.src = 'img/delete.svg'
}
function createVariables(variableName, i, value){
    cancelVariablesDic[variableName+i]=value
}