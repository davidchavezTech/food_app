editBtn = document.querySelector('.editSVG');
container = document.querySelector('.noodles');
uploadPhotoCont = document.querySelector('.upload-photo');
dynamicTemplate = document.querySelector('#dynamic-template');

//Buttons
editBtn = document.querySelector('.editSVG')
cameraBtn = document.querySelector('.cameraSVG')
moveBtn = document.querySelector('.moveSVG')
addBtn = document.querySelector('.addSVG')
deleteBtn = document.querySelector('.deleteSVG')


editableTitles = document.querySelectorAll('.title-edit')

let categoryContainers = document.querySelectorAll('a.category-container')
let imgContainers = document.querySelectorAll('.images-cont')
let newArray = Array.from(categoryContainers)
var cancelVariablesDic = {}
let textElements;
let imgID;
let imgCatType;
let imgName;
let imageForServer;
let cropperAspectRatio;
let setImageWidth;
let setImageHeight;
let addCategorySelection;
let deleteProceed;

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
        // categoryContainers = document.querySelectorAll('.category-container')//reset this selector
        //Save position of elements in case they cancel
        let i = 0
            
            categoryContainers.forEach(categoryContainer =>{
                // console.log('id: ' + i)
                let pElements = categoryContainer.querySelectorAll('p')
                // console.log('xT: ' + pElements[0].style.left)
                // console.log('yT: ' + pElements[0].style.top)
                // console.log('xST: ' + pElements[1].style.left)
                // console.log('yST: ' + pElements[1].style.top)
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
            draggableDiv.setAttribute('draggable', 'true')
            draggableDiv.innerHTML = `<img src="img/draggable.svg" class="draggable-dots">`
            newArray[j].append(draggableDiv);
            // let test = draggableDiv.previousSibling
            // console.log(test)
            draggableDiv.append(draggableDiv.previousElementSibling)
        }
        enableCatRepositioning()
        enableConfirmAndCancelBtns('draggable')

        //Enable repositioning of text elements
        textElements = document.querySelectorAll("p");
        textElements.forEach(textElement => {
        
            let str = textElement.classList.value;
            let titleOrSubtitle = str.substring(0, str.length - 1)
            var categoryType = str.charAt(str.length-1);

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
            //turns off draggable functionality I think
            textElement.onmousedown = null
        })
        let m = 0
        categoryContainers.forEach(container => {
            //removes draggable icon, I think
            container.append(imgContainers[m])
            
            container.children[0].remove()
            m++
        })
        m = 0
        categoryContainers = document.querySelectorAll('.category-container')
        imgContainers = document.querySelectorAll('.images-cont')
        categoryContainers.forEach(container =>{
            container.setAttribute('order', m)
            m++
        })
        revertEditingBtns()
        closeDragElement()
    }
    //CANCEL draggables edition:
    else if(e.target.id == "cancel-draggable"){
        i=0
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
        let m = 0
        categoryContainers.forEach(container => {
            container.append(imgContainers[m])
            container.children[0].remove()
            container.parentElement.append(container)
            m++
        })
        m = 0
        revertEditingBtns()
        closeDragElement()
    }
    else if(e.target.src == window.location.protocol + "//" + window.location.hostname + portnumber + "/img/camera.svg"){
        enableConfirmAndCancelBtns('camera')
        newArray.forEach(el =>{
            //remove cursor-pointer so that the new dots are the only ones with it
            el.lastElementChild.lastElementChild.style.pointerEvents = "none"
            el.style.cursor = 'auto'
        })
        let dotsSVGs = document.querySelectorAll('.dot')
        dotsSVGs.forEach(dotsSVG =>{
            //Replace display:none so that these dots are visible
            dotsSVG.style.display = 'block'
            // Make the X (cancel button) reload the page
            document.getElementById('cancel-camera').addEventListener('click', ()=>{
                location.reload()
            })
            dotsSVG.addEventListener('click', (dot)=>{
                document.getElementById('commit-camera').style.opacity = 0.5
                if(dot.target.id=='cat-1-dot-1'){
                    setImageWidth = 98.22
                    cropperAspectRatio = 56 / 65
                    imgID = dot.target.parentElement.parentElement.id
                    //get the source of the image from the dot we clicked on:
                    let imgSRC = dot.target.parentElement.children[0].src
                    let siblingsImgSRC = dot.target.parentElement.children[1].src
                    //Remove the whole root URL and only keep the name of the image
                    // var parts = imgSRC.split("/");
                    // imgName = parts[parts.length - 1]
                    imgName = imgID + ".cat-1_img-1.jpg"
                    //load the whole cat div
                    dynamicTemplate.innerHTML = `
                        <div class='images-cont-preview' style="position:relative">
                            <div class='preview' style="position:absolute;left:0;top:0;width:98px;height:100%;display:inline-block;">
                                <img class="cat-style-1-img1" src="` + imgSRC + `">
                            </div>
                            
                            <img class="cat-style-1-img2" src="`+ siblingsImgSRC + `">
                            
                            <img class="cat-style-1-template-left" src="img/cat-images/cat-style-1-template-left.png" style="pointer-events:none">
                            <img class="cat-style-1-template-right" src="img/cat-images/cat-style-1-template-right.png" style="pointer-events:none">
                            <div class="cat-text-container">
                                <p class="cat-title1"></p>
                                <p class="cat-subtitle1"></p>
                            </div>
                        </div>
                    `
                    
                    //Get the text and style from the original cat div and copy it to the preview cat div
                    //Get title's text and position
                    let titleVar = dot.target.parentElement.lastElementChild.children[0].innerHTML
                    let titleVarY = dot.target.parentElement.lastElementChild.children[0].style.top
                    let titleVarX = dot.target.parentElement.lastElementChild.children[0].style.left
                    //Set title's text and position
                    dynamicTemplate.children[0].lastElementChild.children[0].innerHTML = titleVar
                    dynamicTemplate.children[0].lastElementChild.children[0].style.top = titleVarY
                    dynamicTemplate.children[0].lastElementChild.children[0].style.left = titleVarX
                    //Get subtitle's text and position
                    let subtitleVar = dot.target.parentElement.lastElementChild.children[1].innerHTML
                    let subtitleVarY = dot.target.parentElement.lastElementChild.children[1].style.top
                    let subtitleVarX = dot.target.parentElement.lastElementChild.children[1].style.left
                    //Set subtitle's text and position
                    dynamicTemplate.children[0].lastElementChild.children[1].innerHTML = subtitleVar
                    dynamicTemplate.children[0].lastElementChild.children[1].style.top = subtitleVarY
                    dynamicTemplate.children[0].lastElementChild.children[1].style.left = subtitleVarX
                    
                    uploadPhotoCont.style.display = 'block'
                }else if(dot.target.id=='cat-1-dot-2'){
                        setImageWidth = 98.22
                        cropperAspectRatio = 56 / 65

                        document.getElementById('commit-camera').style.opacity = 0.5
                        imgID = dot.target.parentElement.parentElement.id
                        //get the source of the image from the dot we clicked on:
                        let imgSRC = dot.target.parentElement.children[1].src
                        let siblingsImgSRC = dot.target.parentElement.children[0].src
                        //Remove the whole root URL and only keep the name of the image
                        // var parts = imgSRC.split("/");
                        // imgName = parts[parts.length - 1]
                        imgName = imgID + ".cat-1_img-2.jpg"
                        //load the whole cat div
                        dynamicTemplate.innerHTML = `
                            <div class='images-cont-preview'>
                                <img class="cat-style-1-img1" src="` + siblingsImgSRC + `">
                                <div class='preview' style="position:absolute;right:0;top:0;width:98px;height:100%;display:inline-block;">
                                    <img class="cat-style-1-img2" src="` + imgSRC + `">
                                </div>
                                <img class="cat-style-1-template-left" src="img/cat-images/cat-style-1-template-left.png" style="pointer-events:none">
                                <img class="cat-style-1-template-right" src="img/cat-images/cat-style-1-template-right.png" style="pointer-events:none">
                                <div class="cat-text-container">
                                    <p class="cat-title1"></p>
                                    <p class="cat-subtitle1"></p>
                                </div>
                            </div>
                        `
                        //Get the text and style from the original cat div and copy it to the preview cat div
                        //Get title's text and position
                        let titleVar = dot.target.parentElement.lastElementChild.children[0].innerHTML
                        let titleVarY = dot.target.parentElement.lastElementChild.children[0].style.top
                        let titleVarX = dot.target.parentElement.lastElementChild.children[0].style.left
                        //Set title's text and position
                        dynamicTemplate.children[0].lastElementChild.children[0].innerHTML = titleVar
                        dynamicTemplate.children[0].lastElementChild.children[0].style.top = titleVarY
                        dynamicTemplate.children[0].lastElementChild.children[0].style.left = titleVarX
                        //Get subtitle's text and position
                        let subtitleVar = dot.target.parentElement.lastElementChild.children[1].innerHTML
                        let subtitleVarY = dot.target.parentElement.lastElementChild.children[1].style.top
                        let subtitleVarX = dot.target.parentElement.lastElementChild.children[1].style.left
                        //Set subtitle's text and position
                        dynamicTemplate.children[0].lastElementChild.children[1].innerHTML = subtitleVar
                        dynamicTemplate.children[0].lastElementChild.children[1].style.top = subtitleVarY
                        dynamicTemplate.children[0].lastElementChild.children[1].style.left = subtitleVarX
                        
                        uploadPhotoCont.style.display = 'block'
                    }else if(dot.target.id=='cat-2-dot'){
                        //setImageWidth is the parameter we will be passing for the function that resizes the cropped canvas. This will set the width for the resized image sent to the server
                        setImageWidth = 221
                        cropperAspectRatio = setImageWidth / 114
                        document.getElementById('commit-camera').style.opacity = 0.5
                        imgID = dot.target.parentElement.parentElement.id
                        //get the source of the image from the dot we clicked on:
                        let imgSRC = dot.target.parentElement.children[0].src
                        //Remove the whole root URL and only keep the name of the image
                        // var parts = imgSRC.split("/");
                        imgName = imgID + ".cat-2_img.jpg"
                        //load the whole cat div
                        dynamicTemplate.innerHTML = `
                            <div class='images-cont-preview' style="position:relative">

                                <div class='preview' style="position:absolute;left:0;top:0;display:inline-block;width:300px;height:100%;">
                                    <img class="cat-style-1-img1" src="` + imgSRC + `">
                                </div>
                                <img class="cat-style-1-template-left" src="img/cat-images/cat-style-2-template.png"  style="pointer-events:none">
                                <div class="cat-text-container-style-2">
                                    <p class="cat-title2" style="top: 10px; left:210px;"></p>
                                    <p class="cat-subtitle2" style="top: 70px; left:190px;"></p>
                                </div>
                            </div>
                        `
                        
                        //Get the text and style from the original cat div and copy it to the preview cat div
                        //Get title's text and position
                        let titleVar = dot.target.parentElement.lastElementChild.children[0].innerHTML
                        let titleVarY = dot.target.parentElement.lastElementChild.children[0].style.top
                        let titleVarX = dot.target.parentElement.lastElementChild.children[0].style.left
                        //Set title's text and position
                        dynamicTemplate.children[0].lastElementChild.children[0].innerHTML = titleVar
                        dynamicTemplate.children[0].lastElementChild.children[0].style.top = titleVarY
                        dynamicTemplate.children[0].lastElementChild.children[0].style.left = titleVarX
                        //Get subtitle's text and position
                        let subtitleVar = dot.target.parentElement.lastElementChild.children[1].innerHTML
                        let subtitleVarY = dot.target.parentElement.lastElementChild.children[1].style.top
                        let subtitleVarX = dot.target.parentElement.lastElementChild.children[1].style.left
                        //Set subtitle's text and position
                        dynamicTemplate.children[0].lastElementChild.children[1].innerHTML = subtitleVar
                        dynamicTemplate.children[0].lastElementChild.children[1].style.top = subtitleVarY
                        dynamicTemplate.children[0].lastElementChild.children[1].style.left = subtitleVarX
                        
                        uploadPhotoCont.style.display = 'block'
                    }else if(dot.target.id=='cat-3-dot'){
                        //setImageWidth is the parameter we will be passing for the function that resizes the cropped canvas. This will set the width for the resized image sent to the server
                        setImageWidth = 270
                        cropperAspectRatio = setImageWidth / 114
                        document.getElementById('commit-camera').style.opacity = 0.5
                        imgID = dot.target.parentElement.parentElement.id
                        //get the source of the image from the dot we clicked on:
                        let imgSRC = dot.target.parentElement.children[0].src
                        // //Remove the whole root URL and only keep the name of the image
                        // var parts = imgSRC.split("/");
                        imgName = imgID + ".cat-3_img.jpg"
                        //load the whole cat div
                        dynamicTemplate.innerHTML = `

                            <div class='images-cont-preview' style="position:relative">
                                <div class='preview' style="position:absolute;right:0;top:0;display:inline-block;width:270px;height:100%;">
                                    <img class="cat-style-3-img" src="` + imgSRC + `">
                                </div>
                                <img class="cat-style-1-template-left" src="img/cat-images/cat-style-3-template.png">
                                <div class="cat-text-container-style-3">
                                    <p class="cat-title3" style="top: 10px; left:20px;">{{../Title}}</p>
                                    <p class="cat-subtitle3" style="top: 80px; left:0px;">{{../Subtitle}}</p>
                                </div>
                            </div>
                        `
                        //Get the text and style from the original cat div and copy it to the preview cat div
                        //Get title's text and position
                        let titleVar = dot.target.parentElement.lastElementChild.children[0].innerHTML
                        let titleVarY = dot.target.parentElement.lastElementChild.children[0].style.top
                        let titleVarX = dot.target.parentElement.lastElementChild.children[0].style.left
                        //Set title's text and position
                        dynamicTemplate.children[0].lastElementChild.children[0].innerHTML = titleVar
                        dynamicTemplate.children[0].lastElementChild.children[0].style.top = titleVarY
                        dynamicTemplate.children[0].lastElementChild.children[0].style.left = titleVarX
                        //Get subtitle's text and position
                        let subtitleVar = dot.target.parentElement.lastElementChild.children[1].innerHTML
                        let subtitleVarY = dot.target.parentElement.lastElementChild.children[1].style.top
                        let subtitleVarX = dot.target.parentElement.lastElementChild.children[1].style.left
                        //Set subtitle's text and position
                        dynamicTemplate.children[0].lastElementChild.children[1].innerHTML = subtitleVar
                        dynamicTemplate.children[0].lastElementChild.children[1].style.top = subtitleVarY
                        dynamicTemplate.children[0].lastElementChild.children[1].style.left = subtitleVarX
                        
                        uploadPhotoCont.style.display = 'block'
                    }else if(dot.target.id=='cat-4-dot'){
                        let image1;
                        let image2;
                        let image3;
                        document.getElementById('commit-camera').style.opacity = 0.5
                        imgID = dot.target.parentElement.parentElement.id
                        
                        if(dot.target.classList.contains("cat-style-4-template-dot-1")){
                            let imgSRC = dot.target.parentElement.children[0].src
                            let siblingTwoImgSRC = dot.target.parentElement.children[1].src
                            let siblingthreeImgSRC = dot.target.parentElement.children[2].src
                            //setImageWidth is the parameter we will be passing for the function that resizes the cropped canvas. This will set the width for the resized image sent to the server
                            setImageWidth = 59
                            setImageHeight = 103

                            imgName = imgID + ".cat-4_img-1.jpg"

                            image1 = `
                                <div class='preview' style="position:absolute;left: 15%;height: 90%;bottom: 0;display:inline-block;width:auto;width:59px">
                                    <img class="cat-style-4-img1" src="` + imgSRC + `">
                                </div>
                            `
                            image2 = `
                                <img class="cat-style-4-img2" src="` + siblingTwoImgSRC + `">
                            `
                            image3 =`
                                <img class="cat-style-4-img3" src="` + siblingthreeImgSRC + `">
                            `
                        }else if(dot.target.classList.contains("cat-style-4-template-dot-2")){
                            let siblingOneImgSRC = dot.target.parentElement.children[0].src
                            let imgSRC = dot.target.parentElement.children[1].src
                            let siblingthreeImgSRC = dot.target.parentElement.children[2].src
                            //setImageWidth is the parameter we will be passing for the function that resizes the cropped canvas. This will set the width for the resized image sent to the server
                            setImageWidth = 63
                            setImageHeight = 91

                            imgName = imgID + ".cat-4_img-2.jpg"

                            image1 = `
                                    <img class="cat-style-4-img1" src="` + siblingOneImgSRC + `">
                            `
                            image2 = `
                                <div class='preview' style="position:absolute;left: 39%;height: 80%;display:inline-block;width:63px;">
                                    <img class="cat-style-4-img2" src="` + imgSRC + `">
                                </div>
                            `
                            image3 =`
                                <img class="cat-style-4-img3" src="` + siblingthreeImgSRC + `">
                            `
                        }else if(dot.target.classList.contains("cat-style-4-template-dot-3")){
                            let siblingOneImgSRC = dot.target.parentElement.children[0].src
                            let siblingTwoImgSRC = dot.target.parentElement.children[1].src
                            let imgSRC = dot.target.parentElement.children[2].src
                            //setImageWidth is the parameter we will be passing for the function that resizes the cropped canvas. This will set the width for the resized image sent to the server
                            setImageWidth = 59
                            setImageHeight = 103

                            imgName = imgID + ".cat-4_img-3.jpg"

                            image1 = `
                                    <img class="cat-style-4-img1" src="` + siblingOneImgSRC + `">
                            `
                            image2 = `
                                
                                    <img class="cat-style-4-img2" src="` + siblingTwoImgSRC + `">
                                
                            `
                            image3 =`
                                <div class='preview' style="position:absolute;right: 15%;height: 90%;bottom:0;display:inline-block;width:59px;">
                                    <img class="cat-style-4-img3" src="` + imgSRC + `">
                                </div>
                            `
                        }
                        //load the whole cat div
                        dynamicTemplate.innerHTML = `
                            <div class='images-cont-preview' style="position:relative">` +
                                image1 +
                                image2 + 
                                image3 + 
                                `<img class="cat-style-4-template" src="img/cat-images/cat-style-4-template.png">
                                <div class="cat-text-container-style-4" >
                                    <p class="cat-title4" style=""></p>
                                    <p class="cat-subtitle4" style=""></p>
                                </div>
                            </div>
                        `
                        cropperAspectRatio = setImageWidth / setImageHeight

                        //Get the text and style from the original cat div and copy it to the preview cat div
                        //Get title's text and position
                        let titleVar = dot.target.parentElement.lastElementChild.children[0].innerHTML
                        let titleVarY = dot.target.parentElement.lastElementChild.children[0].style.top
                        let titleVarX = dot.target.parentElement.lastElementChild.children[0].style.left
                        //Set title's text and position
                        dynamicTemplate.children[0].lastElementChild.children[0].innerHTML = titleVar
                        dynamicTemplate.children[0].lastElementChild.children[0].style.top = titleVarY
                        dynamicTemplate.children[0].lastElementChild.children[0].style.left = titleVarX
                        //Get subtitle's text and position
                        let subtitleVar = dot.target.parentElement.lastElementChild.children[1].innerHTML
                        let subtitleVarY = dot.target.parentElement.lastElementChild.children[1].style.top
                        let subtitleVarX = dot.target.parentElement.lastElementChild.children[1].style.left
                        //Set subtitle's text and position
                        dynamicTemplate.children[0].lastElementChild.children[1].innerHTML = subtitleVar
                        dynamicTemplate.children[0].lastElementChild.children[1].style.top = subtitleVarY
                        dynamicTemplate.children[0].lastElementChild.children[1].style.left = subtitleVarX

                        uploadPhotoCont.style.display = 'block'
                    }
            })
        })
        
    }
    else if(e.target.id == "add-category"){
        document.querySelector('.deleteSVG').addEventListener('click', ()=>{
            location.reload()
        })
        document.querySelector('.categories-cont').style.display = 'none'
        enableConfirmAndCancelBtns('new-category')
        let templateContainer = document.querySelector('#add-cat-cont')
        templateContainer.style.display = 'block'
        templateContainer.innerHTML = `
        <div class="add-cat-title">
                <span>Choose a Template</span>
        </div>

        <div style="display:flex;" cat-type="1">
            <img src="img/cat-images/cat-1_template.png" class="cat-template-img">
            <img src="img/radio-empty.svg" class="radio-btn" id="cat-selected-1">
        </div>

        <div style="display:flex;" cat-type="2">
            <img src="img/cat-images/cat-2_template.png" class="cat-template-img">
            <img src="img/radio-empty.svg" class="radio-btn" id="cat-selected-2">
        </div>

        <div style="display:flex;" cat-type="3">
            <img src="img/cat-images/cat-3_template.png" class="cat-template-img">
            <img src="img/radio-empty.svg" class="radio-btn" id="cat-selected-3">
        </div>

        <div style="display:flex;" cat-type="4">
            <img src="img/cat-images/cat-4_template.png" class="cat-template-img">
            <img src="img/radio-empty.svg" class="radio-btn" id="cat-selected-4">
        </div>
        `
        let radioBtns = document.querySelectorAll('.radio-btn')
        function deselectRadioBtns(){
            radioBtns.forEach(btn =>{
                btn.src = 'img/radio-empty.svg'
            })
        }
        radioBtns.forEach( btn =>{
            btn.addEventListener('click',(e)=>{
                deselectRadioBtns()
                e.target.src = 'img/radio-selected.svg'
                e.target.id = 'selected-radio'
            })
        })
    }else if(e.target.id == "commit-new-category"){
        addCategorySelection = document.querySelector('#selected-radio').parentElement.getAttribute('cat-type')
        var fd = new FormData();
        fd.append('category-type-selected', addCategorySelection);

        const options= {
            method: 'POST',
            body: fd
        }
        fetch('/admin-upload', options).then(res => res.json()
            .then(data => ({
                data: data,
                status: res.status
            })
        ).then(res => {
        // console.log(res.status, res.data)
        if(res.data["Response"]){
            location.reload()
        }
    })
    ).catch(err => console.log(err));
    }else if(e.target.classList[0] == "deleteSVG"){
        if(!deleteProceed){
            deleteProceed=1
            enableConfirmAndCancelBtns('delete')
            let containers = document.querySelectorAll('.category-container')
            containers.forEach(container =>{
                container.style.marginLeft = '-16px'
                let check = document.createElement('img')
                let newContainer = document.createElement('div')
                newContainer.classList = 'check-container'
                check.classList.add('checks')
                check.id = ('unchecked')
                check.src = 'img/check-empty.svg'
                container.append(newContainer)
                newContainer.append(newContainer.previousElementSibling)
                container.append(check)
            })
            let checks = document.querySelectorAll('.checks')
            checks.forEach(check =>{
                check.addEventListener('click', (e)=>{
                    if(e.target.id=='unchecked'){
                        e.target.src = 'img/check-checked.svg'
                        e.target.id='checked'
                    }else{
                        e.target.src = 'img/check-empty.svg'
                        e.target.id='unchecked'
                    }
                })
            })
            let confirmDeletion = document.querySelector('#commit-delete')
            confirmDeletion.style.opacity=0.5
            confirmDeletion.addEventListener('click',(e)=>{
                console.log('damn')
            })
        }else{
            location.reload()
        }
    }
})
function closeDragElement() {
    /* stop moving when mouse button is released:*/
    mobile == true ? document.ontouchmove = null : document.onmousemove = null
    mobile == true ? document.ontouchend = null : document.onmouseup = null                
}
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
                
                console.log(variable)
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
    addBtn.id = "add-category"
    addBtn.style = "display:auto"
    deleteBtn.id = ""
    deleteBtn.style = "display:auto"
    deleteBtn.src = 'img/delete.svg'
}
function createVariables(variableName, i, value){
    cancelVariablesDic[variableName+i]=value
}
let cropBtnTwo = document.querySelector('#crop-btn-two')
let endBtn = document.querySelector('#end')
let canvas = document.getElementById('cat-1-img-1-canvas')
const croppedImage = document.getElementById("croppedImage");
const input = document.getElementById("fileInput");

