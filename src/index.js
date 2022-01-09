
import './css/style.css'
import './assets/images/ships/1.png'
import './assets/images/ships/2.png'
import './assets/images/ships/3.png'
import './assets/images/ships/4.png'
import { appHelper } from './js/helpers/helper';






function generateTable(count) {
  const table = document.querySelector('.battle-field')
  let letter = 'A';

  function generateRow(i) {
    const tr = document.createElement('tr')

    for (let j = 0; j <= count; j++) {
      const td = document.createElement('td')
      if (i !== 0) {
        if (j === 0) {
          td.innerText = letter;
          letter = appHelper.nextLetterInAlphabet(letter)
        }
        td.id = `${appHelper.previousLetterInAlphabet(letter)}:${j}`
        td.classList.add('droppable')
        tr.append(td)
      } else {
        if (j === 0) {
          tr.append(td)
        } else {
          td.innerText = j;
          tr.append(td)
        }
      }
    }
    table.append(tr)
  }

  for (let i = 0; i <= count; i++) {
    generateRow(i)
  }

}




function arrangeShips() {

  function checkCells(){
    console.log(event)
    const target = event.target
    const area = findArea(target.id,event)
    area.forEach(cell =>{

      let elem = document.getElementById(`${cell}`)
      if (elem){
        elem.classList.add('allow')
      }

    })
  }

  function allowDrop(event) {
    event.preventDefault()
    if(event.target.classList.contains('droppable')){
      checkCells()
    }
    
  }

  function dragLeave(event) {
    const target = event.target
    const area = findArea(target.id)
    area.forEach(cell =>{
      let elem = document.getElementById(`${cell}`)
      // debugger
      if (elem){
        elem.classList.remove('allow')
      }

    })
  }

  function findArea(id){
    const targetId = id;
    const targetX = targetId.split(":")[0]
    const targetY = targetId.split(":")[1]
    const area = []
    const firstElemX = targetX 
    const firstElemY = targetY
    const num  = 3;
    for ( let i = 0; i < num ; i++){
      let targetId = []
      targetId.push(firstElemX)
      targetId.push(+firstElemY + i - 1)
      targetId = targetId.join(':')
      area.push(targetId)     
    } 
    
    console.log( area )
    return area;

  }

  function drag(event) {
    event.dataTransfer.setData('selector', event.target.classList[1])
  }

  function drop(event) {
    console.warn(event)
    const cell = event.target
    cell.style.background = "red"
  }

  const ships = document.querySelectorAll('.ship')
  ships.forEach(ship => {
    ship.setAttribute('draggable', true)
    ship.ondragover = allowDrop;
    ship.ondragleave = dragLeave;
    ship.ondragstart = drag;
  })


  const table = document.querySelector('.battle-field')
  table.ondragover = allowDrop;
  table.ondrop = drop;
  table.ondragleave = dragLeave;


}


function addShips() {
  const shipblocks = Array.from(document.querySelectorAll('.ship') )
  console.log(shipblocks)
  const ship = document.querySelector('.ship')
  const img = new Image()
  img.src = '/src/assets/images/ships/4.png'
  // ship.append(img)
}



generateTable(10)
addShips()
arrangeShips();




