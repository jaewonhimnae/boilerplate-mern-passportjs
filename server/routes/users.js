const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const passport = require('passport');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    });
});

router.post("/register", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err)
    }
});

//login
router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            console.log('no user')
            return res.json({ msg: info });
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).json({ loginSuccess: true })
        });
    })(req, res, next);
})

router.get("/logout", auth, async (req, res) => {
    req.logout();
    res.status(200).send({
        success: true
    });
});

module.exports = router;
