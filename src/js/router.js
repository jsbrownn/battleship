import { arrangement } from "./components/arrangement/arrangement.component"
import { battle } from "./components/battle/battle.component"
import { startPage } from "./components/strartPage/startPage/startPage.component"


const router = {
  routes: {
    '/': startPage,
    '/arrangment': arrangement,
    '/battle': battle
  },

  onNavigate(pathname) {
    const currentUrl = window.location.href
    let path = currentUrl.split('/')[currentUrl.length]
    if (!path) {
      path = "/"
    }
    if (path != "/") {
      this.routes[path].unrender()
    }
    this.routes[path].isRender = false;

    this.routes[pathname].isRender = true

    window.history.pushState(

      {},
      pathname,
      window.location.origin + pathname,
    );

      root.innerHTML = this.routes[pathname].render();
      this.routes[pathname].controller() //init controller
    

  }

}
export { router };

