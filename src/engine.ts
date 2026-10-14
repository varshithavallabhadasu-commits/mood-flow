export type Mood='Happy'|'Calm'|'Stressed'|'Tired'|'Neutral'|'Overwhelmed';
export type Energy='Low'|'Medium'|'High';
export type Difficulty='Easy'|'Medium'|'Hard';
export type Priority='Low'|'Medium'|'High';
export type Task={id:string;name:string;subject:string;difficulty:Difficulty;minutes:number;remaining:number;deadline:string;priority:Priority;createdAt:string};
export type Block={id:string;kind:'study'|'break';minutes:number;taskId?:string;taskName?:string;reason?:string};
export type Plan={id:string;createdAt:string;mood:Mood;energy:Energy;available:number;blocks:Block[]};
export type Session={id:string;taskId:string;taskName:string;minutes:number;completedAt:string;planId:string;blockId:string};
const priorityValue:Record<Priority,number>={Low:0,Medium:12,High:24};
const difficultyValue:Record<Difficulty,number>={Easy:0,Medium:1,Hard:2};
export const uid=()=>globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random()}`;
export function urgency(task:Task,now=Date.now()){const hours=(new Date(task.deadline).getTime()-now)/3600000;if(hours<=0)return 75;if(hours<=12)return 65;if(hours<=24)return 55;if(hours<=72)return 40;if(hours<=168)return 24;return 8;}
export function score(task:Task,energy:Energy,now=Date.now()){const d=difficultyValue[task.difficulty];const compatibility=energy==='High'?d*12:energy==='Low'?(2-d)*12:12-Math.abs(d-1)*6;return urgency(task,now)+priorityValue[task.priority]+compatibility;}
export function generatePlan(tasks:Task[],mood:Mood,energy:Energy,available:number,now=Date.now()):Plan{
 const blocks:Block[]=[];const pending=tasks.filter(t=>t.remaining>0&&Number.isFinite(t.remaining)&&t.remaining>0&&Number.isFinite(new Date(t.deadline).getTime())).sort((a,b)=>score(b,energy,now)-score(a,energy,now)||new Date(a.deadline).getTime()-new Date(b.deadline).getTime());
 const left=new Map(pending.map(t=>[t.id,t.remaining]));let time=available;const short=energy==='Low'||mood==='Stressed'||mood==='Overwhelmed'||mood==='Tired';const focus=short?20:energy==='High'?45:30;let studyCount=0;
 while(time>0&&blocks.length<80){const candidate=pending.find(t=>(left.get(t.id)??0)>0);if(!candidate)break;
  const remain=left.get(candidate.id)!;const duration=Math.min(focus,remain,time);if(duration<1)break;
  blocks.push({id:uid(),kind:'study',minutes:duration,taskId:candidate.id,taskName:candidate.name,reason:urgency(candidate,now)>=55?'Approaching or overdue deadline':energy==='High'&&candidate.difficulty==='Hard'?'Challenging task matched to high energy':short&&candidate.difficulty==='Easy'?'Manageable task for your current energy':'Balanced priority, deadline and energy'});
  left.set(candidate.id,remain-duration);time-=duration;studyCount++;
  if(time>=5&&pending.some(t=>(left.get(t.id)??0)>0)&&duration>=10){const breakDuration=Math.min(5,time);blocks.push({id:uid(),kind:'break',minutes:breakDuration});time-=breakDuration;}
 }
 return {id:uid(),createdAt:new Date(now).toISOString(),mood,energy,available,blocks};
}
export const sumStudy=(p:Plan|null)=>p?.blocks.filter(b=>b.kind==='study').reduce((n,b)=>n+b.minutes,0)??0;
export const sumBreak=(p:Plan|null)=>p?.blocks.filter(b=>b.kind==='break').reduce((n,b)=>n+b.minutes,0)??0;
