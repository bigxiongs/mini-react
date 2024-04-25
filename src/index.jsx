import Pact from "../pact"
import { useCallback, useEffect, useMemo, useRef } from "../pact/pact"
import './style.css'

/** @jsx Pact.createElement */
function Counter() {
  const [state, setState] = Pact.useState(1)
  const increment = () => setState(c => c + 1)
  const decrement = () => setState(c => c - 1)
  const computed = useMemo(() => state * 2, [state])
  const callback = useCallback(() => console.log(state), [state])
  let ref = useRef(0)
  const inputRef = useRef(null)

  useEffect(() => console.log("effect"))
  function incrementRef() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }
  function focueInput() {
    inputRef.current.focus();
  }

  return (
    <div className="box">
      <button onClick={decrement} >-</button>
      <p>Count: {state} {computed}</p>
      <button onClick={increment}>+</button>
      <button onClick={callback}>log state</button>
      <button onClick={incrementRef}>test ref</button>
      <input ref={inputRef} />
      <button onClick={focueInput}>Focus the input</button>
    </div>
  )
}

const root = document.createElement("div")
document.body.append(root)
Pact.render(<Counter />, root)
