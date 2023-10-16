import React, { useReducer } from 'react';

import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './styles.css';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation', 
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overrite) return {
        ...state,
        overrite: false,
        currentOperand: payload.digit,
      }
      if(payload.digit === "0" && state.currentOperand === "0") return state
      if(payload.digit === "." && state.currentOperand.includes(".") ) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    
    case ACTIONS.CLEAR:
      return {}
    
    case ACTIONS.DELETE_DIGIT:
      if(state.overrite) return {
        ...state,
        overrite: false,
        currentOperand: null,
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) return {
        ...state,
        currentOperand: null,
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) return state

      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if(state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state, 
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }
    
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null ) return state
      return {
        ...state,
        overrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null
      }

    default:
      return state
  }
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  
  if(isNaN(prev) || isNaN(curr)) return ""
  
  let computation = ""

  switch(operation) {
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "÷":
      computation = prev / curr
      break
    default:
      return ""
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('pl-PL', {maximumFractionDigits: 0})

function foramtOperand(operand) {
  if(operand == null) return ""
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{foramtOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{foramtOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() =>dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.CLEAR})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch}>÷</OperationButton>

      <DigitButton digit="1" dispatch={dispatch}>1</DigitButton>
      <DigitButton digit="2" dispatch={dispatch}>2</DigitButton>
      <DigitButton digit="3" dispatch={dispatch}>3</DigitButton>
      <OperationButton operation="*" dispatch={dispatch}>*</OperationButton>

      <DigitButton digit="4" dispatch={dispatch}>4</DigitButton>
      <DigitButton digit="5" dispatch={dispatch}>5</DigitButton>
      <DigitButton digit="6" dispatch={dispatch}>6</DigitButton>
      <OperationButton operation="+" dispatch={dispatch}>+</OperationButton>

      <DigitButton digit="7" dispatch={dispatch}>7</DigitButton>
      <DigitButton digit="8" dispatch={dispatch}>8</DigitButton>
      <DigitButton digit="9" dispatch={dispatch}>9</DigitButton>
      <OperationButton operation="-" dispatch={dispatch}>-</OperationButton>

      <DigitButton digit="." dispatch={dispatch}>.</DigitButton>
      <DigitButton digit="0" dispatch={dispatch}>0</DigitButton>
      <button className="span-two" onClick={()=>dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}

export default App;
