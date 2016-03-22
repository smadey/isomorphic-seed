import React, { Component, PropTypes } from 'react'
import emptyFunction from 'fbjs/lib/emptyFunction'

function withContext(ComposedComponent) {
  return class WithContext extends Component {

    static propTypes = {
      context: PropTypes.shape({
        insertCss: PropTypes.func,
        setTitle: PropTypes.func,
        setMeta: PropTypes.func,
        onPageNotFound: PropTypes.func
      })
    }

    static childContextTypes = {
      insertCss: PropTypes.func.isRequired,
      setTitle: PropTypes.func.isRequired,
      setMeta: PropTypes.func.isRequired,
      onPageNotFound: PropTypes.func.isRequired
    }

    getChildContext() {
      let context = this.props.context

      return {
        insertCss: context.insertCss || emptyFunction,
        setTitle: context.setTitle || emptyFunction,
        setMeta: context.setMeta || emptyFunction,
        onPageNotFound: context.onPageNotFound || emptyFunction
      }
    }

    render() {
      let { context, ...other } = this.props
      return <ComposedComponent {...other} />
    }

  };
}

export default withContext
