import { appHelper } from "./js/helpers/helper.js";
import './css/style.css'

let cells = 10;
let letter = 'A';
let allowDrop = true;
const boats = {};
let isVertical = false;
let area;



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
  let currentCoordinates;

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

    if (currentCoordinates) {
      currentCoordinates.forEach(id => {
        const cell = document.getElementById(id)
        if (cell) {

          const area = getActiveArea(cell)

          event.dataTransfer.setData('area', area)
          area.forEach(row => {
            row.forEach(id => {
              const cell = document.getElementById(id)
              if (cell) {
                cell.classList.add('area')
              }
            })
          })
          cell.classList.add('active')
        }
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
    if (event.target.tagName === 'TD') {
      currentTd = event.target//запись в переменную текущей ячейки,для доступа в других обработчиках
      currentCoordinates = setShipPlace(currentTd.id, currentShipDrag)
    } else {
      currentTd = ''
    }


  }

  function tableDragLeave(event) {

    const leaveCoordinates = setShipPlace(event.target.id, currentShipDrag)

    if (leaveCoordinates) {

      leaveCoordinates.forEach(id => {
        const cell = document.getElementById(id)
        const areaIds = getActiveArea(cell)
        areaIds.forEach(row => {

          row.forEach(id => {
            let item = document.getElementById(id)
            if (item) {
              item.classList.remove('area')
              item.classList.remove('active')
            }

          }
          )
        })
      })

    }


  }




  function tableDragOver(event) {
    event.preventDefault()
  }


  function drop(event) {

    const area = document.querySelectorAll('.area')
    const ship = document.querySelectorAll('.active')

    function checkArea() {
      const areaArr = Array.from(area)
      let result = [];
      //логичнее было бы использовать filter,промучался несколько часов - так и не разобрался почему не заработало
      areaArr.forEach(elem => {
        if (elem.classList.contains('ship-place')) {
          result.push(elem)
        }
      })
      if (result.length === 0 && ship.length === currentCoordinates.length ) {
        return true;
      } else {
        return false;
      }

    }



    function clearArea() {
      area.forEach(cell => {
        cell.classList.remove('area')
      })
      ship.forEach(cell => {
        cell.classList.remove('active')
      })
    }

    let isAllow = checkArea();
    if (!isAllow) {
      console.log(isAllow)
      clearArea()
      currentCoordinates = ''
      currentShipDrag = ''

      return false;
    } else {
      area.forEach(cell => {
        cell.classList.remove('area')
      })
      ship.forEach(cell => {
        cell.classList.replace('active', 'ship-place')
      })
      currentCoordinates = ''
      currentShipDrag = ''
    }

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


