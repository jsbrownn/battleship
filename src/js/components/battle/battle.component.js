import { battleController } from "../../controllers/battle/battle.controller";
import { Component } from "../component";

const battle = new Component(
  'battle',
  `
  <div class="battle">
  <h2 class="battle__title player1">Player 1, ваш ход!</h2>
    <div class="battle__tables">
      <table class="battle-field">
      </table>
      <table class="battle-field">  
      </table>
    </div>
</div>

  `,
  battleController
)

export {battle}