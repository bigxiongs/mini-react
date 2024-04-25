import Pact from "../pact"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  createContext,
  useContext,
} from "../pact/pact"
import "./style.css"

const CounterContext = createContext(0)

/** @jsx Pact.createElement */
function Counter() {
  const [state, setState] = Pact.useState(1)
  const increment = () => setState((c) => c + 1)
  const decrement = () => setState((c) => c - 1)
  const computed = useMemo(() => state * 2, [state])
  const callback = useCallback(() => console.log(state), [state])
  let ref = useRef(0)
  const inputRef = useRef(null)

  useEffect(() => console.log("effect"))
  function incrementRef() {
    ref.current = ref.current + 1
    alert("You clicked " + ref.current + " times!")
  }
  function focueInput() {
    inputRef.current.focus()
  }

  return (
    <div className="box">
      <CounterContext.Provider value="sec1">
        <Section>
          <button onClick={decrement}>-</button>
          <p>
            Count: {state} {computed}
          </p>
          <button onClick={increment}>+</button>
        </Section>
      </CounterContext.Provider>
      <CounterContext.Provider value="sec2">
        <Section>
          <button onClick={callback}>log state</button>
        </Section>
      </CounterContext.Provider>
      <CounterContext.Provider value="sec3">
        <Section>
          <button onClick={incrementRef}>test ref</button>
          <input ref={inputRef} />
          <button onClick={focueInput}>Focus the input</button>
        </Section>
      </CounterContext.Provider>
    </div>
  )
}

/** @jsx Pact.createElement */
function Section(props) {
  const contextValue = useContext(CounterContext)
  return (
    <div className="section">
      <h3>Section {contextValue}</h3>
      <div>{props.children}</div>
    </div>
  )
}

const root = document.createElement("div")
document.body.append(root)
Pact.render(<Counter />, root)
