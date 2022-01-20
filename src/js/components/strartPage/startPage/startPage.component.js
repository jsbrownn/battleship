import { startPageController } from "../../../controllers/startPage/startPage.controller";
import { Component } from "../../component";


const startPage  = new Component(
  'startpage',
  `
  <div class="start-page">
          <h1 class="start-page__title">Морской бой</h1>
          <div class="select-type">
            <div class="player">
                <button class="type-btn">против игрока</button>
            </div>
            <div class="computer">
              <button class="type-btn">против компьютера</button>
            </div>
          </div>
          <div class="select-language">
            <select name="language" id="language">
              <option value="be">belarusian</option>
              <option value="ru" selected>russian</option>
              <option value="be">english</option>
            </select>
            

          </div>
        </div>
  `,
  startPageController
)

export { startPage }