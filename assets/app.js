"use strict";
/* C++ Daily UI: progress state, lesson rendering, quick checks and a problem runner that compiles
   and tests code on Compiler Explorer (godbolt.org). Progress lives in localStorage. */

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const todayKey=()=>new Date().toLocaleDateString("en-CA");
const norm=s=>String(s).trim().split(/\s+/).join(" ");
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const reduced=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const TOTAL=DAYS.length;
const dayOf=n=>DAYS.find(d=>d.n===n);
const UNITS=[...new Set(DAYS.map(d=>d.unit))];
const fmtDate=k=>new Date(k+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"});

const inline=t=>esc(t).replace(/`([^`]+)`/g,"<code>$1</code>");
const prose=t=>String(t).split(/\n\n/).map(p=>`<p>${inline(p).replace(/\n/g,"<br>")}</p>`).join("");

/* ---------- C++ syntax highlighting ---------- */
const KW=new Set("auto bool break case char class const continue default delete do double else false float for if int long namespace new nullptr private protected public return short signed sizeof static static_cast struct switch template this true typename unsigned using void while".split(" "));
const TOKRE=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*")|('(?:\\.|[^'\\\n])*')|(^[ \t]*#[^\n]*)|(\b\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?:LL|ll|u|f)?\b)|(\bstd::[A-Za-z_]\w*|\bsize_t\b)|([A-Za-z_]\w*)/gm;
function hl(code){
  let out="",last=0;
  code.replace(TOKRE,(m,com,str,chr,pp,num,std,id,off)=>{
    out+=esc(code.slice(last,off));last=off+m.length;
    const cls=com?"com":(str||chr)?"str":pp?"pp":num?"num":std?"ty":(id&&KW.has(id))?"kw":"";
    out+=cls?`<span class="tk-${cls}">${esc(m)}</span>`:esc(m);return m});
  return out+esc(code.slice(last));
}

/* ---------- running code on Compiler Explorer ---------- */
const CE="https://godbolt.org",COMPILER="g132",FLAGS="-std=c++20 -Wall";
const HEADERS=["iostream","string","vector","algorithm","numeric","map","set","unordered_map","array","memory","cctype","cmath","utility"];
const isFragment=code=>!/\bmain\s*\(/.test(code);
const wrapSource=code=>isFragment(code)?HEADERS.map(h=>`#include <${h}>`).join("\n")+"\n\nint main() {\n"+code.split("\n").map(l=>l?"    "+l:l).join("\n")+"\n    return 0;\n}\n":code;
const stripAnsi=s=>String(s||"").replace(/\x1b\[[0-9;]*[A-Za-z]/g,"");
function ceLink(source,stdin){
  const state={sessions:[{id:1,language:"c++",source,compilers:[],executors:[{arguments:"",argumentsVisible:false,stdin:stdin||"",stdinVisible:true,
    compiler:{id:COMPILER,libs:[],options:FLAGS},compilerOutputVisible:true,compilerVisible:false,wrap:false}]}]};
  const bytes=new TextEncoder().encode(JSON.stringify(state));let bin="";
  for(let i=0;i<bytes.length;i+=8192)bin+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return`${CE}/clientstate/${btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}`;
}
async function compileRun(source,stdin){
  const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),45000);
  try{
    const r=await fetch(`${CE}/api/compiler/${COMPILER}/compile`,{method:"POST",signal:ctl.signal,
      headers:{"Content-Type":"application/json",Accept:"application/json"},
      body:JSON.stringify({source,lang:"c++",allowStoreCodeDebug:true,options:{userArguments:FLAGS,
        executeParameters:{args:[],stdin:stdin||""},compilerOptions:{executorRequest:true,skipAsm:true},filters:{execute:true},tools:[],libraries:[]}})});
    if(!r.ok)return{net:true,msg:r.status===429?"Compiler Explorer says too many requests. Wait a minute and try again.":`Compiler Explorer replied with an error (${r.status}).`};
    const j=await r.json();const br=j.buildResult||{};const lines=a=>(a||[]).map(x=>x.text).join("\n");
    const buildMsg=stripAnsi(lines(br.stderr)||lines(br.stdout));
    const built=br.code===0||(br.code===undefined&&j.didExecute);
    if(!built)return{built:false,buildMsg:buildMsg||stripAnsi(lines(j.stderr))||"The code didn't compile."};
    return{built:true,ran:!!j.didExecute,buildMsg,stdout:lines(j.stdout),stderr:stripAnsi(lines(j.stderr)),code:j.code,timedOut:!!j.timedOut};
  }catch(e){
    return{net:true,msg:e&&e.name==="AbortError"?"Compiler Explorer took too long to answer.":"Couldn't reach Compiler Explorer. You may be offline, or this network blocks it."};
  }finally{clearTimeout(timer)}
}

