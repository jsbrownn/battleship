
import './css/layout.css'
import './css/startpage/startpage.css'
import './css/battle/battle.css'
import { router } from "./js/router.js";

console.log('index.js')

  router.onNavigate('/arrangment')


window.onpopstate = () => {
  root.innerHTML = router.routes[window.location.pathname].markup;
};