input.addEventListener('change', ()=>{
    document.getElementById('upload-btn').style.display = 'none'
    // this function will be called when the file input below is changed
    var file = document.getElementById("fileInput").files[0];  // get a reference to the selected file
    var reader = new FileReader(); // create a file reader
    // set an onload function to show the image in cropper once it has been loaded
    reader.onload = function(event) {
        var data = event.target.result; // the "data url" of the image
        
        //create an image to get the dimensions of the uploaded image
        var image = new Image();
        image.src = event.target.result;     
        //Validate the File Height and Width.
        image.onload = function () {
            document.querySelector('.cat-style-1-img1').remove
            //this is the image
            var imgHeight = this.height;
            var imgWidth = this.width;
            canvas.width = imgWidth
            canvas.height = imgHeight
            if(imgWidth<imgHeight){
                canvas.style.height = '280px'
                canvas.style.width = 'auto'
            }else{
                canvas.style.width = '280px'
                canvas.style.height = 'auto'
            }
            let ctx = canvas.getContext("2d");
            // var img = document.getElementById("example-img");
            ctx.drawImage(image, 0, 0);

            //remove the previews image
            document.querySelector('.preview').innerHTML = ''
            let cropper = new Cropper(canvas, {
                    aspectRatio: cropperAspectRatio,
                    // autoCrop: false,
                    preview: '.preview',
                    ready() {
                        //get the cropped imaged from cropper canvas and then resize it with the function downScaleCanvas()
                        document.getElementById('commit-camera').style.opacity = 1
                        document.getElementById('commit-camera').addEventListener('click', ()=>{
                            
                            let cropperCroppedImage = cropper.getCroppedCanvas()
                            let resizedImgCanvas = downScaleCanvas(cropperCroppedImage, setImageWidth, setImageHeight)
                            resizedImgCanvas.toBlob(function(blob) {
                                //upload image to server
                                var fd = new FormData();
                                fd.append('image', blob, imgName);
    
                                const options= {
                                    method: 'POST',
                                    body: fd
                                }
                                fetch('/admin-upload', options).then(res => location.reload()).catch(err => console.log(err));
                            })
                        
                        })
                    },
                });
        }

    };
    reader.readAsDataURL(file); // this loads the file as a data url calling the function above once done
})
const downScaleCanvas = (callbackImg, setImgWith, setImageHeight) => {
    if(!setImageHeight){
        setImageHeight = 114
    }
    let scaledCanvas = document.createElement('canvas');
    
    let ctx = scaledCanvas.getContext('2d');

        scaledCanvas.width = setImgWith
        scaledCanvas.height = setImageHeight
        ctx.drawImage(callbackImg,0,0,setImgWith,setImageHeight); // positionX,positionY,offsetX,offsetY

    return scaledCanvas;
  };

//replace missing images with the default ones
window.addEventListener("load", event => {
    let checkImages = document.querySelectorAll('img');
    checkImages.forEach(image =>{
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            switch (image.id) {
                case 'cat-1_image-1':
                  image.src = 'img/cat-images/cat-style-1-img1.jpg';
                  break;
                case 'cat-1_image-2':
                  image.src = 'img/cat-images/cat-style-1-img2.jpg';
                  break;
                case 'cat-2_image':
                   image.src = 'img/cat-images/cat-style-2-img.jpg';
                  break;
                case 'cat-3_image':
                  image.src = 'img/cat-images/cat-style-3-img.jpg';
                  break;
                case 'cat-4_image-1':
                  image.src = 'img/cat-images/cat-style-4-img1.jpg';
                  break;
                case 'cat-4_image-2':
                  image.src = 'img/cat-images/cat-style-4-img2.jpg';
                  break;
                case 'cat-4_image-3':
                  image.src = 'img/cat-images/cat-style-4-img3.jpg';
              }
        }
    })
});