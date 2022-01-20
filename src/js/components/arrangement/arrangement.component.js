import { arrangementController } from "../../controllers/arrangement/arrangement.controller";
import { Component } from "../component";
import '/src/assets/images/ships/4.png'


const arrangement = new Component(
  'arrangement',
  `
  <div class="ship-placement">
  <div class="field">
    <h1 class="game-title">Расстaновка кораблей</h1>
    <table class="battle-field"></table>
  </div>
  <div class="ships-choose">
    <h2 class="ships-title">Корабли:</h2>
    <ul class="ships-list">
      <li class="ships__item">
        <div class="ship ship--4deck">
          <img src='' alt="ship" class="ship-image" />
        </div>
        <div class="ship-count">x0</div>
      </li>
      <li class="ships__item">
        <div class="ship ship--3deck">
          <img src="" alt="ship" class="ship-image" />
        </div>
        <div class="ship-count">x0</div>
      </li>
      <li class="ships__item">
        <div class="ship ship--2deck">
          <img src="" alt="ship" class="ship-image" />
        </div>
        <div class="ship-count">x0</div>
      </li>
      <li class="ships__item">
        <div class="ship ship--1deck">
          <img src="" alt="ship" class="ship-image" />
        </div>
        <div class="ship-count">x0</div>
      </li>
    </ul>
    <button class="rotate-btn hidden">повернуть</button>
  </div>
</div>

  `,
arrangementController


)

export { arrangement }