import { appHelper } from "../helpers/helper";
import { settings } from "../models/settings/settings.model";
import "./../../css/arrangement/arrangement.css";

const arrangementView = () => {
  console.info("view");

  let path = "./src/assets/images/ships/";
  let currentShipDrag;
  let defaultShipCount = settings.defaultShipCount;
  let currentTd;
  let currentCoordinates;
  let isVertical = false; //положение коробля на поле
  let isAllowDrop = true; // флаг на сбросить корабль
  let isBlocked = false; //флаг на поле вокруг корабля, можно ли устанавливать
  let isGap = false; //является ли корабль разорванным
  let letter = settings.startLetter;
  let count = settings.cellsCount;

  const dragAndDropHandlers = {
    dragStart(event) {
      const dragBlockSelector = event.target.classList[1];
      currentShipDrag = dragBlockSelector;
      console.log(currentShipDrag);
    },

    drag(event) {
      checkArea(currentCoordinates);
    },

    tableDragEnter(event) {
      console.log("tableDragEnter");
      if (event.target.tagName === "TD") {
        currentTd = event.target; //запись в переменную текущей ячейки,для доступа в других обработчиках
        // debugger
        currentCoordinates = setShipPlace(currentTd.id, currentShipDrag);
      } else {
        currentTd = "";
      }
    },

    tableDragLeave(event) {
      const leaveCoordinates = setShipPlace(event.target.id, currentShipDrag);
      if (leaveCoordinates) {
        leaveCoordinates.forEach((id) => {
          const cell = document.getElementById(id);
          if (cell) {
            const areaIds = getArea(cell);
            areaIds.forEach((row) => {
              row.forEach((id) => {
                let item = document.getElementById(id);
                if (item) {
                  item.classList.remove("area");
                  item.classList.remove("active");
                  item.classList.remove("blocked");
                  item.classList.remove("blocked-ship");
                }
              });
            });
          }
        });
      }
    },

    tableDragOver(event) {
      event.preventDefault();
    },

    dropOnBoard(event) {
      const area = document.querySelectorAll(".area");
      const ship = document.querySelectorAll(".active");
      const blocked = document.querySelector(".blocked");

      function checkArea() {
        const areaArr = Array.from(area);
        let result = [];
        //логичнее было бы использовать filter,промучался несколько часов - так и не разобрался почему не заработало
        areaArr.forEach((elem) => {
          if (elem.classList.contains("ship-place")) {
          }
        });
        if (result.length === 0 && ship.length === currentCoordinates.length) {
          return true;
        } else if (blocked) {
          return false;
        } else {
          return false;
        }
      }

      function clearArea(area) {
        area.forEach((cell) => {
          cell.classList.remove("area");
          cell.classList.remove("blocked");
        });
        ship.forEach((cell) => {
          cell.classList.remove("active");
          cell.classList.remove("blocked-ship");
        });
      }

      let isAllow = checkArea(area);
      if (!isAllow) {
        clearArea();
        currentCoordinates = "";
        currentShipDrag = "";
        return false;
      } else {
        area.forEach((cell) => {
          cell.classList.remove("area");
        });
        ship.forEach((cell) => {
          cell.classList.replace("active", "ship-place");
        });
        refreshShipCount(currentShipDrag);
        setBoat();
        currentCoordinates = "";
        currentShipDrag = "";
      }
    },
  };

  const setImageSrc = (images, path) => {
    images.forEach((image) => {
      let num = image.parentNode.classList[1].split("ship--")[1].split("deck")[0];
      image.src = `${path + num}.png`;
    });
  };

  const generateTable = (count, letter) => {
    const table = document.querySelector(".battle-field");
    function generateRow(i) {
      const tr = document.createElement("tr");
      for (let j = 0; j <= count; j++) {
        const td = document.createElement("td");
        if (i !== 0) {
          if (j === 0) {
            td.innerText = letter;
            letter = appHelper.nextLetterInAlphabet(letter);
          }
          td.id = `${appHelper.previousLetterInAlphabet(letter)}:${j}`;
          td.classList.add("droppable");
          tr.append(td);
        } else {
          if (j === 0) {
            tr.append(td);
          } else {
            td.innerText = j;
            tr.append(td);
          }
        }
      }
      table.append(tr);
    }

    for (let i = 0; i <= count; i++) {
      generateRow(i);
    }

    //убираем лишниий класс и ид, было лень цикл переписывать
    const rows = document.querySelectorAll("tr");
    rows.forEach((row) => {
      let firstTd = row.children[0];
      firstTd.id = "";
      firstTd.classList.remove("droppable");
    });
  };

  const setShipCount = () => {
    const shipList = document.querySelectorAll(".ship");
    shipList.forEach((elem) => {
      const num = elem.classList[1].split("ship--")[1].split("deck")[0];
      const shipCount = defaultShipCount[`deck${num}`];
      const shipCountElement = elem.nextElementSibling;
      shipCountElement.textContent = `x${shipCount}`;
    });
  };

  const setShipPlace = (id, current) => {
    //определяет перетягиваемый корабль из ангара
    //и подставляет координаты по указателю мыши
    let r = /\d+/;
    const deckCount = +current.match(r)[0];
    const targetId = id;
    const boatsCordinates = [];
    if (deckCount === 1) {
      boatsCordinates.push(targetId);
    } else {
      boatsCordinates.push(targetId);
      setShipCells(targetId);
    }

    function setShipCells(id) {
      if (boatsCordinates.length === deckCount) {
        return boatsCordinates;
      } else {
        let cordX = id.split(":")[0];
        let cordY = +id.split(":")[1];

        if (!isVertical) {
          cordY += 1;
        } else {
          cordX = appHelper.nextLetterInAlphabet(cordX);
        }
        const cellId = cordX + ":" + cordY;
        boatsCordinates.push(cellId);

        return setShipCells(cellId);
      }
    }

    return boatsCordinates;
  };

  const getArea = (cell) => {
    const area = [];
    const [coordX, coordY] = cell.id.split(":");
    const firstColumnId = appHelper.previousLetterInAlphabet(coordX) + ":" + coordY;
    const lastColumnId = appHelper.nextLetterInAlphabet(coordX) + ":" + coordY;

    const colummIds = [firstColumnId, cell.id, lastColumnId];

    function getSublings(id) {
      const [coordX, coordY] = id.split(":");
      const previousSublingId = coordX + ":" + (+coordY - 1);
      const nextSublingId = coordX + ":" + (+coordY + 1);
      const row = [previousSublingId, id, nextSublingId];
      return row;
    }

    colummIds.forEach((id) => {
      const row = getSublings(id);
      area.push(row);
    });
    return area;
  };

  const checkArea = (coordinates) => {
    if (coordinates) {
      coordinates.forEach((id) => {
        const cell = document.getElementById(id);
        if (cell) {
          const area = getArea(cell);
          area.forEach((row) => {
            row.forEach((id) => {
              const cell = document.getElementById(id);
              if (cell) {
                if (cell.classList.contains("ship-place")) {
                  isBlocked = true;
                } else {
                  cell.classList.add("area");
                }
              }
            });
          });
          cell.classList.add("active");
        }

        isBlocked = false;
        isGap = false;
      });

      const active = document.querySelectorAll(".active");
      if (active.length !== coordinates.length) {
        isBlocked = true;
      }

      function checkIsGap(coordinates) {
        // проверка на разрывы корабля:
        // сверяю отсортированные коды координат корабля,
        // если идут не в соответствии с правилом +1 - корабль
        // разорван, устанавливать такой нельзя

        let lettersCodes = [];
        let numbers = [];
        coordinates.forEach((elem) => {
          const [letter, number] = elem.id.split(":");
          lettersCodes.push(letter.charCodeAt(0));
          numbers.push(number);
        });
        let sortedNumbers = numbers.sort(function (a, b) {
          return a - b;
        });
        let sortedletters = lettersCodes.sort(function (a, b) {
          return a - b;
        });

        function checkIsNext(arr) {
          for (let i = 0; i < arr.length - 1; i++) {
            let num = +arr[i];
            let x = i + 1;
            let nextNum = arr[x];

            if (num !== +nextNum) {
              if (num + 1 !== +nextNum) {
                return false;
              }
            }
          }
          return true;
        }
        const isOrderNum = checkIsNext(sortedNumbers);
        const isOrderletters = checkIsNext(sortedletters);
        if (isOrderNum && isOrderletters) {
          return true;
        } else {
          return false;
        }
      }

      if (isBlocked || !checkIsGap(active)) {
        if (!checkIsGap(active)) {
          isGap = true;
        }
        const area = document.querySelectorAll(".area");
        area.forEach((item) => {
          if (item.classList.contains("active")) {
            item.classList.add("blocked-ship");
          }
          item.classList.add("blocked");
        });
      }
    }
    isBlocked = false;
  };

  const checkIsHorizontal = (coordinates) => {
    let casche = [];
    let coordX = coordinates[0][0];
    coordinates.forEach((id) => {
      const num = id.split(`${coordX}:`)[1];
      if (id === `${coordX}:${num}`) {
        casche.push(id);
      }
    });
    if (casche.length > 1) {
      return true;
    } else {
      return false;
    }
  };

  const clearPreviousPlace = (coord) => {
    coord.forEach((id) => {
      const cell = document.getElementById(id);
      let area = getArea(cell);
      area.forEach((row) => {
        row.forEach((item) => {
          const elem = document.getElementById(item);
          if (elem) {
            elem.classList.remove("active");
            elem.classList.remove("area");
            elem.classList.remove("blocked");
            elem.classList.remove("blocked-ship");
          }
        });
      });
    });
  };

  const setActiveShip = (event) => {
    if (event.target.classList.contains("ship-place")) {
      isActive = true;
      const rotateBtn = document.querySelector(".rotate-btn");
      rotateBtn.classList.remove("hidden");
      const activeShip = findCoordinates(event.target);
      const activeShipCoordinates = Object.values(activeShip)[0];
      shipCoordinates = activeShipCoordinates;
      activeShipCoordinates.forEach((id) => {
        const cell = document.getElementById(id);
        cell.setAttribute("graggable", "true");
        cell.classList.remove("ship-place");
        cell.classList.add("active");
      });

      checkArea(activeShipCoordinates);
    }
  };

  const getShipCount = (currentShipDrag) => {
    const ship = document.getElementsByClassName(currentShipDrag)[0];
    const shipCountEl = ship.nextElementSibling;
    const shipCount = +shipCountEl.textContent.split("x")[1];
    return shipCount;
  };

  const checkShipCounter = (currentShipDrag) => {
    debugger;
    let shipCount = getShipCount(currentShipDrag);
    if (shipCount < 1) {
      return false;
    } else {
      return true;
    }
  };

  const refreshShipCount = (currentShipDrag) => {
    if (checkShipCounter(currentShipDrag)) {
      const shipDrag = document.getElementsByClassName(currentShipDrag)[0];
      const shipCountEl = shipDrag.nextElementSibling;
      shipCountEl.textContent = `x${getShipCount(currentShipDrag) - 1}`;
      if (shipCountEl.textContent === "x0") {
        //убираю возможность перетаскивания и скрываем строку
        shipDrag.setAttribute("draggable", "false");
        shipDrag.parentNode.style.display = "none";
      }
    } else {
      const ship = document.querySelector(`.${currentShipDrag}`);
      ship.removeAttribute("draggable");
    }
  };

  const rotateShip = () => {
    if (isGap) {
      return;
    }
    let isHorizontal = checkIsHorizontal(shipCoordinates);
    let newCoordinates = shipCoordinates.slice(0);
    if (!isHorizontal) {
      let number = +newCoordinates[0].split(":")[1] + 1;
      for (let i = 0; i < newCoordinates.length; i++) {
        if (i > 0) {
          newCoordinates[i] = `${newCoordinates[0][0]}:${number}`;
          number += 1;
        }
      }
    } else {
      let letter = newCoordinates[0].split(":")[0];
      for (let i = 0; i < newCoordinates.length; i++) {
        if (i > 0) {
          letter = appHelper.nextLetterInAlphabet(letter);
          newCoordinates[i] = `${letter}:${newCoordinates[0][2]}`;
        }
      }
    }

    clearPreviousPlace(shipCoordinates);
    checkArea(newCoordinates);
    shipCoordinates = newCoordinates;
  };

  const navigateShipFromKeyboard = (event) => {
    const allowKeys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Escape", "Space", "Enter"];

    if (allowKeys.includes(event.code)) {
      let coordinates = Object.values(shipCoordinates);
      let newCoordinates = [];
      let firstLetter = settingsModel.startLetter;
      let cellsCount = settingsModel.cellsCount;
      let lastLetter = String.fromCharCode(firstLetter.charCodeAt(0) + cellsCount);

      if (event.key === "ArrowDown") {
        coordinates.forEach((id) => {
          const [letter, num] = id.split(":");
          let nextLetter = appHelper.nextLetterInAlphabet(letter);

          if (nextLetter === lastLetter) {
            nextLetter = firstLetter;
          }
          id = [nextLetter, num].join(":");
          newCoordinates.push(id);
        });
        clearAfterMove(newCoordinates);
      }

      if (event.key === "ArrowUp") {
        coordinates.forEach((id) => {
          const [letter, num] = id.split(":");
          let previousLetter = appHelper.previousLetterInAlphabet(letter);
          if (previousLetter === "Z" || previousLetter.charCodeAt(0) === 1039) {
            previousLetter = String.fromCharCode(firstLetter.charCodeAt(0) + (cellsCount - 1));
          }
          id = [previousLetter, num].join(":");
          newCoordinates.push(id);
        });
        clearAfterMove(newCoordinates);
      }

      if (event.key === "ArrowLeft") {
        coordinates.forEach((id) => {
          let [letter, num] = id.split(":");
          num = +num - 1;
          if (num < 1) {
            num = cellsCount;
          }
          id = [letter, num].join(":");
          newCoordinates.push(id);
        });
        clearAfterMove(newCoordinates);
      }

      if (event.key === "ArrowRight") {
        coordinates.forEach((id) => {
          let [letter, num] = id.split(":");
          num = +num + 1;
          if (num > 10) {
            num = 1;
          }
          id = [letter, num].join(":");
          newCoordinates.push(id);
        });
        clearAfterMove(newCoordinates);
      }

      if (event.code === "Space") {
        rotateShip();
      }

      if (event.code === "Enter") {
        unActiveShip(shipCoordinates);
      }
    }
  };

  const clearCellsAfterMove = (newCoordinates) => {
    clearPreviousPlace(coordinates);
    checkArea(newCoordinates);
    shipCoordinates = newCoordinates;
  };

  const unActiveShip = (coordinates) => {
    if (!isBlocked) {
      debugger;
    }
  };

  const resetArrangement = () => {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.className = "";
      cell.classList.add("droppable");
    });
    boats = {}; //аннулирую все координаты кораблей

    const shipItems = document.querySelectorAll(".ships__item");
    shipItems.forEach((item) => {
      item.style.display = "";
      item.children[0].setAttribute("draggable", "true");
    });

    setShipCount(); //возвращаю количество кораблей для установки
    isActive = false;
    isBlocked = false;
    shipCoordinates = undefined;
  };

  const initHandlers = () => {
    //drag-and-drop
    if (isAllowDrop) {
      const ships = document.querySelectorAll(".ship");
      const table = document.querySelector(".battle-field");

      ships.forEach((ship) => {
        ship.setAttribute("draggable", true);
        ship.ondrag = dragAndDropHandlers.drag;
        ship.ondragstart = dragAndDropHandlers.dragStart;

        // ship.ondragend = dragEnd;
        //ship.ondrop = shipdrop
      });

      table.ondragenter = dragAndDropHandlers.tableDragEnter;
      table.ondrop = dragAndDropHandlers.dropOnBoard;
      table.ondragover = dragAndDropHandlers.tableDragOver;
      table.ondragleave = dragAndDropHandlers.tableDragLeave;
    }

    //active
    const ship = document.q

    //clear
    const clearBtn = document.querySelector(".clear-btn");
    clearBtn.addEventListener("click", resetArrangement);

    //rotate
    const rotateBtn = document.querySelector(".rotate-btn");
    rotateBtn.addEventListener("click", rotateShip);

    document.addEventListener("keydown", navigateShipFromKeyboard);
  };
  const init = () => {
    //setImageSrc(images, path);
    generateTable(count, letter);
    setShipCount();
    initHandlers();
  };

  init();
};

export { arrangementView };
