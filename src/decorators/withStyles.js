import React, { Component, PropTypes } from 'react'
import invariant from 'fbjs/lib/invariant'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

let count = 0

function withStyles(styles) {
  return (ComposedComponent) => class WithStyles extends Component {

    static contextTypes = {
      insertCss: PropTypes.func
    }

    constructor() {
      super()

      this.refCount = 0

      ComposedComponent.prototype.renderCss = function (css) {
        let style

        if (canUseDOM) {
          if (this.styleId && (style = document.getElementById(this.styleId))) {
            if ('textContent' in style) {
              style.textContent = css
            } else {
              style.styleSheet.cssText = css
            }
          } else {
            this.styleId = `dynamic-css-${count++}`

            style = document.createElement('style')
            style.setAttribute('id', this.styleId)
            style.setAttribute('type', 'text/css')

            if ('textContent' in style) {
              style.textContent = css
            } else {
              style.styleSheet.cssText = css
            }

            document.getElementsByTagName('head')[0].appendChild(style)
            this.refCount++
          }
        } else {
          this.context.insertCss(css)
        }
      }.bind(this)
    }

    componentWillMount() {
      if (canUseDOM) {
        invariant(styles.use, `The style-loader must be configured with reference-counted API.`)

        styles.use()
      } else {
        this.context.insertCss(styles.toString())
      }
    }

    componentWillUnmount() {
      styles.unuse()

      if (this.styleId) {
        this.refCount--
        if (this.refCount < 1) {
          let style = document.getElementById(this.styleId)
          if (style) {
            style.parentNode.removeChild(style)
          }
        }
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }

  }
}

export default withStyles
