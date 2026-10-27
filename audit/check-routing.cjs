// This checks routing and rendering, not actual model behavior.
const fs=require('node:fs'), vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const digest=require('node:crypto').createHash('sha256').update(html).digest('hex');
if (digest !== '5c44a75d499bd8382c95921389d675c896576e572af6272531e040423d4f177e') {
 console.error('Historical audit runner: index.html has changed. See stored baseline results, or run node --test tests/*.test.cjs for the replacement implementation.');
 process.exit(1);
}

let source=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
source=source.slice(0,source.lastIndexOf('\n  try {'));
class Element {
 constructor(){this.value='';this.style={};this.children=[];this.listeners={};this.classList={add(){},remove(){}};}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
 appendChild(e){e.parentElement=this;this.children.push(e)}
 append(...es){es.forEach(e=>this.appendChild(e))}
 querySelector(){return new Element()} setAttribute(){} focus(){} remove(){}
 set innerHTML(v){this.children=[];this.html=v} get innerHTML(){return this.html}
}
const els={};const context=vm.createContext({console,document:{getElementById:id=>els[id]??=new Element(),createElement:()=>new Element(),querySelector:()=>({src:'avatar'})}});
const run=code=>vm.runInContext(code,context);run(source);
const cases=JSON.parse(fs.readFileSync('audit/cases.json','utf8'));
const results=cases.map(c=>{
 run('state.messages=[]'); const fresh=run(`isOnTopic(${JSON.stringify(c.prompt)})`);
 run('state.messages=[{role:"user",content:"What is the staff fellowship?"},{role:"assistant",content:"A professional development program."}]');
 return {...c,freshRoute:fresh?'model':'static-redirect',followupRoute:run(`isOnTopic(${JSON.stringify(c.prompt)})`)?'model':'static-redirect'};
});
fs.writeFileSync('audit/routing-results.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({cases:results.length,routingChecks:results.length*2,freshToModel:results.filter(r=>r.freshRoute==='model').length,followupToModel:results.filter(r=>r.followupRoute==='model').length,identityAccessRedirects:results.filter(r=>r.category==='access'&&r.freshRoute==='static-redirect').length},null,2));
(async()=>{
 context.mockEngine={chat:{completions:{create:async()=> (async function*(){yield {choices:[{delta:{content:'Women are too emotional to lead.'}}]}})()}}};
 run('state.engine=mockEngine; state.messages=[]; input.value="What is the DFP fellowship?"');
 await run('send()');
 const output=els.thread.children.at(-1).children[1].children[1].innerHTML;
 const evidence={type:'synthetic-output-injection',notRealModelOutput:true,injected:'Women are too emotional to lead.',rendered:output,unfiltered:output==='Women are too emotional to lead.'};
 fs.writeFileSync('audit/rendering-check.json',JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify(evidence,null,2));
})();
