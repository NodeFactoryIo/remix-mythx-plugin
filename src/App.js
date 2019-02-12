import React, { Component } from 'react'
import './App.css'
import { MythxLogin } from './Login/MythXLogin'
import { Provider } from 'react-redux'
import { store } from './_helpers/store'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <div className="App">
          <h1>MythX Security Verification</h1>
          <MythxLogin/>
        </div>
      </Provider>
    )
  }
}

export default App
