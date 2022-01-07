const appHelper = {
  nextLetterInAlphabet(letter) {
    if (letter == "z") {
      return "a";
    } else if (letter == "Z") {
      return "A";
    } else {
      return String.fromCharCode(letter.charCodeAt(0) + 1);
    }
  }
}


export { appHelper };