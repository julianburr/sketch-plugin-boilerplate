import { sendAction } from 'utils/sketch'
import { SEND_ACTION, RECEIVE_ACTION } from 'actions/bridge'
import moment from 'moment'

export let defaultState = {
  actions: [],
  runBusyOnCocoaScriptState: 'not_start',
  runBusyOnFrameworkState: 'not_start',
}

export default (state, action) => {
  // Make sure to apply a default state if necessary
  if (state === undefined) {
    state = defaultState
  }
  // Switch case for all possible actions
  switch (action.type) {
    case SEND_ACTION:
      sendAction(action.payload.name, action.payload.payload).catch(e => {
        console.error(e)
      })
      return {
        ...state,
        actions: [...state.actions].concat([{
          ts: moment(),
          type: 'outbound',
          name: action.payload.name,
          payload: action.payload.payload
        }])
      }

    case RECEIVE_ACTION:
      if (action.payload.name === 'runBusyOnCocoaScriptDone') {
        return {
          ...state,
          runBusyOnCocoaScriptState: 'done'
        }
      }
      if (action.payload.name === 'runBusyOnFrameworkDone') {
        return {
          ...state,
          runBusyOnFrameworkState: 'done'
        }
      }
      return {
        ...state,
        actions: [...state.actions].concat([{
          ts: moment(),
          type: 'inbound',
          name: action.payload.name,
          payload: action.payload.payload
        }])
      }

    default:
      return state
  }
}
