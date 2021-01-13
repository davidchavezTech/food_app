const canvas = document.getElementById('testCanvas')
cropper.start(document.getElementById("testCanvas"), 1); // initialize cropper by providing it with a target canvas and a XY ratio (height = width * ratio)
						
function handleFileSelect() {
    // this function will be called when the file input below is changed
    var file = document.getElementById("fileInput").files[0];  // get a reference to the selected file
    
    var reader = new FileReader(); // create a file reader
    // set an onload function to show the image in cropper once it has been loaded
    reader.onload = function(event) {
        var data = event.target.result; // the "data url" of the image
        cropper.showImage(data); // hand this to cropper, it will be displayed
    };
    
    reader.readAsDataURL(file); // this loads the file as a data url calling the function above once done
}

const btn = document.querySelector('button')
btn.addEventListener('click', ()=>{

    var canvas = document.getElementById('testCanvas');
    // returns true if every pixel's uint32 representation is 0 (or "blank")
    function isCanvasBlank(canvas) {
        
    const context = canvas.getContext('2d');

    const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    
    return !pixelBuffer.some(color => color !== 0);
    }
    console.log(isCanvasBlank(canvas))
    canvas.toBlob((blob) =>{
        // var newImg = document.createElement('img'),
        // url = URL.createObjectURL(blob);

        //newImg.src = url;
        //document.body.appendChild(newImg);
        var fd = new FormData();
        fd.append('image', blob, 'success.jpg');

        const options= {
            method: 'POST',
            body: fd
        }
        fetch('/admin-upload', options)
        
});
})
const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container2')

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

containers.forEach(container => {
  container.addEventListener('dragover', e => {

    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}