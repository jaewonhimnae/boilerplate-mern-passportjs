const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
// const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth20');\
const moment = require('moment');
const config = require('../config/key');
const { User } = require("../models/User");


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
            return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, { msg: 'Invalid email or password.' });
        });
    });
}));

/**
 * Sign in with Google.
 */
const googleStrategyConfig = new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, params, profile, done) => {
    console.log('req.user', req.user)
    if (req.user) {
        User.findOne({ google: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser && (existingUser.id !== req.user.id)) {
                done(err);
            } else {
                User.findById(req.user.id, (err, user) => {
                    if (err) { return done(err); }
                    user.google = profile.id;
                    user.tokens.push({
                        kind: 'google',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ google: profile.id }, (err, existingUser) => {

            if (err) { return done(err); }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
                if (err) { return done(err); }
                if (existingEmailUser) {
                    done(err);
                } else {
                    const user = new User();
                    user.email = profile.emails[0].value;
                    user.google = profile.id;
                    user.tokens.push({
                        kind: 'google',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
});
passport.use('google', googleStrategyConfig);



