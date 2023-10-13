import { ACTIONS } from "./App"

export default function OperationButton({digit, dispatch}) {
    return (
        <button onClick={() =>dispatch({type: ACTIONS.CHOOSE_OPERATION, payload: {digit}})}>{digit}</button>
    )
}