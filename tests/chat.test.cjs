const { test } = require('node:test');
const assert = require('node:assert/strict');
const { setup, source } = require('./helpers.cjs');

test('startup is immediately usable without WebGPU, a model, or network requests', () => {
  const { elements } = setup();
  assert.equal(elements.thread.children.length, 1);
  assert.equal(elements.sendBtn.disabled, true);
  assert.equal(elements.input.disabled, false);
  assert.doesNotMatch(source, /CreateMLCEngine|navigator\.gpu|import\(|fetch\(|completions|localStorage|sessionStorage/);
});
test('typing, sending, clearing and Enter controls work', () => {
  const { elements, run } = setup();
  elements.input.value = 'staff requirements';
  elements.input.listeners.input[0]();
  assert.equal(elements.sendBtn.disabled, false);
  let prevented = false;
  elements.input.listeners.keydown[0]({key:'Enter',preventDefault(){prevented=true;}});
  assert.equal(prevented, true);
  assert.equal(elements.input.value, '');
  assert.equal(elements.sendBtn.disabled, true);
  assert.equal(elements.thread.children.length, 3);
  assert.equal(run('state.program'), 'staff');
  elements.input.value = 'Do not send yet';
  for (const event of [{key:'Enter',shiftKey:true},{key:'Enter',isComposing:true}]) {
    elements.input.listeners.keydown[0]({...event,preventDefault(){assert.fail('Must preserve composition/newline');}});
  }
  assert.equal(elements.thread.children.length, 3);
});
test('ambiguous requirements preserve intent until a program is selected', () => {
  const { elements, answer, run } = setup();
  elements.input.value = 'Am I eligible?';
  run('send()');
  assert.equal(run('state.pendingIntent'), 'requirements');
  const facultyChip = elements.suggestions.children.find(c => c.textContent === 'Faculty');
  facultyChip.listeners.click[0]();
  assert.equal(run('state.program'), 'faculty');
  assert.equal(run('state.pendingIntent'), null);
  assert.match(answer('Am I eligible?', {program:'faculty'}).text, /end of Fall 2026/);
});
test('follow-ups use only selected program; reset clears it and drafts', () => {
  const { elements, run, answer } = setup();
  elements.input.value = 'What is the faculty fellowship?';run('send()');
  assert.match(answer('What are the benefits?', {program:'faculty'}).text, /\$5,000/);
  assert.doesNotMatch(answer('What are the benefits?', {program:'faculty'}).text, /\$250/);
  elements.input.value = 'draft';
  elements.newChatBtn.listeners.click[0]();
  assert.equal(run('state.program'), null);
  assert.equal(run('state.pendingIntent'), null);
  assert.equal(elements.input.value, '');
  assert.equal(elements.thread.children.length, 1);
  assert.equal(answer('Am I eligible?').text, run('CLARIFY'));
});
test('student staff selects student; mixed faculty/staff asks for clarification', () => {
  const { answer, run } = setup();
  assert.equal(answer('Student staff requirements').program, 'student');
  assert.equal(answer('Faculty and staff requirements', {program:'staff'}).text, run('CLARIFY'));
  assert.equal(answer('Student and professional staff requirements', {program:'faculty'}).text, run('CLARIFY'));
  assert.match(answer('I am an experienced staff member. Am I eligible?').text, /full-time career/);
});
test('each program keeps its own requirements, benefits and snapshot status', () => {
  const { answer } = setup();
  const staff = answer('staff eligibility').text;
  assert.match(staff, /full-time career/);assert.match(staff, /2026–2027/);assert.match(staff, /closed/);
  const student = answer('student benefits').text;
  assert.match(student, /\$600/);assert.match(student, /\$250/);assert.doesNotMatch(student, /\$5,000/);
  assert.match(answer('faculty applications').text, /does not confirm a new application window/);
  assert.match(answer('When is the DFP event?').text, /official Dialogue for Peace page/);
  assert.match(answer('How much does it cost?', {program:'staff'}).text, /contact Vanessa/);
});
test('unknown and overlong questions fail closed instead of reusing a prior answer', () => {
  const { answer, run } = setup();
  assert.equal(answer('Invent a secret rule', {program:'staff'}).text, run('REPLIES.fallback'));
  assert.equal(answer('staff requirements ' + 'x'.repeat(2100)).text, run('REPLIES.fallback'));
});
test('user HTML is text-only, assistant links are allowlisted', () => {
  const { elements, run } = setup();
  const payload='<img src=x onerror=alert(1)> staff eligibility';
  elements.input.value = payload;run('send()');
  const userBody=elements.thread.children[1].children[1];
  assert.equal(userBody.textContent,payload);
  assert.equal(userBody.innerHTML,undefined);
  assert.equal(run('formatMarkdown("[bad](https://example.com)")'),'bad');
  assert.doesNotMatch(run('formatMarkdown("<script>alert(1)</script>")'), /<script>/);
});

test('eligibility takes priority over incidental access needs; explicit accommodation questions remain supported', () => {
  const { answer } = setup();
  assert.equal(answer('I am a staff member with accessibility needs. Am I eligible?').text, answer('I am a staff member. Am I eligible?').text);
  assert.match(answer('What disability accommodations does the fellowship guarantee?').text, /does not specify accommodation arrangements/);
});
test('plain problem reports and open-now questions select the right fixed responses', () => {
  const { answer } = setup();
  assert.match(answer('How do I report a problem at a DFP event?').text, /does not investigate reports/);
  assert.match(answer('Is the student fellowship open now?').text, /window is \*\*closed\*\*/);
});

test('mistreatment and interpreter wording use contact responses instead of unrelated session facts', () => {
  const { answer, run } = setup();
  for (const prompt of [
    'Someone made an antisemitic remark during a DFP session. How can I get support?',
    "I've been discriminated against at a student session. Who should I tell?",
    'I heard an Islamophobic slur during a faculty session.',
    'A participant made a homophobic remark at the staff training.',
    'Someone made a transphobic remark during a student event.',
  ]) assert.equal(answer(prompt).text, run('REPLIES.concern'));
  assert.equal(answer('Do you promise sign-language interpreters at DFP events?').text, run('REPLIES.accommodations'));
  assert.equal(answer('Am I eligble for the faculty fellowship?').text, answer('Am I eligible for the faculty fellowship?').text);
});
