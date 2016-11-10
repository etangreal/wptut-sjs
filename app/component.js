
// var styles = require('./main.css');

module.exports = function () {
  var element = document.createElement('h1');

  element.className = 'pure-button';
  element.innerHTML = 'Hello world :D';

  // element.className = styles.redButton;

  return element;
};