import { sessionSets, sessionKinds, type SessionKind } from '../data/chapters/chapter5Sessions';
export const SESSION_KEY='algebra-lab.chapter5.short-session.v1';
export interface ShortSession { version:1; id:string; set:number; length:number; completed:number; kind:SessionKind }
export function sessionMoves(session:ShortSession){return sessionSets[session.kind][session.set];}
export function createSession(set=0,length=3,kind:SessionKind='graph'):ShortSession{
  return {version:1,id:crypto.randomUUID(),set:set%sessionSets[kind].length,length,completed:0,kind};
}
export function parseSession(raw:string|null):ShortSession|null{
  try{
    const value:unknown=JSON.parse(raw??'null');
    if(!value||typeof value!=='object')return null;
    const s=value as Record<string,unknown>;
    if(s.version!==1||typeof s.id!=='string'||!s.id||!sessionKinds.some(kind=>kind===s.kind))return null;
    const kind=s.kind as SessionKind;
    if(typeof s.set!=='number'||!Number.isInteger(s.set)||s.set<0||s.set>=sessionSets[kind].length||
      typeof s.length!=='number'||!Number.isInteger(s.length)||s.length<1||s.length>3||
      typeof s.completed!=='number'||!Number.isInteger(s.completed)||s.completed<0||s.completed>s.length)return null;
    return s as unknown as ShortSession;
  }catch{return null;}
}
export function loadSavedSession(kind?:SessionKind, storage:Pick<Storage,'getItem'>=localStorage):ShortSession|null {
  if(kind){
    const saved=parseSession(storage.getItem(SESSION_KEY+'.'+kind));
    if(saved?.kind===kind)return saved;
    const current=parseSession(storage.getItem(SESSION_KEY));
    return current?.kind===kind?current:null;
  }
  return parseSession(storage.getItem(SESSION_KEY));
}
export function saveSession(session:ShortSession, storage:Pick<Storage,'setItem'>=localStorage){
  const raw=JSON.stringify(session);
  // Keep a paused activity when the student chooses another kind of session.
  storage.setItem(SESSION_KEY+'.'+session.kind,raw);
  storage.setItem(SESSION_KEY,raw);
}
