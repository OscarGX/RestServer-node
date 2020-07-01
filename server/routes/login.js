const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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

module.exports = app;