const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { db } = require('../models/user');
const client = new OAuth2Client(process.env.CLIENT_ID_GOOGLE);

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                err: 'Correo o contraseña incorrectos'
            });
        }

        if (!bcrypt.compareSync(req.body.password, dbUser.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Correo o contraseña incorrectos'
            });
        }
        let token = jwt.sign({
            user: dbUser
        }, process.env.TOKEN_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
        res.json({
            ok: true,
            token,
            user: dbUser
        });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID_GOOGLE, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });
    User.findOne({ email: googleUser.email }, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (dbUser && dbUser.google) {
            let token = jwt.sign({
                user: dbUser
            }, process.env.TOKEN_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
            return res.json({
                ok: true,
                token,
                user: dbUser
            });
        } else if (!dbUser) {
            //db
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = googleUser.google;
            user.password = ':)';
            user.save((err, dbUserSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user: dbUserSaved
                }, process.env.TOKEN_KEY, { expiresIn: process.env.TOKEN_EXPIRES });
                return res.json({
                    ok: true,
                    token,
                    user: dbUserSaved
                });
            });
        } else {
            return res.status(400).json({
                ok: false,
                err: 'Debe usar el método de autenticación normal'
            });
        }
    });
});

module.exports = app;