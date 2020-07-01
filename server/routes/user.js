const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

app.get('/users', verifyToken, (req, res) => {
    let limit = req.query.limit || 5;
    limit = Number(limit);
    let from = req.query.from || 0;
    from = Number(from);

    User.find({ state: true }, 'role state google name email img').skip(from).limit(limit).exec((err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        User.countDocuments({ state: true }, (err, count) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                total: count,
                users
            });
        });
    });
});

app.get('/user/:id', (req, res) => {
    res.json('search by id');
})

app.post('/user', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);
    let id = req.params.id;
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err || userDB === null) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let changeState = {
        state: false
    };
    //User.findByIdAndRemove(id, (err, userDeleted) => {
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: 'El id del usuario no es válido'
            });
        }
        res.json({
            ok: true,
            user: userDeleted
        });
    });
});

module.exports = app;