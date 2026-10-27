const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
let source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
source = source.slice(0, source.lastIndexOf('\n  try {'));
class Element {
  constructor() { this.value = ''; this.disabled = true; this.style = {}; this.listeners = {}; this.children = []; this.classList = { add() {}, remove() {} }; }
  addEventListener(k, f) { (this.listeners[k] ??= []).push(f); }
  appendChild(e) { e.parentElement = this; this.children.push(e); }
  append(...es) { es.forEach(e => this.appendChild(e)); }
  querySelector() { return new Element(); }
  focus() {} remove() {} setAttribute() {}
  set innerHTML(value) { this.children = []; this.html = value; }
  get innerHTML() { return this.html; }
}
function setup() {
  const elements = {};
  const context = vm.createContext({ console, document: {
    getElementById: id => elements[id] ??= new Element(),
    createElement: () => new Element(), querySelector: () => ({ src: 'avatar' }),
  }});
  vm.runInContext(source, context);
  const run = code => vm.runInContext(code, context);
  run('state.engine = {}; refreshSend()');
  return { elements, context, run };
}
test('typing and clearing refresh Send; rejected questions leave it disabled', async () => {
  const { elements, run } = setup();
  elements.input.value = 'faculty fellowship';
  elements.input.listeners.input[0]();
  assert.equal(elements.sendBtn.disabled, false);
  elements.input.value = '';
  elements.input.listeners.input[0]();
  assert.equal(elements.sendBtn.disabled, true);
  elements.input.value = 'Write a poem';
  elements.input.listeners.input[0]();
  await run('send()');
  assert.equal(elements.sendBtn.disabled, true);
});
test('follow-ups require prior context; broad unrelated questions are rejected', () => {
  const { run } = setup();
  assert.equal(run('isOnTopic("Am I eligible?")'), false);
  assert.equal(run('isOnTopic("What is the faculty fellowship?")'), true);
  run('state.messages.push({role:"user",content:"faculty fellowship"})');
  for (const question of ['Am I eligible?', 'How much does it pay?', 'Where is it?']) {
    assert.equal(run(`isOnTopic(${JSON.stringify(question)})`), true);
  }
  assert.equal(run('isOnTopic("Write a poem about office staff")'), false);
});
for (const fail of [false, true]) {
  test(`reset isolates a late ${fail ? 'error' : 'chunk'} and holds engine until settled`, async () => {
    const { elements, context, run } = setup();
    let release;
    const gate = new Promise(r => { release = r; });
    let calls = 0, interrupts = 0;
    context.engine = {
      interruptGenerate() { interrupts++; },
      chat: { completions: { async create() {
        calls++;
        return (async function* () {
          await gate;
          if (fail) throw new Error('Old failure');
          yield { choices: [{ delta: { content: 'Old response' } }] };
        })();
      } } },
    };
    run('state.engine = engine; input.value = "faculty fellowship"');
    const pending = run('send()');
    elements.newChatBtn.listeners.click[0]();
    assert.equal(interrupts, 1);
    assert.equal(run('isOnTopic("Am I eligible?")'), false);
    elements.input.value = 'student fellowship';
    await run('send()');
    assert.equal(calls, 1);
    release();
    await pending;
    assert.equal(run('state.messages.length'), 0);
    assert.equal(run('state.busy'), false);
    assert.equal(elements.sendBtn.disabled, false);
    assert.equal(elements.thread.children.length, 1);
  });
}
test('successful generation restores controls and sends date-aware context', async () => {
  const { elements, context, run } = setup();
  let request;
  context.engine = { chat: { completions: { async create(params) {
    request = params;
    return (async function* () { yield { choices: [{ delta: { content: 'Answer' } }] }; })();
  } } } };
  run('state.engine=engine; input.value="faculty fellowship"');
  await run('send()');
  assert.match(request.messages[0].content, /Current date in America\/Los_Angeles:/);
  assert.equal(run('state.messages[1].content'), 'Answer');
  assert.equal(run('state.busy || state.generating'), false);
  assert.equal(elements.sendBtn.disabled, true);
});
