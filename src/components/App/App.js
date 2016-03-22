import React, { Component, PropTypes } from 'react'

import withContext from '../../decorators/withContext'
import withStyles from '../../decorators/withStyles'

import AppActions from '../../actions/AppActions'
import AppStore from '../../stores/AppStore'

import styles from './App.scss'

@withContext
@withStyles(styles)
class App extends Component {

  static propTypes = {
    path: PropTypes.string.isRequired
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState)
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.path !== nextProps.path
  }

  render() {
    return (
      <h1>Hello Isomorphic</h1>
    )
  }

  handlePopState(event) {
    AppActions.navigateTo(window.location.pathname, {replace: !!event.state})
  }

}

export default App
