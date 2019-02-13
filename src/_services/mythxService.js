import config from '../config/config'
import { authHeader } from '../_helpers/auth-header'

export const mythxService = {
  login,
  logout,
  getAnalysationStatus,
  getAnalysationReport,
  submitContractsForAnalysation
}

function login (address, password) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ethAddress: address, password})
  }

  const user = {
    address
  }

  return fetch(`${config.MythX.apiUrl}/auth/login`, requestOptions)
    .then(handleResponse)
    .then(auth => {
      user.auth = auth
      // store user details and jwt token in local storage to keep user logged
      // in between page refreshes
      localStorage.setItem('user', JSON.stringify(user))
      return user
    })
}

function logout () {
  // remove user from local storage to log user out
  try {
    localStorage.removeItem('user')
  } catch (ignore) {

  }
}

function submitContractsForAnalysation (contractFiles, sources) {
  const requestData = {}
  for (let contractFile in contractFiles) {
    if (contractFiles.hasOwnProperty(contractFile)) {
      const contractsList = contractFiles[contractFile]
      const contractName = Object.keys(contractsList)[0]
      const contract = contractsList[contractName]
      requestData[contractFile] = {
        contractName,
        bytecode: contract.evm.bytecode.object,
        deployedBytecode: contract.evm.deployedBytecode.object,
        sourceMap: contract.evm.bytecode.sourceMap,
        deployedSourceMap: contract.evm.deployedBytecode.sourceMap,
        sources: Object.entries(sources).reduce((result, item) => {
          console.log(item)
          result[item[0]] = {
            source: item[1].content
          }
          return result
        }, {}),
        sourceList: Object.keys(sources),
        version: JSON.parse(contract.metadata).compiler.version,
        analysisMode: 'quick'
      }
    }
  }
  const requests = []
  for (const contractFile in requestData) {
    if (requestData.hasOwnProperty(contractFile)) {
      requests.push(createAnalysisRequest(requestData[contractFile]))
    }
  }
  return Promise.all(requests);
}

function getAnalysationStatus (uuid) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  }
  return fetch(`${config.MythX.apiUrl}/analyses/${uuid}`, requestOptions)
    .then(handleResponse)
}

function getAnalysationReport (uuid) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  }
  return fetch(`${config.MythX.apiUrl}/analyses/${uuid}/issues`, requestOptions)
    .then(handleResponse)
}

function createAnalysisRequest (data) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    },
    body: JSON.stringify({data})
  }
  return fetch(`${config.MythX.apiUrl}/analyses`, requestOptions)
    .then(handleResponse)
}

function handleResponse (response) {
  return response.text().then(text => {
    let data = {}
    try {
      data = text && JSON.parse(text)
    } catch (ignored) {

    }
    if (!response.ok) {
      if (response.status === 401) {
        console.log('Logging out')
        // auto logout if 401 response returned from api
        logout()
        window.location.reload(true)
        return Promise.reject('Unauthorized')
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }

    return data
  })
}
