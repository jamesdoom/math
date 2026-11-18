import type { LinearSystem } from '../../types/practice';
import { formatNumber } from '../../utils/linear';
export function EquationSystem({ system }: { system: LinearSystem }) {
  function term(coefficient: number, letter: string, signed: boolean) {
    const magnitude=Math.abs(coefficient);
    const value=magnitude===1?'':Number.isInteger(magnitude)?formatNumber(magnitude):'('+formatNumber(magnitude)+')';
    if(coefficient===0)return signed?'+ 0'+letter:'0'+letter;
    return (coefficient<0?'− ':signed?'+ ':'')+value+letter;
  }
  return <table className="equation-system">
    <caption>Original equations · keep these for the final check</caption>
    <thead><tr><th scope="col">Row</th><th scope="col">x terms</th><th scope="col">y terms</th><th scope="col">Equals</th><th scope="col">Right side</th></tr></thead>
    <tbody>{[system.first,system.second].map((row,i)=><tr key={i}>
      <th scope="row">{i===0?'A':'B'}</th><td>{term(row.a,'x',false)}</td><td>{term(row.b,'y',true)}</td><td>=</td><td>{formatNumber(row.c)}</td>
    </tr>)}</tbody>
  </table>;
}
