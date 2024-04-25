/** @jsxFrag Pact.Fragment */
/** @jsx Pact.createElement */
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
    <>
      <CounterContext.Provider value="1 useState & useMemo & useCallback">
        <Section>
          <button onClick={decrement}>-</button>
          <p>
            Count: {state} {computed}
          </p>
          <button onClick={increment}>+</button>
        </Section>
      </CounterContext.Provider>
      <CounterContext.Provider value="2 useEffect">
        <Section>
          <button onClick={callback}>log state</button>
        </Section>
      </CounterContext.Provider>
      <CounterContext.Provider value="3 useRef">
        <Section>
          <button onClick={incrementRef}>test ref</button>
          <input ref={inputRef} />
          <button onClick={focueInput}>Focus the input</button>
        </Section>
      </CounterContext.Provider>
    </>
  )
}

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
