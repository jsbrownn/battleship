
import { appHelper } from "../../helpers/helper";
import { gameModel } from "../../models/game/game.model";
import { arrangementView } from "../../views/arrangement/arrangement.view";

const boats = gameModel.boats

function arrangementController() {
  arrangementView()

  let allowDrop = true;
  
  let isVertical = false;

  function setShipPlace(id, current) {
    let r = /\d+/;
    console.log(r)
    const deckCount = +current.match(r)[0];
    const targetId = id;
    const boatsCordinates = []
    if (deckCount === 1) {
      boatsCordinates.push(targetId)
    } else {
      boatsCordinates.push(targetId)
      setShipCells(targetId)
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
        //ship.ondrop = shipdrop
      })

      table.ondragenter = tableDragEnter;
      table.ondrop = drop;
      table.ondragover = tableDragOver;
      table.ondragleave = tableDragLeave;
    }
    let isBlocked;

    // function checkArea(coordinates){
    //   if (coordinates) {
    //     coordinates.forEach(id => {
    //       const cell = document.getElementById(id)
    //       if (cell) {
    //         const area = getArea(cell)

    //         area.forEach(row => {
    //           row.forEach(id => {
    //             const cell = document.getElementById(id)
    //             if (cell) {
    //               if (cell.classList.contains('ship-place')) {
    //                 isBlocked = true;
    //               }
    //               cell.classList.add('area')
    //             }
    //           })
    //         })
    //         cell.classList.add('active')
    //       }

    //     })

    //     const active = document.querySelectorAll('.active')
    //     if (active.length !== currentCoordinates.length) {
    //       isBlocked = true;
    //     }

    //     if (isBlocked) {
    //       const area = document.querySelectorAll('.area')
    //       area.forEach(item => {
    //         if (item.classList.contains('active')) {
    //           item.classList.add('blocked-ship')
    //         }
    //         item.classList.add('blocked')
    //       })
    //     }
    //   }
    //   isBlocked = false
    // }

    function drag(event) {

      checkArea(currentCoordinates);
   
    }

    function dragStart(event) {
      console.log('dragstart')
      const dragBlockSelector = event.target.classList[1]
      // debugger
      currentShipDrag = dragBlockSelector
    }




    function tableDragEnter(event) {
      console.log('tableDragEnter')
      if (event.target.tagName === 'TD') {
        currentTd = event.target//запись в переменную текущей ячейки,для доступа в других обработчиках
        // debugger
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
          if(cell){
            const areaIds = getArea(cell)
            areaIds.forEach(row => {
              row.forEach(id => {
                let item = document.getElementById(id)
                if (item) {
                  item.classList.remove('area')
                  item.classList.remove('active')
                  item.classList.remove('blocked')
                  item.classList.remove('blocked-ship')
                }
              })
            })
          }
          
          
        })
      }
    }




    function tableDragOver(event) {
      event.preventDefault()
    }


    function drop(event) {
      const area = document.querySelectorAll('.area')
      const ship = document.querySelectorAll('.active')
      const blocked = document.querySelector('.blocked')

      function checkArea() {
        const areaArr = Array.from(area)
        let result = [];
        //логичнее было бы использовать filter,промучался несколько часов - так и не разобрался почему не заработало
        areaArr.forEach(elem => {
   
          if (elem.classList.contains('ship-place')) {
           
          }
        })
        if (result.length === 0 && ship.length === currentCoordinates.length) {
          return true;
        }
        else if (blocked) {
          return false;
        }
        else {
          return false;
        }
      }

      function clearArea() {
        area.forEach(cell => {
          cell.classList.remove('area')
          cell.classList.remove('blocked')
        })
        ship.forEach(cell => {
          cell.classList.remove('active')
          cell.classList.remove('blocked-ship')
        })
      }


      let isAllow = checkArea(area);
      if (!isAllow) {
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
        refreshShipCount()

        function setBoat() {
          debugger
          if (boats[currentShipDrag]) {

            let keys = Object.keys(boats[currentShipDrag])
            let num = keys.length + 1
            boats[currentShipDrag][num] = currentCoordinates

          } else {
            boats[currentShipDrag] = { 1: currentCoordinates };
          }
        }
        setBoat()



        function getShipCount(currentShip) {
          const ship = document.getElementsByClassName(currentShip)[0]
          const shipCountEl = ship.nextElementSibling
          const shipCount = +(shipCountEl.textContent.split('x')[1])
          return shipCount;
        }





        function checkShipCount(currentShipDrag) {
          let shipCount = getShipCount(currentShipDrag)
          if (shipCount < 1) {
            return false;
          } else {
            return true;
          }
        }



        function refreshShipCount() {

          if (checkShipCount(currentShipDrag)) {
            const shipDrag = document.getElementsByClassName(currentShipDrag)[0]
            const shipCountEl = shipDrag.nextElementSibling
            shipCountEl.textContent = `x${getShipCount(currentShipDrag) - 1}`
            if (shipCountEl.textContent === "x0") {
              //убираю возможность перетаскивания и скрываем строку
              shipDrag.setAttribute('draggable', 'false')
              shipDrag.parentNode.style.display = 'none'
            }
          } else {

            const ship = document.querySelector(`.${currentShipDrag}`)
            ship.removeAttribute('draggable')
          }

        }


      }
      currentCoordinates = ''
      currentShipDrag = ''
    }
  }


  shipArrangement()

  


    // здесь испавляю небольшой баг, который связан с тем, что 
    // если перетягивыемый корабль покидает зону сброса, на ячейках
    // не запускается механизм очистки области

    function clearAll() {
      debugger
      const area = document.querySelectorAll('area')
      const active = document.querySelectorAll('active')
      const blocked = document.querySelectorAll('blocked')
      const blockedShip = document.querySelectorAll('blocked-ship')

      area.forEach(el => {
        el.classList.remove('area')
      })
      active.forEach(el => {
        el.classList.remove('active')
      })
      blocked.forEach(el => {
        el.classList.remove('blocked')
      })
      blockedShip.forEach(el => {
        el.classList.remove('blocked-ship')
      })
    }


  }


  function getArea(cell) {
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
  







export { arrangementController }