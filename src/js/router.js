// import { arrangement } from "./components/arrangement/arrangement.component"
import { arrangement } from './components/arrangement/arrangement.component';
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
    // if (!path) {
    //   path = "/"
    // }
    // if (path != "/") {
    //   this.routes[path].unrender()
    // }
    // this.routes[path].isRender = false;
    // this.routes[pathname].isRender = true

    window.history.pushState(
      {},
      pathname,
      window.location.origin + pathname,
    );


    // const render = new Promise( function(resolve,reject){
    // const renderRoot = () =>{
    //   root.innerHTML = this.routes[pathname].render() 
    // }
    //   const f = renderRoot.bind(router)
    //   resolve( f )
    // })

    // render
    // .then (()=>{

    //   this.routes[pathname].controller.initView//init controller
    // })


    // root.innerHTML = this.routes[pathname].render() 
    // this.routes[pathname].controller.initView//init controller


    const render = () => {
      return new Promise((resolve, reject) => {
        resolve(
          root.innerHTML = this.routes[pathname].render()
        ),
          reject(new Error('нет рендера'))

      })
    }
    render()
      .then((result) => {
        this.routes[pathname].controller.initView()
      })
      .catch((error) => {
        console.error(error)
      })

  }
}

export { router };

