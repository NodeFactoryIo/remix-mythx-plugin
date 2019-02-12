import React from 'react'
import { connect } from 'react-redux'

import { userActions } from '../_actions'

class MythxLogin extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      address: '',
      password: ''
    }
  }

  handleInputChange = (event) => {
    const target = event.target
    const name = target.name

    this.setState({
      [name]: target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.dispatch(userActions.login(this.state.address, this.state.password))
  }

  handleLogout = () => {
    this.props.dispatch(userActions.logout())
  }

  render () {
    if (this.props.loggedIn) return (
      <p>Logged in as {this.props.user.address}! &nbsp;
        <button onClick={this.handleLogout}>Logout!</button>
      </p>
    )
    return (

      <form onSubmit={this.handleSubmit}>
        <p>Verify security of your smart contract on complilation. Sign up for a
          free account on&nbsp;
          <a target="_blank" rel="noopener noreferrer"
             href="https://mythx.io">https://mythx.io</a>
        </p>
        <p>
          <label>MythiX address</label><br/>
          <input
            type="text"
            placeholder="0x123..."
            value={this.state.address}
            onChange={this.handleInputChange}
            name="address"
          />
        </p>

        <p>
          <label>MythiX password</label><br/>
          <input
            type="password"
            placeholder="super secret password"
            value={this.state.password}
            onChange={this.handleInputChange}
            name="password"
          />
        </p>

        <p>
          <input type="submit" value="Activate"/>
        </p>
      </form>
    )
  }

}

function mapStateToProps (state) {
  const {authentication} = state
  const {loggedIn, user} = authentication
  return {
    loggedIn,
    user
  }
}

const connectedHomePage = connect(mapStateToProps)(MythxLogin)
export { connectedHomePage as MythxLogin }
