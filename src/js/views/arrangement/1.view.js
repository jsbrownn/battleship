
class arrangementView{
  constructor(controller){
    this.controller = controller,
    this.countCells = undefined,
    this.shipCount = undefined,
    this.isBlocked = false,
    this.activeShip = false,
    this.shipCoordinates = undefined
  }

  setImageSrc(){
    const images = document.querySelectorAll('.ship-image')
    images.forEach(image => {
      let num = image.parentNode.classList[1].split('ship--')[1].split('deck')[0]
      image.src = `${path + num}.png`
    })
  }

  generateTable() {
    const table = document.querySelector('.battle-field')
    const count = this.count
    const letter = this.letter
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
  
  setShipCount() {
    const shipList = document.querySelectorAll('.ship')
    shipList.forEach(elem => {
      const num = elem.classList[1].split('ship--')[1].split('deck')[0]
      const shipCount = shipCount[`deck${num}`]
      const shipCountElement = elem.nextElementSibling
      shipCountElement.textContent = `x${shipCount}`
    })
  }

  //получить все ближайшие ячейки 
  getArea(cell) {
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