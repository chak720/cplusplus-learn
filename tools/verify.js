#!/usr/bin/env node
/* Compiles and runs every lesson example, output check and problem solution in the course,
   and checks starters compile. Needs g++ (C++20). Usage: node tools/verify.js [dayNumber] */
"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm"),os=require("os");
const {execFileSync,spawnSync}=require("child_process");

const root=path.join(__dirname,"..");
const ctx={console};vm.createContext(ctx);
const files=fs.readdirSync(path.join(root,"assets")).filter(f=>/^course-\d+\.js$/.test(f)).sort();
vm.runInContext(files.map(f=>fs.readFileSync(path.join(root,"assets",f),"utf8")).join("\n")+"\nthis.DAYS=DAYS;",ctx);
const DAYS=ctx.DAYS;

const HEADERS=["iostream","string","vector","algorithm","numeric","map","set","unordered_map","array","memory","cctype","cmath","utility"];
const wrap=code=>/\bmain\s*\(/.test(code)?code:HEADERS.map(h=>`#include <${h}>`).join("\n")+"\n\nint main() {\n"+code+"\nreturn 0;\n}\n";
const norm=s=>String(s).trim().split(/\s+/).join(" ");
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"cppdaily-"));
let n=0,fail=0,id=0;
function build(code){
  id++;const src=path.join(tmp,`p${id}.cpp`),exe=path.join(tmp,`p${id}.out`);
  fs.writeFileSync(src,wrap(code));
  const r=spawnSync("g++",["-std=c++20","-Wall","-Wextra","-o",exe,src],{encoding:"utf8"});
  if(r.status!==0)return{err:r.stderr};
  return{exe,warn:r.stderr};
}
function run(exe,input){const r=spawnSync(exe,[],{input:input||"",encoding:"utf8",timeout:5000});return r.stdout+(r.status!==0?`\n[exit ${r.status}]`:"")}
function bad(label,msg){fail++;console.log(`FAIL ${label}\n  ${String(msg).trim().split("\n").slice(0,12).join("\n  ")}`)}
function expectOut(label,code,input,want){
  n++;const b=build(code);if(b.err)return bad(label,b.err);
  const got=run(b.exe,input);if(norm(got)!==norm(want))bad(label,`expected: ${JSON.stringify(norm(want))}\n  got:      ${JSON.stringify(norm(got))}`);
}
const only=process.argv[2]?Number(process.argv[2]):null;
const seen=new Set();
for(const d of DAYS){
  if(seen.has(d.n))bad(`day ${d.n}`,"duplicate day number");seen.add(d.n);
  if(only&&d.n!==only)continue;
  for(const k of ["unit","title","goal","sections","takeaways","checks","problems"])if(!d[k])bad(`day ${d.n}`,`missing ${k}`);
  d.sections.forEach((s,i)=>{if(s.code&&s.out!==undefined)expectOut(`day ${d.n} section ${i+1} "${s.h}"`,s.code,s.in,s.out)});
  d.checks.forEach((c,i)=>{const L=`day ${d.n} check ${i+1}`;
    if(c.t==="out")expectOut(L,c.code,c.in,c.a);
    else if(c.t==="mc"){n++;if(!(c.a>=0&&c.a<c.opts.length))bad(L,"answer index out of range")}
    else bad(L,"unknown check type "+c.t);
    if(!c.why)bad(L,"missing why")});
  d.problems.forEach((p,i)=>{const L=`day ${d.n} problem ${i+1} "${p.title}"`;
    n++;const s=build(p.starter);if(s.err&&!p.starterBroken)bad(L+" starter",s.err);if(!s.err&&p.starterBroken)bad(L+" starter","expected the starter not to compile");
    n++;const b=build(p.sol);if(b.err)return bad(L+" solution",b.err);
    if(b.warn&&b.warn.includes("warning"))bad(L+" solution warnings",b.warn);
    p.tests.forEach((t,j)=>{const got=run(b.exe,t.in);if(norm(got)!==norm(t.out))bad(`${L} test ${j+1}`,`input: ${JSON.stringify(t.in)}\n  expected: ${JSON.stringify(norm(t.out))}\n  got:      ${JSON.stringify(norm(got))}`)});
    if(!s.err&&!p.starterBroken&&p.tests.every(t=>norm(run(s.exe,t.in))===norm(t.out)))bad(L+" starter","the starter already passes every test");
  });
}
fs.rmSync(tmp,{recursive:true,force:true});
console.log(`${DAYS.length} days, ${n} items checked, ${fail} failure${fail===1?"":"s"}`);
process.exit(fail?1:0);
