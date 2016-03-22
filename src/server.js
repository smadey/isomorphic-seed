import path from 'path'
import fs from 'fs'

import express from 'express'
import jade from 'jade'
import React from 'react'
import ReactDom from 'react-dom/server'

import db from './core/Database'
import './core/Dispatcher'
import './stores/AppStore'

import { port } from './config'

import App from './components/App'

const server = express()

server.set('port', port)
server.use(express.static(path.join(__dirname, 'public')))

//
// Register API middleware
// -----------------------------------------------------------------------------
// server.use('/api/query', require('./api/query'))

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------

// The top-level React component + HTML template for it
const templatePath = path.join(__dirname, 'views/index.jade')
const template = jade.compile(fs.readFileSync(templatePath, 'utf8'))

server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200

    let data = {
      title: '',
      description: '',
      css: '',
      body: '',
      // js: '/app.js'
    }

    let css = []

    let app = (<App
      path={req.path}
      context={{
        insertCss: value => css.push(value),
        setTitle: value => data.title = value,
        setMeta: (key, value) => data[key] = value,
        onPageNotFound: () => statusCode = 404
      }} />
    )

    data.css = css.join('')
    data.body = ReactDom.renderToString(app)

    let html = template(data)
    res.status(statusCode)
    res.send(html)
  } catch (err) {
    next(err)
  }
})

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  if (process.send) {
    process.send('online');
  } else {
    console.log('The server is running at http://localhost:' + server.get('port'))
  }
})