/* ---------- state ---------- */
const KEY="cppd_state";
const blank=()=>({v:1,days:{},review:[],act:{},warm:null,started:todayKey()});
let S=blank();
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&x.v===1)S={...blank(),...x}}catch(e){}}
let saveT=null;
function save(){clearTimeout(saveT);saveT=setTimeout(saveNow,250)}
function saveNow(){clearTimeout(saveT);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function ds(n){return S.days[n]||(S.days[n]={checks:{},probs:{},code:{},read:false,done:null})}
function act(){return S.act[todayKey()]||(S.act[todayKey()]={c:0,k:0,s:0,r:0,goal:false})}
const prob=(n,i)=>{const st=ds(n);return st.probs[i]||(st.probs[i]={passed:false,sol:false,hints:0,self:false})};
const currentDayN=()=>{const d=DAYS.find(d=>!S.days[d.n]?.done);return d?d.n:null};
const finishedToday=()=>Object.values(S.days).some(d=>d.done===todayKey());
const solvedCount=()=>Object.values(S.days).reduce((a,d)=>a+Object.values(d.probs||{}).filter(p=>p.passed).length,0);
function streak(){
  let s=0;const d=new Date();if(!S.act[todayKey()]?.goal)d.setDate(d.getDate()-1);
  while(S.act[d.toLocaleDateString("en-CA")]?.goal){s++;d.setDate(d.getDate()-1)}
  return s;
}
function recordCheck(it,ok,mode){
  const a=act();a.c++;if(ok)a.k++;
  if(mode==="day"){ds(it.d).checks[it.i]={ok}}
  else a.r++;
  const q=S.review.find(r=>r.d===it.d&&r.i===it.i);
  if(q){if(mode!=="day"){if(ok){q.fixes++;if(q.fixes>=2)S.review=S.review.filter(r=>r!==q)}else q.fixes=0}}
  else if(!ok)S.review.push({d:it.d,i:it.i,fixes:0});
  save();renderStrip();
}
function reviewItems(k){
  const out=[];
  for(const r of [...S.review].sort((a,b)=>a.fixes-b.fixes)){if(out.length>=Math.ceil(k*.6))break;if(dayOf(r.d)?.checks[r.i])out.push({d:r.d,i:r.i})}
  const pool=[];
  for(const D of DAYS){const st=S.days[D.n];if(!st||!(st.done||Object.keys(st.checks).length))continue;
    D.checks.forEach((c,i)=>{if(!out.some(o=>o.d===D.n&&o.i===i))pool.push({d:D.n,i})})}
  shuffle(pool);while(out.length<k&&pool.length)out.push(pool.pop());
  return shuffle(out);
}

/* ---------- shared pieces ---------- */
function codeBlock(code,{input,out,try:tryIt}={}){
  return`<div class="codewrap"><pre class="code" tabindex="0">${hl(code)}</pre>${out!==undefined?`<div class="outblock"><span class="lbl">${input!==undefined?`Input: ${esc(input.replace(/\n/g," "))} · `:""}Output</span>${esc(out)||"<span class='muted'>(nothing)</span>"}</div>`:""}</div>
    ${tryIt?`<div class="row"><a class="linkbtn" href="${esc(ceLink(wrapSource(code),input))}" target="_blank" rel="noopener">Edit and run this in Compiler Explorer ↗</a></div>`:""}`;
}
function bump(sel,v){const el=$(sel);if(!el)return;if(el.textContent!==String(v)){el.textContent=v;if(!reduced()){el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump")}}}
function renderStrip(){bump("#sDay",currentDayN()||TOTAL);$("#sTotal").textContent=TOTAL;bump("#sStreak",streak());bump("#sSolved",solvedCount())}

/* ---------- quick checks ---------- */
function checkRunner(host,items,{title,mode,onDone}){
  let i=0,right=0;
  function draw(){
    if(i>=items.length){onDone&&onDone(right,items.length);return}
    const it=items[i],D=dayOf(it.d),c=D.checks[it.i];
    const q=c.q||(c.t==="out"?"What does this print? Type it exactly.":"");
    host.innerHTML=`<div class="check rise">
      <div class="meta"><span>${esc(title)} · ${i+1} / ${items.length}</span><span>${mode==="day"?(c.t==="mc"?"choose one":"predict the output"):`from Day ${D.n}: ${esc(D.title)}`}</span></div>
      <div class="progress"><i style="width:${i/items.length*100}%"></i></div>
      <div class="q">${inline(q)}</div>
      ${c.code?codeBlock(c.code)+(isFragment(c.code)?`<p class="muted small">These lines run inside <code>main()</code>, with the usual <code>#include</code>s above.</p>`:""):""}
      ${c.in!==undefined?`<p class="small">Input typed by the user: <code>${esc(c.in.replace(/\n/g," "))}</code></p>`:""}
      ${c.t==="mc"?`<div class="opts" role="group" aria-label="Options">${c.opts.map((o,k)=>`<button class="opt" data-k="${k}">${inline(o)}</button>`).join("")}</div>`
        :`<input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" placeholder="Type the output. Several lines? Separate them with spaces.">
          <div class="row"><button class="btn" id="sub">Submit</button><button class="btn ghost" id="idk">I don't know</button><span class="muted small">Enter to submit</span></div>`}
      <div id="fb"></div></div>`;
    const fb=host.querySelector("#fb");
    const finish=(ok,extra)=>{
      if(ok)right++;recordCheck(it,ok,mode);
      fb.innerHTML=`<div class="fb ${ok?"ok":"bad"} rise"><span class="verdict">${ok?"Correct":"Not quite"}</span>${extra||""}<div class="why prose">${prose(c.why)}</div></div>
        <div class="row" style="margin-top:12px"><button class="btn accent" id="next">${i+1<items.length?"Next":"Finish"}</button></div>`;
      const nb=fb.querySelector("#next");nb.focus({preventScroll:true});nb.onclick=()=>{i++;draw()};
    };
    if(c.t==="mc"){
      host.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
        if(b.getAttribute("aria-disabled")==="true")return;const k=Number(b.dataset.k);
        host.querySelectorAll(".opt").forEach(o=>{o.setAttribute("aria-disabled","true");if(Number(o.dataset.k)===c.a)o.classList.add("right")});
        if(k!==c.a)b.classList.add("wrong");finish(k===c.a);
      });
      if(i>0)host.querySelector(".opt").focus({preventScroll:true});
    }else{
      const inp=host.querySelector("#ans");if(i>0)inp.focus({preventScroll:true});
      const answer=skip=>{
        if(host.querySelector("#sub").disabled)return;
        if(!skip&&!inp.value.trim()){inp.focus();return}
        host.querySelectorAll("#ans,#sub,#idk").forEach(e=>e.disabled=true);
        const ok=!skip&&norm(inp.value)===norm(c.a);
        finish(ok,`<span class="small">The output is:</span><pre class="code" style="padding:8px 12px">${esc(c.a)}</pre>`);
      };
      inp.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();answer(false)}});
      host.querySelector("#sub").onclick=()=>answer(false);host.querySelector("#idk").onclick=()=>answer(true);
    }
  }
  draw();
}

/* ---------- code editor ---------- */
function insertText(ta,text){
  ta.focus();
  let done=false;try{done=document.execCommand("insertText",false,text)}catch(e){}
  if(!done){ta.setRangeText(text,ta.selectionStart,ta.selectionEnd,"end");ta.dispatchEvent(new Event("input"))}
}
function editorKeys(ta,onCheck){
  let escaped=false;
  ta.addEventListener("keydown",e=>{
    const plain=!e.ctrlKey&&!e.metaKey&&!e.altKey;
    if(e.key==="Escape"){escaped=true;return}
    if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();onCheck();return}
    if(e.key==="Tab"&&plain&&!e.shiftKey&&!escaped){e.preventDefault();insertText(ta,"    ");return}
    escaped=false;
    const v=ta.value,p=ta.selectionStart,ls=v.lastIndexOf("\n",p-1)+1,before=v.slice(ls,p);
    if(e.key==="Enter"&&plain&&!e.shiftKey){
      const ind=before.match(/^[ \t]*/)[0];e.preventDefault();insertText(ta,"\n"+ind+(before.trimEnd().endsWith("{")?"    ":""));
    }else if(e.key==="}"&&plain&&ta.selectionEnd===p&&/^ {4,}$/.test(before)){
      e.preventDefault();ta.setSelectionRange(p-4,p);insertText(ta,"}");
    }
  });
}

/* ---------- problems ---------- */
function problemCard(n,pi){
  const D=dayOf(n),P=D.problems[pi],st=ds(n),ps=prob(n,pi);
  const id=`p${n}-${pi}`;const code=st.code[pi]??P.starter;const ex=P.tests[0];
  const el=document.createElement("div");el.className="card prob";el.id=id;
  el.innerHTML=`<div class="row between"><h3>Problem ${pi+1} of ${D.problems.length}</h3><span class="pill" data-status></span></div>
    <h2>${esc(P.title)}</h2>
    <div class="task">${prose(P.task)}</div>
    <div><label class="lbl" for="${id}-ed">Your code</label>
      <textarea class="editor" id="${id}-ed" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" rows="${Math.min(22,Math.max(10,code.split("\n").length+2))}">${esc(code)}</textarea>
      <p class="muted small">Tab indents (Esc then Tab leaves the box). Ctrl+Enter checks your answer.</p></div>
    <div class="stack" style="gap:6px" ${P.tests.every(t=>!t.in)?"hidden":""}><label class="lbl" for="${id}-in">Input for Run</label>
      <textarea class="stdin" id="${id}-in" spellcheck="false" placeholder="What the user types (optional)">${esc(ex?ex.in:"")}</textarea></div>
    <div class="row">
      <button class="btn accent" data-act="check">Check answer</button>
      <button class="btn" data-act="run">Run</button>
      <button class="btn ghost" data-act="hint"></button>
      <button class="btn ghost" data-act="sol">Show solution</button>
    </div>
    <div class="row small"><a class="linkbtn" data-act="ce" href="#" target="_blank" rel="noopener">Open in Compiler Explorer ↗</a><button class="linkbtn" data-act="reset">Reset to starter code</button></div>
    <div class="results" aria-live="polite"></div>
    <div class="hints"></div>
    <div class="solution"></div>`;
  const ed=el.querySelector(".editor"),sin=el.querySelector(".stdin"),res=el.querySelector(".results"),btn=a=>el.querySelector(`[data-act="${a}"]`);
  const status=()=>{const s=el.querySelector("[data-status]");
    s.className="pill "+(ps.passed?(ps.sol?"mid":"ok"):ps.sol?"mid":"");
    s.textContent=ps.passed?(ps.sol?"solved with solution":ps.self?"marked solved":"solved"):ps.sol?"solution viewed":"not solved yet"};
  const hintBtn=()=>{const left=P.hints.length-ps.hints;const b=btn("hint");b.textContent=left?`Hint (${left} left)`:"No more hints";b.disabled=!left};
  const drawHints=()=>{el.querySelector(".hints").innerHTML=ps.hints?`<div class="result info"><b class="small">Hints</b><ol class="hintlist">${P.hints.slice(0,ps.hints).map(h=>`<li>${inline(h)}</li>`).join("")}</ol></div>`:""};
  const drawSol=()=>{if(!ps.sol){el.querySelector(".solution").innerHTML="";return}
    el.querySelector(".solution").innerHTML=`<div class="stack rise"><h3>A solution</h3>${codeBlock(P.sol)}<div class="prose">${prose(P.explain)}</div>
      <div class="row"><button class="btn ghost sm" data-act="load">Put this in the editor</button><span class="muted small">Then change something and run it again: that's how it sticks.</span></div></div>`;
    el.querySelector('[data-act="load"]').onclick=()=>{ed.value=P.sol;persist();ed.focus()}};
  let pt=null;const persist=()=>{clearTimeout(pt);pt=setTimeout(()=>{st.code[pi]=ed.value;save()},300)};
  ed.addEventListener("input",persist);
  const busy=(on,label)=>{el.querySelectorAll("button[data-act]").forEach(b=>{if(b.dataset.act!=="hint")b.disabled=on});if(!on)hintBtn();
    if(on)res.innerHTML=`<div class="result info"><span class="small"><span class="spin"></span> ${esc(label)}</span></div>`};
  const netFail=r=>{res.innerHTML=`<div class="result bad"><b>${esc(r.msg)}</b>
      <p class="small">Use <b>Open in Compiler Explorer</b> to run it there, or compile it on your own computer (the Course tab shows how). If it prints the expected output for every example, you can mark it solved.</p>
      <div class="row"><button class="btn ghost sm" data-act="self">It works: mark solved</button></div></div>`;
    res.querySelector('[data-act="self"]').onclick=()=>{if(!ps.passed){ps.passed=true;ps.self=true;act().s++;save();renderStrip();status();refreshDay(n)}res.innerHTML=`<div class="result ok"><b>Marked solved.</b><div class="prose small">${prose(P.explain)}</div></div>`}};
  const compileFail=r=>`<div class="result bad"><b>It didn't compile.</b><p class="small">Read the first error: it names a line number (<code>&lt;source&gt;:LINE:COLUMN</code>) and what the compiler expected.</p><pre>${esc(r.buildMsg)}</pre></div>`;
  const warnings=r=>r.buildMsg&&/warning/.test(r.buildMsg)?`<div class="result info"><b class="small">Compiler warnings: worth reading, they often point at bugs</b><pre>${esc(r.buildMsg)}</pre></div>`:"";
  const runtimeNote=r=>r.timedOut?" It ran too long and was stopped. Is there a loop that never ends?":(r.code&&r.code!==0)?` It stopped with exit code ${r.code}${r.code===139||r.code===-11?", a crash. Out-of-range index or bad pointer?":""}.`:"";
  btn("run").onclick=async()=>{
    busy(true,"Compiling and running…");const r=await compileRun(ed.value,sin.value);busy(false);
    if(r.net)return netFail(r);if(!r.built){res.innerHTML=compileFail(r);return}
    res.innerHTML=`<div class="result info"><b class="small">Output${runtimeNote(r)}</b><pre>${esc(r.stdout)||"<span class='muted'>(no output)</span>"}</pre>${r.stderr?`<b class="small">Error stream (cerr)</b><pre>${esc(r.stderr)}</pre>`:""}</div>${warnings(r)}`;
  };
  btn("check").onclick=async()=>{
    const src=ed.value;const out=[];let allOk=true;
    for(let t=0;t<P.tests.length;t++){
      busy(true,`Running test ${t+1} of ${P.tests.length}…`);const T=P.tests[t];const r=await compileRun(src,T.in);
      if(r.net){busy(false);return netFail(r)}
      if(!r.built){busy(false);res.innerHTML=compileFail(r);return}
      const ok=r.ran&&norm(r.stdout)===norm(T.out);allOk=allOk&&ok;
      out.push(`<div class="result ${ok?"ok":"bad"}"><b class="small">Test ${t+1}: ${ok?"passed":"failed"}${ok?"":runtimeNote(r)}</b>${ok?"":`<div class="cols">
        <div><span class="lbl">Input</span><pre>${esc(T.in)||"<span class='muted'>(none)</span>"}</pre></div>
        <div><span class="lbl">Expected</span><pre>${esc(T.out)||"<span class='muted'>(nothing)</span>"}</pre></div>
        <div><span class="lbl">Your output</span><pre>${esc(r.stdout)||"<span class='muted'>(nothing)</span>"}</pre></div></div>`}</div>`);
      if(t===P.tests.length-1||!ok)out.push(warnings(r));
      if(!ok)break;
    }
    busy(false);
    if(allOk){
      const first=!ps.passed;ps.passed=true;if(first)act().s++;save();renderStrip();status();refreshDay(n);
      res.innerHTML=`<div class="result ok rise"><b>All ${P.tests.length} tests passed.${first&&!ps.sol&&!ps.hints?" First try, no hints.":""}</b><div class="prose small">${prose(P.explain)}</div></div>`;
    }else{
      res.innerHTML=out.join("")+`<p class="muted small">Spaces and new lines are matched loosely, everything else exactly. Extra text such as prompts counts as wrong output.</p>`;
    }
  };
  btn("hint").onclick=()=>{if(ps.hints<P.hints.length){ps.hints++;save();hintBtn();drawHints()}};
  btn("sol").onclick=()=>{const b=btn("sol"),box=el.querySelector(".solution");
    if(ps.sol){if(box.innerHTML){box.innerHTML="";b.textContent="Show solution"}else{drawSol();b.textContent="Hide solution"}return}
    if(b.dataset.confirm!=="1"&&ps.hints<P.hints.length&&!ps.passed){b.dataset.confirm="1";b.textContent="Sure? Try a hint first. Show it anyway";return}
    ps.sol=true;save();status();drawSol();b.textContent="Hide solution";refreshDay(n)};
  btn("ce").addEventListener("click",e=>{e.currentTarget.href=ceLink(ed.value,sin.value)});
  btn("reset").onclick=()=>{if(ed.value!==P.starter&&!btn("reset").dataset.confirm){btn("reset").dataset.confirm="1";btn("reset").textContent="Click again to replace your code";return}
    delete btn("reset").dataset.confirm;btn("reset").textContent="Reset to starter code";ed.value=P.starter;delete st.code[pi];save()};
  editorKeys(ed,()=>btn("check").click());
  status();hintBtn();drawHints();if(ps.sol){drawSol();btn("sol").textContent="Hide solution"}
  return el;
}

/* ---------- a day ---------- */
let VIEW_DAY=null;
function dayProgress(n){
  const D=dayOf(n),st=ds(n);
  const answered=Object.keys(st.checks).length,right=Object.values(st.checks).filter(c=>c.ok).length;
  const handled=D.problems.filter((p,i)=>st.probs[i]&&(st.probs[i].passed||st.probs[i].sol)).length;
  const solved=D.problems.filter((p,i)=>st.probs[i]?.passed).length;
  return{answered,right,handled,solved,checksDone:answered>=D.checks.length,canFinish:answered>=D.checks.length&&handled>=1};
}
function refreshDay(n){
  const host=$("#v-today");if(!host.querySelector(`[data-day="${n}"]`))return;
  const D=dayOf(n),st=ds(n),p=dayProgress(n);
  const steps=[["Lesson",st.read],[`Quick check ${p.answered}/${D.checks.length}`,p.checksDone],[`Problems ${p.solved}/${D.problems.length}`,p.handled>=1],["Finish",!!st.done]];
  host.querySelector("#steps").innerHTML=steps.map(([l,d],i)=>`<li class="${d?"done":""}"><i>${d?"✓":i+1}</i>${esc(l)}</li>`).join("");
  const f=host.querySelector("#finish");if(!f)return;
  if(st.done){
    const next=dayOf(n+1);
    f.innerHTML=`<h3>Day ${n} complete</h3><h2>${st.done===todayKey()?"Nice work. That's today done.":`Finished on ${fmtDate(st.done)}.`}</h2>
      ${next?`<p class="muted measure">Tomorrow: Day ${next.n}, ${esc(next.title)}. One day at a time beats cramming: coming back tomorrow is what makes it stick. The Review tab is there if you want a few more reps now.</p>`
        :`<p class="muted measure">That was the last day of the course. Keep the Review tab going, and see Day 30 for where to go next.</p>`}
      <div class="row">${next&&!VIEW_DAY?`<button class="btn ghost" id="goNext">Start Day ${next.n} anyway</button>`:""}<button class="btn ghost" id="goReview">Review</button></div>`;
    const gn=f.querySelector("#goNext");if(gn)gn.onclick=()=>{ds(next.n).opened=todayKey();save();VIEW_DAY=null;renderToday();scrollTo({top:0,behavior:reduced()?"auto":"smooth"})};
    f.querySelector("#goReview").onclick=()=>go("review");
  }else{
    const missing=[!p.checksDone&&`answer the ${D.checks.length-p.answered} remaining quick-check question${D.checks.length-p.answered===1?"":"s"}`,p.handled<1&&"solve a problem (or look at a solution)"].filter(Boolean);
    f.innerHTML=`<h3>Finish</h3><p class="measure">${p.canFinish?`You've done enough to finish today.${p.solved<D.problems.length?" The other problems are optional, but each one makes tomorrow easier.":""}`:`To finish Day ${n}: ${missing.join(" and ")}.`}</p>
      <div class="row"><button class="btn accent" id="finishBtn" ${p.canFinish?"":"disabled"}>Finish Day ${n}</button></div>`;
    f.querySelector("#finishBtn").onclick=()=>{st.done=todayKey();act().goal=true;saveNow();renderStrip();refreshDay(n);renderCourseIfVisible()};
  }
}
function renderDay(host,n){
  const D=dayOf(n),st=ds(n);
  const showWarm=!VIEW_DAY&&!st.done&&S.warm!==todayKey()&&reviewItems(3).length>=2;
  host.innerHTML=`${VIEW_DAY?`<div class="row"><button class="linkbtn" id="backToday">← Back to today</button></div>`:""}
    <div class="card dayhead stack" data-day="${n}">
      <div class="row between"><h3>Day ${n} of ${TOTAL} · ${esc(D.unit)}</h3><span class="muted small">about 25 minutes</span></div>
      <h2>${esc(D.title)}</h2><p class="muted measure">${inline(D.goal)}</p><ol class="steps" id="steps" aria-label="Today's steps"></ol></div>
    ${showWarm?`<div class="card stack" id="warm"><h3>Warm-up</h3><p class="measure">Three quick questions from earlier days, including any you got wrong. Remembering old material is what makes it stay.</p>
      <div class="row"><button class="btn" id="warmGo">Start warm-up</button><button class="btn ghost" id="warmSkip">Skip</button></div></div>`:""}
    <div class="card stack" id="lesson"><div class="row between"><h3>Lesson</h3>${st.read?`<span class="pill ok">read</span>`:""}</div>
      ${D.sections.map(s=>`<div class="lsec"><h4>${esc(s.h)}</h4><div class="prose">${prose(s.p)}</div>${s.code?codeBlock(s.code,{input:s.in,out:s.out,try:true}):""}</div>`).join("")}
      <div class="lsec"><h4>Remember</h4><ul class="takeaways">${D.takeaways.map(t=>`<li>${inline(t)}</li>`).join("")}</ul></div>
      ${st.read?"":`<div class="row"><button class="btn" id="readBtn">I've read it: on to the questions</button></div>`}</div>
    <div class="card stack" id="checks"></div>
    <div class="stack" id="probs"></div>
    <div class="card stack" id="finish"></div>`;
  const bt=host.querySelector("#backToday");if(bt)bt.onclick=()=>{VIEW_DAY=null;renderToday()};
  const rb=host.querySelector("#readBtn");if(rb)rb.onclick=()=>{st.read=true;save();rb.parentElement.remove();host.querySelector("#lesson .row.between").insertAdjacentHTML("beforeend",`<span class="pill ok">read</span>`);refreshDay(n);
    host.querySelector("#checks").scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})};
  const warm=host.querySelector("#warm");
  if(warm){warm.querySelector("#warmSkip").onclick=()=>{S.warm=todayKey();save();warm.remove()};
    warm.querySelector("#warmGo").onclick=()=>{checkRunner(warm,reviewItems(3),{title:"Warm-up",mode:"review",onDone:(r,t)=>{S.warm=todayKey();save();
      warm.innerHTML=`<h3>Warm-up done</h3><p>${r} of ${t} right.${r<t?" The ones you missed will come back in review until you get them twice.":""}</p>`}})}}
  const checks=host.querySelector("#checks");
  const drawChecks=()=>{const p=dayProgress(n);
    checks.innerHTML=`<h3>Quick check</h3>${p.checksDone?`<p><b class="tabular">${p.right} of ${D.checks.length}</b> right.${p.right<D.checks.length?" Misses go into your review queue.":""}</p><div class="row"><button class="btn ghost" id="chkGo">Try them again</button></div>`
      :`<p class="measure">${D.checks.length} short questions on today's lesson. Answer before you look back at the lesson: the effort of remembering is the point.</p><div class="row"><button class="btn" id="chkGo">${p.answered?"Carry on":"Start"}</button></div>`}`;
    checks.querySelector("#chkGo").onclick=()=>{const all=D.checks.map((c,i)=>({d:n,i}));const todo=p.checksDone?all:all.filter(x=>!st.checks[x.i]);
      checkRunner(checks,todo,{title:`Day ${n} check`,mode:"day",onDone:()=>{drawChecks();refreshDay(n);host.querySelector("#probs").scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})}})}};
  drawChecks();
  const probs=host.querySelector("#probs");D.problems.forEach((p,i)=>probs.appendChild(problemCard(n,i)));
  refreshDay(n);
}
function renderToday(){
  const host=$("#v-today");const cur=currentDayN();
  if(VIEW_DAY===cur)VIEW_DAY=null;
  if(VIEW_DAY){renderDay(host,VIEW_DAY);return}
  if(!cur){host.innerHTML=`<div class="card stack"><h3>Course complete</h3><h2>All ${TOTAL} days done.</h2><p class="muted measure">Keep your memory fresh with a review set each day, and look back at Day 30 for what to learn next.</p><div class="row"><button class="btn accent" id="rv">Start a review set</button><button class="btn ghost" id="cs">Browse the course</button></div></div>`;
    host.querySelector("#rv").onclick=()=>go("review");host.querySelector("#cs").onclick=()=>go("course");return}
  const st=S.days[cur];const startedToday=st&&st.opened===todayKey();
  if(finishedToday()&&!startedToday&&!Object.keys(st?.checks||{}).length){
    const D=dayOf(cur);
    host.innerHTML=`<div class="card stack"><h3>${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</h3><h2>Today's day is done.</h2>
      <p class="muted measure">Next up is Day ${cur}: ${esc(D.title)}. Come back tomorrow for it, or start now if you've got the energy. A short review set is a good way to spend five more minutes.</p>
      <div class="row"><button class="btn" id="rv">Review</button><button class="btn ghost" id="now">Start Day ${cur} now</button></div></div>`;
    host.querySelector("#rv").onclick=()=>go("review");host.querySelector("#now").onclick=()=>{ds(cur).opened=todayKey();save();renderToday()};return}
  ds(cur).opened=todayKey();save();
  renderDay(host,cur);
}
function openDay(n){VIEW_DAY=n===currentDayN()?null:n;go("today");scrollTo({top:0})}

/* ---------- course ---------- */
function renderCourse(){
  const host=$("#v-course");const cur=currentDayN();
  host.innerHTML=`<div class="card stack"><h3>The course</h3><h2>${TOTAL} days from zero to classes, maps and pointers</h2>
      <p class="muted measure">One day is a short lesson, a few quick questions and one to three problems: about 25 minutes. Do them in order, since each builds on the last. You can open any day to look back at it.</p>
      <details class="setup"><summary>Running C++ on your own computer</summary><div class="stack small">
        <p>You don't need this to use the site: Run and Check use Compiler Explorer. But you'll want a local setup before long.</p>
        <p><b>Windows (simplest):</b> install <a href="https://visualstudio.microsoft.com/vs/community/" target="_blank" rel="noopener">Visual Studio Community</a> and tick "Desktop development with C++". Create an Empty Project, add a <code>main.cpp</code>, paste your code and press Ctrl+F5.</p>
        <p><b>Windows (VS Code):</b> install <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> and its C/C++ extension, plus the g++ compiler through <a href="https://www.msys2.org/" target="_blank" rel="noopener">MSYS2</a> (run <code>pacman -S mingw-w64-ucrt-x86_64-gcc</code> in the MSYS2 UCRT64 terminal, then add <code>C:\\msys64\\ucrt64\\bin</code> to your PATH).</p>
        <p><b>Mac:</b> run <code>xcode-select --install</code> in Terminal. That gives you <code>clang++</code>.</p>
        <p><b>Then compile and run in a terminal:</b></p>
        <pre class="code">g++ -std=c++20 -Wall main.cpp -o main
./main</pre>
        <p>On a Mac, use <code>clang++</code> in place of <code>g++</code>. On Windows, run <code>main.exe</code>.</p></div></details></div>
    <ol class="units">${UNITS.map((u,ui)=>{const ds_=DAYS.filter(d=>d.unit===u);const done=ds_.filter(d=>S.days[d.n]?.done).length;
      return`<li class="card stack" style="gap:8px"><div class="row between"><h3>Unit ${ui+1} · ${esc(u)}</h3><span class="muted small tabular">${done}/${ds_.length}</span></div>
        <div class="bar"><i style="width:${done/ds_.length*100}%"></i></div>
        <ul class="daylist">${ds_.map(d=>{const st=S.days[d.n];const isDone=!!st?.done,isCur=d.n===cur;
          return`<li><button class="dayrow ${isDone?"done":""} ${isCur?"cur":""}" data-day="${d.n}"><span class="dn tabular">${isDone?"✓":d.n}</span><span class="dt">${esc(d.title)}</span>
            <span class="pill ${isDone?"ok":isCur?"cur":""}">${isDone?"done":isCur?"up next":"Day "+d.n}</span></button></li>`}).join("")}</ul></li>`}).join("")}</ol>`;
  host.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>openDay(Number(b.dataset.day)));
}
function renderCourseIfVisible(){if(!$("#v-course").hidden)renderCourse()}

/* ---------- review ---------- */
function renderReview(){
  const host=$("#v-review");const avail=reviewItems(8);
  if(!avail.length){host.innerHTML=`<div class="card stack"><h3>Review</h3><h2>Nothing to review yet</h2><p class="muted measure">Once you've answered a day's quick check, its questions show up here, and any you get wrong come back first until you've got them right twice.</p><div class="row"><button class="btn" id="tt">Go to today</button></div></div>`;
    host.querySelector("#tt").onclick=()=>go("today");return}
  const q=S.review.filter(r=>dayOf(r.d)?.checks[r.i]);
  host.innerHTML=`<div class="card stack"><h3>Review</h3><h2>A ${avail.length}-question set from days you've done</h2>
      <p class="muted measure">Questions you missed come first. A question leaves your queue once you get it right twice in review. A set of 5 or more counts towards your streak.</p>
      <div class="row"><button class="btn accent" id="rvGo">Start review</button><span class="muted small">${q.length} in your mistake queue</span></div></div>
    <div class="card" id="rvHost" hidden></div>
    <div class="card stack"><h3>Mistake queue · ${q.length}</h3>
      <div class="list">${q.length?q.slice(0,20).map(r=>{const D=dayOf(r.d),c=D.checks[r.i];return`<div><span class="small">${inline(c.q||"Predict the output")}${c.code&&!c.q?` <code>${esc(c.code.split("\n")[0])}…</code>`:""}</span><span class="pill">Day ${r.d} · ${r.fixes}/2</span></div>`}).join("")
        :`<div><span class="muted small">Empty. Anything you get wrong lands here.</span></div>`}</div></div>`;
  host.querySelector("#rvGo").onclick=()=>{const h=host.querySelector("#rvHost");h.hidden=false;h.classList.add("stack");
    const items=reviewItems(8);
    checkRunner(h,items,{title:"Review",mode:"review",onDone:(r,t)=>{if(t>=5){act().goal=true;save();renderStrip()}
      h.innerHTML=`<h3>Review done</h3><h2 class="tabular">${r} of ${t}</h2><p class="muted">${r===t?"Clean sheet.":"Misses stay in your queue and come back next time."}</p><div class="row"><button class="btn" id="again">Another set</button></div>`;
      h.querySelector("#again").onclick=renderReview}});
    h.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})};
}

/* ---------- progress ---------- */
function renderProgress(){
  const host=$("#v-progress");
  const done=DAYS.filter(d=>S.days[d.n]?.done).length;
  let n=0,k=0;for(const v of Object.values(S.act)){n+=v.c;k+=v.k}
  let own=0;for(const d of Object.values(S.days))for(const p of Object.values(d.probs||{}))if(p.passed&&!p.sol&&!p.self)own++;
  const cells=[];const d=new Date();d.setDate(d.getDate()-34);
  for(let i=0;i<35;i++){const key=d.toLocaleDateString("en-CA");const a=S.act[key];const lv=!a?0:a.goal?3:(a.c+a.s*3)>=6?2:(a.c||a.s)?1:0;
    cells.push(`<i class="${lv?"l"+lv:""} ${key===todayKey()?"today":""}" title="${fmtDate(key)}${a?`: ${a.c} questions, ${a.s} solved${a.goal?", goal met":""}`:""}"></i>`);d.setDate(d.getDate()+1)}
  host.innerHTML=`<div class="grid">
      <div class="card stat"><h3>Days done</h3><div class="big tabular">${done}<span class="muted" style="font-size:18px">/${TOTAL}</span></div><div class="bar"><i style="width:${done/TOTAL*100}%"></i></div></div>
      <div class="card stat"><h3>Streak</h3><div class="big tabular">${streak()}<span class="muted" style="font-size:18px"> days</span></div><p class="muted small">Finish a day or a review set to keep it.</p></div>
      <div class="card stat"><h3>Solved alone</h3><div class="big tabular">${own}</div><p class="muted small">Problems passed without the solution. ${solvedCount()} passed in total.</p></div>
      <div class="card stat"><h3>Question accuracy</h3><div class="big tabular">${n?Math.round(k/n*100)+"%":"–"}</div><p class="muted small">${n} answered</p></div></div>
    <div class="card stack"><h3>Last 5 weeks</h3><div class="heat" role="img" aria-label="Activity over the last 35 days">${cells.join("")}</div></div>
    <div class="card stack"><h3>By unit</h3><div class="list">${UNITS.map((u,ui)=>{const ds_=DAYS.filter(x=>x.unit===u);const dn=ds_.filter(x=>S.days[x.n]?.done).length;
      let a=0,r=0;ds_.forEach(x=>{const c=S.days[x.n]?.checks||{};for(const v of Object.values(c)){a++;if(v.ok)r++}});
      return`<div><span>${ui+1}. ${esc(u)}</span><span class="row" style="gap:8px">${a?`<span class="pill ${r/a>=.8?"ok":r/a>=.5?"mid":"bad"} tabular">${Math.round(r/a*100)}% right</span>`:""}<span class="pill ${dn===ds_.length?"ok":""} tabular">${dn}/${ds_.length} days</span></span></div>`}).join("")}</div></div>
    <div class="card stack"><h3>Your data</h3><p class="muted measure">Progress is saved in this browser only. Copy it to move to another device or browser, or paste it into Claude and ask what you should work on.</p>
      <div class="row"><button class="btn" id="cp">Copy progress</button><button class="btn ghost" id="im">Import progress</button><button class="btn ghost" id="rs">Reset</button></div>
      <div id="pmsg" class="small" aria-live="polite"></div>
      <div id="imbox" class="stack" hidden><label class="lbl" for="imtext">Paste copied progress</label><textarea id="imtext" rows="4"></textarea><div class="row"><button class="btn" id="imgo">Load it</button></div></div>
      <div id="rsbox" class="row" hidden><span class="small">This deletes every day, answer and saved piece of code in this browser.</span><button class="btn danger" id="rsgo">Delete my progress</button></div></div>`;
  const msg=t=>{host.querySelector("#pmsg").textContent=t};
  host.querySelector("#cp").onclick=async()=>{const txt=JSON.stringify({cppDaily:1,state:S});
    try{await navigator.clipboard.writeText(txt);msg("Copied.")}catch(e){host.querySelector("#imbox").hidden=false;const ta=host.querySelector("#imtext");ta.value=txt;ta.select();msg("Couldn't copy automatically. The text is selected below: copy it from there.")}};
  host.querySelector("#im").onclick=()=>{host.querySelector("#imbox").hidden=false;host.querySelector("#imtext").value="";host.querySelector("#imtext").focus()};
  host.querySelector("#imgo").onclick=()=>{try{const j=JSON.parse(host.querySelector("#imtext").value);if(!j.state||j.state.v!==1)throw 0;S={...blank(),...j.state};saveNow();renderAll();go("progress");$("#pmsg").textContent="Progress loaded."}catch(e){msg("That doesn't look like copied C++ Daily progress.")}};
  host.querySelector("#rs").onclick=()=>{host.querySelector("#rsbox").hidden=false};
  host.querySelector("#rsgo").onclick=()=>{S=blank();VIEW_DAY=null;saveNow();renderAll();go("progress");$("#pmsg").textContent="Progress reset."};
}

/* ---------- navigation ---------- */
const VIEWS=["today","course","review","progress"];
function moveIndicator(){const sel=document.querySelector('nav button[aria-selected="true"]');const ind=$("#navind");if(!sel||!ind)return;ind.style.width=sel.offsetWidth+"px";ind.style.transform=`translateX(${sel.offsetLeft-4}px)`}
function go(v,push=true){
  if(!VIEWS.includes(v))v="today";
  document.querySelectorAll("nav button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===v)));
  VIEWS.forEach(k=>{const el=$("#v-"+k);const show=k===v;if(show&&el.hidden){el.hidden=false;if(!reduced()){el.classList.remove("vin");void el.offsetWidth;el.classList.add("vin")}}else if(!show)el.hidden=true});
  if(v==="today")renderToday();if(v==="course")renderCourse();if(v==="review")renderReview();if(v==="progress")renderProgress();
  moveIndicator();if(push)try{history.replaceState(null,"","#"+v)}catch(e){}
}
function renderAll(){renderStrip();renderToday()}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.v));
window.addEventListener("resize",moveIndicator);
window.addEventListener("pagehide",saveNow);
load();renderStrip();go((location.hash||"#today").slice(1),false);
requestAnimationFrame(()=>document.body.classList.add("ready"));
