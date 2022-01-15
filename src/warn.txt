

import './assets/images/ships/1.png'
import './assets/images/ships/2.png'
import './assets/images/ships/3.png'
import './assets/images/ships/4.png'
import { appHelper } from './js/helpers/helper';





}




function arrangeShips() {
  let current;
  let boats = {}
  let isVertical = false;





  function checkCells(event) {

    const target = event.target
    // debugger
    const area = setShipPlace(target.id)
    console.log(area)
    area.forEach(cell => {
      let elem = document.getElementById(`${cell}`)
      if (elem) {
        elem.classList.add('allow')
      }
    })
  }

function initHandlers(event) {

  console.log(event.target)

  //rotate ship on field
  if (event.target.closest('.ship') && event.target.closest('td')) {
    console.log('true')
  }
  else {
    console.log('false')
  }




}



const field = document.querySelector('.ship-placement')
field.addEventListener('click', initHandlers)






  function allowDrop(event) {
    event.dataTransfer.dropEffect = 'copy'

    //  const target = event.target
    // console.log(target)
    // if (target.classList.contains('droppable')) {
    //   const area = findArea(target.id)

    //   area.forEach(cell => {
    //     let elem = document.getElementById(`${cell}`)
    //     if (elem) {
    //       elem.classList.remove('allow')
    //     }
     // })
    //}
    // console.log('drag')
  }



  function dragStart(event) {

    console.log('dragstart')
    const shipClass = event.target.parentElement.classList[1]
    event.dataTransfer.setData('selector', shipClass)

    event.dataTransfer.effectAllowed = 'copy'
    //  event.preventDefault()
    current = shipClass


  }

  function dragLeave(event) {
    console.log('dragleave')
    const target = event.target

    if (target.classList.contains('droppable')) {
      
      const area = findArea(target.id)
      console.log( area )
      // debugger
      area.forEach(cell => {
        let elem = document.getElementById(`${cell}`)
        if (elem) {
          elem.classList.remove('allow')
        }
      })
    }
  }

  function dragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }


  

  function dragEnter(event) {
    console.log('dragenter')
    const target = event.target

    if (target.classList.contains('droppable')) {
      const area = setShipPlace(target.id)
      console.log ( area )
      area.forEach(cell => {
        let elem = document.getElementById(`${cell}`)
        if (elem) {
          elem.classList.remove('allow')
        }
      })
    }
    checkCells(event)
  }


  function dragEnd(event) {
    console.log('dragend')
  }

  function drop(event) {
    console.log('drop')
    const ship = document.querySelector(`.${event.dataTransfer.getData('selector')}`)
    const cell = event.target
    // cell.style.position = 'absolute'
    // ship.style.position = 'absolute'
    // ship.style.top = "0"
    boats[current] = cell.id
    console.log('boats', boats)
    // cell.appendChild(ship)
    current = '';

  }

  


}








console.warn(event.dataTransfer.getData('ship'))
















generateTable(cells)
arrangeShips();




