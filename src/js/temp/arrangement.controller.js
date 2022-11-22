import { settings } from "../models/settings/settings.model"
import { arrangementView }  from "./arrangement.view"




const arrangementController = {
  
    cellsCount :settings.cellsCount,
    startLetter : settings.startLetter,
    defaultShipCount : settings.defaultShipCount,
    initView: arrangementView,

  getCoordinates(cell) {
    


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
  },

  getShipName(cell){

  }
 ,
  setShip(type,coordinates){
      debugger
      if (boats[type]) {
        let keys = Object.keys(boats[type])
        let num = keys.length + 1
        boats[type][num] = coordinates

      } else {
        boats[type] = { 1: coordinates };
      }
    }
  }



export {arrangementController};