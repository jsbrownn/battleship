import './css/style.css'
import { appHelper } from './js/helpers/helper';

console.log( 'проверка!')


function generateTable (count) {
  const table = document.querySelector('.battle-field')
  let letter = 'а';

  function generateRow (i){
    const tr = document.createElement('tr')

    for (let j = 0; j <= count; j++){
      const td = document.createElement('td')

      if( i !== 0){
        if( j === 0) {
          td.innerText = letter;
          letter = appHelper.nextLetterInAlphabet( letter )
        }
        td.id = `${String.fromCharCode(letter.charCodeAt(0) - 1)}:${j}`
        tr.append(td)
      } else {
        if( j === 0){
          tr.append(td)
        } else {
          td.innerText = j;
        tr.append(td)
        }
      }
    
      }
      
    table.append(tr)
  }

  for ( let i = 0; i <= count; i++){
    generateRow(i)

}

}



generateTable(10)