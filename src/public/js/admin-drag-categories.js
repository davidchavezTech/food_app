let classVar;
function enableCatRepositioning(){
    container.addEventListener("mousedown", (e)=>{
        classVar = e.target.classList.value
    });
    
    const holder = document.querySelectorAll('.categories-cont')

    //opacity effect
    categoryContainers.forEach(draggable => {
        draggable.children[0].addEventListener('dragstart', (e) => {
            if(classVar == 'drag'){
                draggable.classList.add('dragging')
            }
        })
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
    holder.forEach(container => {
        container.addEventListener('dragover', e => {
            if(classVar == 'drag'){
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
            container.appendChild(draggable)
            } else {
            container.insertBefore(draggable, afterElement)
            }
            }
        })
    })

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.category-container:not(.dragging)')]

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
}