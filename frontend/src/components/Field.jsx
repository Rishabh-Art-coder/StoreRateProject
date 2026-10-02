
export default function Field({label , type = 'text' , value , onChange , children }) {
  return <>
  <label>{label}</label>
  {children || <input type = {type} value = {value} onChange = {e => onChange(e.target.value)}/>} 
  </>
}