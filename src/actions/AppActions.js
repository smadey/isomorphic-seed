import request from 'superagent'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

import ActionTypes from '../constants/ActionTypes'
import Dispatcher from '../core/Dispatcher'

export default {

  navigateTo(path, options) {
    this.loadPage(path, () => {
      if (canUseDOM) {
        if (options && options.replace) {
          window.history.replaceState({}, document.title, path)
        } else {
          window.history.pushState({}, document.title, path)
        }
      }

      Dispatcher.dispatch({
        type: ActionTypes.CHANGE_LOCATION,
        path
      })
    })
  },

  loadPage(path, cb) {
    Dispatcher.dispatch({
      type: ActionTypes.GET_PAGE,
      path
    })

    request.get('/api/query?path=' + encodeURI(path))
      .accept('application/json')
      .end((err, res) => {
        Dispatcher.dispatch({
          type: ActionTypes.RECEIVE_PAGE,
          path,
          err,
          page: res ? res.body : null
        })

        if (typeof cb === 'function') {
          cb()
        }
      })
  }

}
