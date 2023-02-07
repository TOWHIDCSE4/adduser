import { createStore, combineReducers, applyMiddleware } from 'redux'
import _ from 'lodash'
import { HYDRATE } from 'next-redux-wrapper';

export interface State {

}

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension')
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return applyMiddleware(...middleware)
}

const reducer = (state = {}, action) => {
  if (action.type === "setStore") {
    state = {
      ...state,
    }
    _.set(state, action.payload.path, action.payload.value)
    return state
  }
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    }
    return nextState
  }
  return state
}

const setStore = (path, value) => ({
  type: 'setStore',
  payload: {
    path,
    value
  }
});

const makeStore: any = () => {
  return createStore(reducer, bindMiddleware([]))
}

export {
  makeStore,
  setStore
}
