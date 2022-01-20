import { appHelper } from '../../helpers/helper'
import { settingsModel } from '../../models/settings/settings.model'
import '/src/css/arrangement/arrangement.css'
import '/src/assets/images/ships/1.png'
import { gameModel } from '../../models/game/game.model'

const boats = gameModel.boats





function arrangementView() {

  let count = settingsModel.cellsCount
  let letter = settingsModel.startLetter
  let defaultShipCount = settingsModel.defaultShipCount
  const shipImages = document.querySelectorAll('.ship-image')
  const path = '/src/assets/images/ships/'
  let isBlocked = false
  let isActiveShip = false;
  let shipCoordinates;  //временная переменная для хранения координат корабля
  let isGap = false;

  function setImageSrc(images, path) {
    images.forEach(image => {
      let num = image.parentNode.classList[1].split('ship--')[1].split('deck')[0]
      image.src = `${path + num}.png`
    })
  }
  setImageSrc(shipImages, path)

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

    //убираем лишниий класс и ид, было лень цикл переписывать
    const rows = document.querySelectorAll('tr')
    rows.forEach(row => {
      let firstTd = row.children[0]
      firstTd.id = ''
      firstTd.classList.remove('droppable')
    })

  }

  generateTable(count, letter)

  function getActiveArea(cell) {
    const area = [];
    console.log(cell)
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

  function setShipCount() {
    const shipList = document.querySelectorAll('.ship')
    shipList.forEach(elem => {
      const num = elem.classList[1].split('ship--')[1].split('deck')[0]
      const shipCount = defaultShipCount[`deck${num}`]
      const shipCountElement = elem.nextElementSibling
      shipCountElement.textContent = `x${shipCount}`

    })

  }
  //////////есть в контроллере///////////
  function setBlockedCells(coordinates) {
    if (coordinates) {
      coordinates.forEach(id => {
        const cell = document.getElementById(id)
        if (cell) {
          const area = getActiveArea(cell)
          area.forEach(row => {
            row.forEach(id => {
              const cell = document.getElementById(id)
              if (cell) {
                if (cell.classList.contains('ship-place')) {
                  isBlocked = true;
                }
                cell.classList.add('area')
              }
            })
          })
          cell.classList.add('active')
        }
        isGap = false
      })

      const active = document.querySelectorAll('.active')
      if (active.length !== coordinates.length) {
        isBlocked = true;
      }



      function checkIsGap(coordinates) {
        let lettersCodes = []
        let numbers = []
        coordinates.forEach(elem => {
          const [letter, number] = elem.id.split(':')
          lettersCodes.push(letter.charCodeAt(0))
          numbers.push(number)
        })
        let sortedNumbers = numbers.sort(function (a, b) {
          return a - b
        })
        let sortedletters = lettersCodes.sort(function (a, b) {
          return a - b
        })

        function checkIsNext(arr) {
          for (let i = 0; i < arr.length - 1; i++) {
            let num = +arr[i]
            let x = i + 1
            let nextNum = arr[x]

            if (num !== +nextNum) {
              if (num + 1 !== +nextNum) {
                return false;
              }
            }
          }
          return true
        }
        const isOrderNum = checkIsNext(sortedNumbers)
        const isOrderletters = checkIsNext(sortedletters)
        if (isOrderNum && isOrderletters) {
          return true;
        } else {
          return false;
        }
      }


      if (isBlocked || !checkIsGap(active)) {
        if (!checkIsGap(active)) {
          isGap = true
        } 
        const area = document.querySelectorAll('.area')
        area.forEach(item => {
          if (item.classList.contains('active')) {
            item.classList.add('blocked-ship')
          }
          item.classList.add('blocked')
        })
      }
    }
    isBlocked = false
  }



  function setBoat() {
    if (boats[currentShipDrag]) {

      let keys = Object.keys(boats[currentShipDrag])
      let num = keys.length + 1
      boats[currentShipDrag][num] = currentCoordinates

    } else {
      boats[currentShipDrag] = { 1: currentCoordinates };
    }
  }
  //////////есть в контроллере///////////

  ////  ROTATE SHIP
  const table = document.querySelector('.battle-field')
  table.addEventListener('click', changeActiveShip)

  function changeActiveShip(event) {

    function setActiveShip() {

      if (event.target.classList.contains('ship-place')) {
        isActiveShip = true
        initHandlers()
        const rotateBtn = document.querySelector('.rotate-btn')
        rotateBtn.classList.remove('hidden')
        const activeShip = findCoordinates(event.target)
        const activeShipCoordinates = Object.values(activeShip)[0]
        shipCoordinates = activeShipCoordinates;
        activeShipCoordinates.forEach(id => {
          const cell = document.getElementById(id)
          cell.setAttribute('graggable','true')
          cell.classList.remove('ship-place')
          cell.classList.add('active')
        })
        
        setBlockedCells(activeShipCoordinates)
      }


    }

    function checkIsHorizontal(coordinates) {
      let casche = []
      let coordX = coordinates[0][0]
      coordinates.forEach(id => {
        const num = id.split(`${coordX}:`)[1]
        if (id === `${coordX}:${num}`) {
          casche.push(id)
        }
      });
      if (casche.length > 1) {
        return true;
      } else {
        return false;
      }
    }

    function clearPreviousPlace(coord) {
      coord.forEach(id => {
        const cell = document.getElementById(id)
        let area = getActiveArea(cell)
        area.forEach(row => {
          row.forEach(item => {
            const elem = document.getElementById(item)
            if (elem) {
              elem.classList.remove('active')
              elem.classList.remove('area')
              elem.classList.remove('blocked')
              elem.classList.remove('blocked-ship')

            }
          })
        })
      })
    }

    function rotate() {
      if (isGap) {
        return;
      }

      let isHorizontal = checkIsHorizontal(shipCoordinates);
      // debugger
      let newCoordinates = shipCoordinates.slice(0)
      if (!isHorizontal) {
        let number = +newCoordinates[0].split(':')[1] + 1
        for (let i = 0; i < newCoordinates.length; i++) {
          if (i > 0) {
            newCoordinates[i] = `${newCoordinates[0][0]}:${number}`
            number += 1
          }
        }
      } else {

        let letter = newCoordinates[0].split(':')[0]
        for (let i = 0; i < newCoordinates.length; i++) {
          if (i > 0) {
            letter = appHelper.nextLetterInAlphabet(letter)
            newCoordinates[i] = `${letter}:${newCoordinates[0][2]}`
          }
        }
      }
   
      clearPreviousPlace(shipCoordinates)
      setBlockedCells(newCoordinates)
      shipCoordinates = newCoordinates
    }

    function navigateShipFromKeyboard(event) {

      const allowKeys = [
        'ArrowDown',
        'ArrowUp',
        'ArrowRight',
        'ArrowLeft',
        'Escape',
        'Space',
        'Enter'];

      if (allowKeys.includes(event.code)) {

        let coordinates = Object.values(shipCoordinates)
        let newCoordinates = []
        let firstLetter = settingsModel.startLetter
        let cellsCount = settingsModel.cellsCount
        let lastLetter = String.fromCharCode(firstLetter.charCodeAt(0) + cellsCount)

        if (event.key === 'ArrowDown') {
          coordinates.forEach(id => {
            const [letter, num] = id.split(':')
            let nextLetter = appHelper.nextLetterInAlphabet(letter)

            if (nextLetter === lastLetter) {
              nextLetter = firstLetter
            }
            id = [nextLetter, num].join(':')
            newCoordinates.push(id)
          })
          clearAfterMove(newCoordinates)
        }
        if (event.key === 'ArrowUp') {
          coordinates.forEach(id => {
            const [letter, num] = id.split(':')
            let previousLetter = appHelper.previousLetterInAlphabet(letter)
            if (previousLetter === "Z" || previousLetter.charCodeAt(0) === 1039) {
              previousLetter = String.fromCharCode(firstLetter.charCodeAt(0) + (cellsCount - 1))
            }
            id = [previousLetter, num].join(':')
            newCoordinates.push(id)
          })
          clearAfterMove(newCoordinates)
        }

        if (event.key === 'ArrowLeft') {
          coordinates.forEach(id => {
            let [letter, num] = id.split(':')
            num = +num - 1
            if (num < 1) {
              num = cellsCount
            }
            id = [letter, num].join(':')
            newCoordinates.push(id)
          })
          clearAfterMove(newCoordinates)
        }

        if (event.key === 'ArrowRight') {

          coordinates.forEach(id => {
            let [letter, num] = id.split(':')
            num = +num + 1
            if (num > 10) {
              num = 1
            }
            id = [letter, num].join(':')
            newCoordinates.push(id)
          })
          clearAfterMove(newCoordinates)
        }


        if (event.code === 'Space') {

          rotate()
          // setActiveShip()
        }

        if (event.code === 'Enter') {

         
        }
        
        function clearAfterMove(newCoordinates) {
          clearPreviousPlace(coordinates)
          setBlockedCells(newCoordinates)
          shipCoordinates = newCoordinates
        }

      }

    }


    function initHandlers() {
      document.addEventListener('keydown', navigateShipFromKeyboard)
      const rotateBtn = document.querySelector('.rotate-btn')
      rotateBtn.addEventListener('click', rotate)
    }
    setActiveShip()
  }


  

  function findCoordinates(cell) {
    let arrs = Object.values(Object.values(boats))
    function findShip(arr) {
      return Object.values(arr)[0].find(item => item === cell.id)
    }

    for (let i = 0; i < arrs.length; i++) {
      if (findShip(arrs[i])) {
        return Object.values(arrs)[i]
      }
    }
    return false;
  }


  setShipCount()

}

export { arrangementView };