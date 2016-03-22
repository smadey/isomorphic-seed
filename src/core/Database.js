import fs from 'fs'
import path from 'path'

import jade from 'jade'
import frontMatter from 'front-matter'

import Dispatcher from './Dispatcher'
import ActionTypes from '../constants/ActionTypes'

// A folder with Jade/Markdown/HTML content pages
const CONTENT_DIR = path.join(__dirname, '../content')

// Check if that directory exists, print an error message if not
fs.exists(CONTENT_DIR, (exists) => {
  if (!exists) {
    console.error(`Error: Directory '${CONTENT_DIR}' does not exist.`)
  }
})

export default {

  getPage: (uri) => {
    // Read page content from a Jade file
    return new Promise((resolve) => {
      let fileName = (uri === '/' ? '/index' : uri) + '.jade'
      let filePath = path.join(CONTENT_DIR, fileName)

      readFile(filePath, (err, jadeContent) => {
        if (err) {
          filePath = path.join(CONTENT_DIR, uri + '/index.jade')

          readFile(filePath, (err, jadeContent) => {
            resolve(err ? null : getPageFromJadeContent(jadeContent))
          })
        } else {
          resolve(getPageFromJadeContent(jadeContent))
        }
      })
    }).then((page) => {
      Dispatcher.dispatch({
        type: ActionTypes.RECEIVE_PAGE,
        page: page
      })

      return Promise.resolve(page)
    })

    function getPageFromJadeContent(jadeContent) {
      let content = frontMatter(jadeContent)
      let html = jade.render(content.body, null, '  ')

      return Object.assign({path: uri, content: html}, content.attributes)
    }
  }

}

function readFile(file, callback) {
  fs.readFile(file, {encoding: 'utf8'}, callback)
}
