import express from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { config } from 'dotenv'
import cors from 'cors'
config()

import * as userService from './UserService'

passport.use(
  new BearerStrategy(async function(token, done) {
    const user = await userService.findByToken(token)
    if (!user) return done(null, false)

    return done(null, user)
  })
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env['FACEBOOK_CLIENT_ID'],
      clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
      profileFields: ['id', 'displayName', 'photos', 'email'],
      callbackURL: '/return'
    },
    async function(accessToken, refreshToken, profile, cb) {
      const user = await userService.register({
        email: profile._json.email,
        id: profile.id,
        name: profile._json.name,
        profile_picture: profile._json.picture.data.url,
        token: accessToken
      })

      cb(null, user)
    }
  )
)

// Create a new Express application.
var app = express()
app.use(cors())

// app.use(require('morgan')('combined'))
app.use(require('body-parser').urlencoded({ extended: true }))

app.get(
  '/login/facebook',
  passport.authenticate('facebook', { session: false })
)

app.get(
  '/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false
  }),
  function(req, res) {
    res.redirect(`http://localhost:3000/login?token=${req.user.token}`)
  }
)

app.get(
  '/test',
  passport.authenticate('bearer', { session: false }),

  async (req, res) => {
    res.json({
      foo: 'bar'
    })
  }
)

app.listen(process.env['PORT'] || 5000)
