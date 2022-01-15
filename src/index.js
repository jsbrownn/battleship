import { appHelper } from "./js/helpers/helper.js";
import './css/style.css'

let cells = 10;
let letter = 'A';
let allowDrop = true;
const boats = {};
let isVertical = false;



function generateTable(count, letter) {
  const table = document.querySelector('.battle-field')

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


function setShipPlace(id, current) {
  let r = /\d+/;
  const deckCount = +current.match(r)[0];
  const targetId = id;
  const boatsCordinates = []
  if (deckCount === 1) {
    boatsCordinates.push(targetId)
  } else {
    boatsCordinates.push(targetId)
    boats[current] = setShipCells(targetId)
  }

  function setShipCells(id) {
    if (boatsCordinates.length === deckCount) {

      return boatsCordinates;
    } else {

      let cordX = id.split(':')[0]
      let cordY = +id.split(':')[1]

      if (!isVertical) {
        cordY += 1
      } else {
        cordX = appHelper.nextLetterInAlphabet(cordX)
      }
      const cellId = cordX + ":" + cordY
      boatsCordinates.push(cellId)

      return setShipCells(cellId)
    }
  }

  return boatsCordinates;
}

function shipArrangement() {

  let currentShipDrag;
  let currentTd;

  //флаг, разрешающи запуск событий перетаскивания
  if (allowDrop) {
    const ships = document.querySelectorAll('.ship')
    const table = document.querySelector('.battle-field')

    ships.forEach(ship => {
      ship.setAttribute('draggable', true)
      ship.ondrag = drag;
      ship.ondragstart = dragStart;
      // ship.ondragend = dragEnd;
      // ship.ondrop = drop
    })

    table.ondragenter = tableDragEnter;
    table.ondrop = drop;
    table.ondragover = tableDragOver;
    table.ondragleave = tableDragLeave;
  }

  function drag(event) {
    console.log('drag')
    if(currentTd){
      const area = getActiveArea(currentTd)
      console.log(area)
      area.forEach(row =>{
        row.forEach(id =>{
          const cell = document.getElementById(id)
          if(cell){
            cell.classList.add('allow')
          }
        })
      })
    }
  }

  function dragStart(event) {
    console.log('dragstart')
    const dragBlockSelector = event.target.parentElement.classList[1]
    currentShipDrag = dragBlockSelector
  }


  function tableDragEnter(event) {
    console.log('tableDragEnter')
    if(event.target.tagName === 'TD'){
      currentTd = event.target
    } else {
      currentTd =''
    }
  }

  function tableDragLeave(event) {
    console.log('table drag leave')
    const areaIds = getActiveArea(event.target) 
    areaIds.forEach(row => {
      row.forEach(id => {
        const item = document.getElementById(id)
        if (item) {
          item.classList.remove('allow')
        }
      })
    })
  }

  

  function tableDragOver(event) {
    event.preventDefault()
  }


  function drop(event) {
    console.log('drop')
    const place = event.target
    place.classList.add('active')
    place.classList.remove('allow')
  }

  function getActiveArea(cell) {
    const area = [];
    const [coordX, coordY] = cell.id.split(':')
    const firstColumnId = appHelper.previousLetterInAlphabet(coordX) + ":" + coordY;
    const lastColumnId = appHelper.nextLetterInAlphabet(coordX) + ":" + coordY

    const colummIds = [
      firstColumnId,
      cell.id,
      lastColumnId
    ];


    function getSublings(id) {
      const [coordX, coordY] = id.split(':')
      const previousSublingId = coordX + ':' + (+coordY - 1)
      const nextSublingId = coordX + ':' + (+coordY + 1)
      const row = [previousSublingId, id, nextSublingId]
      return row;
    }
    
    colummIds.forEach(id => {
      const row = getSublings(id)
      area.push(row)
    })
    return area;

  }

}


generateTable(cells, letter)
shipArrangement()


