class Component {
  constructor(name, markup, controller, entryElem ) {
    this.name = name,
    this.markup = markup,
    this.controller = controller,
    this.entryElem = entryElem || document.getElementById('root')
  }

  render() {
    console.log('rendered')
    this.entryElem.style.opacity = '1'
    return this.entryElem.innerHTML = this.markup;
  }

  unrender() {
    this.entryElem.style.opacity = '0';
    return this.entryElem.innerHTML =''
  }



}

export { Component };