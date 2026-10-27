const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
class Element {
  constructor() { this.value = ''; this.disabled = false; this.style = {}; this.listeners = {}; this.children = []; this.classList = { add() {}, remove() {} }; }
  addEventListener(key, fn) { (this.listeners[key] ??= []).push(fn); }
  appendChild(element) { this.children.push(element); }
  append(...elements) { elements.forEach(element => this.appendChild(element)); }
  focus() {}
  set innerHTML(value) { this.children = []; this.html = value; }
  get innerHTML() { return this.html; }
}
function setup() {
  const elements = {};
  const context = vm.createContext({ document: {
    getElementById: id => elements[id] ??= new Element(),
    createElement: () => new Element(), querySelector: () => ({ src: 'avatar' }),
  }});
  const run = code => vm.runInContext(code, context);
  run(source);
  const answer = (text, state = {}) => run(`answerQuestion(${JSON.stringify(text)}, ${JSON.stringify(state)})`);
  return { elements, run, answer };
}
module.exports = { setup, source, html };
