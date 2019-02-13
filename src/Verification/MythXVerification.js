import React from 'react'
import config from '../config/config'
import { connect } from 'react-redux'
import { analysisActions } from '../_actions'
import EventListener from 'react-event-listener'

class MythXVerification extends React.Component {

  handleMessage = (event) => {
    // Only accept trusted origins
    if (config.Remix.trustedOrigins.indexOf(event.origin) === -1) {
      return
    }
    const {action, key, type, value} = JSON.parse(event.data)
    if (action === 'notification' && key === 'compiler' && type === 'compilationFinished' && value[0]) {
      //compilation successful submit for analysation
      this.props.dispatch(analysisActions.analyzeContracts(value[1].contracts, value[2].sources))
    }
  }

  renderIssues (issues) {
    if (issues) {
      issues = issues[0]
    }
    const issueList = []
    for (const issue of issues.issues) {
      for (const location of issue.locations) {
        if (location.sourceList) {
          for (const sourceFile of location.sourceList) {
            issueList.push({
              title: issue.description.head,
              severity: issue.severity,
              description: issue.description.tail,
              lineColumnPos: location.sourceMap,
              filePath: sourceFile,

            })
          }
        } else {
          issueList.push({
            title: issue.description.head,
            severity: issue.severity,
            description: issue.description.tail,
            lineColumnPos: location.sourceMap,
            filePath: issues.sourceList[0]
          })
        }

      }
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Location</th>
            <th>Severity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {
            issueList.map((issue) => {
              return (
                <tr key={issue.title + issue.filePath + issue.lineColumnPos}>
                  <td>{issue.title}</td>
                  <td>{issue.filePath}:{issue.lineColumnPos}</td>
                  <td>{issue.severity}</td>
                  <td>{issue.description}</td>
                </tr>
              )
            })
          }
        </tbody>

      </table>
    )
  }

  render () {
    if (!this.props.isLoggedIn) return null
    let message = null
    if (this.props.isSubmitting) {
      message = 'Submitting compilation result to MythX analysis...'
    }
    if (this.props.isRequestingReport) {
      message = 'Waiting for analysis report...'
    }
    if (message) {
      message = (<p>{message}</p>)
    }
    return (
      <EventListener
        target="window"
        onMessage={this.handleMessage}
      >
        {message}

        {
          Object.keys(this.props.reports).map((uuid) => {
            return (
              <section key={uuid}>
                <hr/>
                <h3>Report id: {uuid}</h3>
                {this.renderIssues(this.props.reports[uuid])}
              </section>
            )
          })
        }


      </EventListener>
    )
  }

}

function mapStateToProps (state) {
  const {authentication, analysis} = state
  return {
    isLoggedIn: authentication.loggedIn,
    isSubmitting: analysis.isSubmitting,
    isRequestingReport: analysis.isRequestingReport,
    reports: analysis.reports
  }
}

const connectedMythixVerification = connect(mapStateToProps)(MythXVerification)
export { connectedMythixVerification as MythXVerification }
