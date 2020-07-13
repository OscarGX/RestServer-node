const express = require('express');
const app = express();
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const Categoria = require('../models/categoria');

app.get('/categorias', verifyToken, (req, res) => {
    Categoria.find({}).sort('description').populate('user', 'name email').exec((err, categories) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                total: categories.length,
                categorias: categories
            });
        }
    });

});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id).populate('user').exec((err, category) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (category) {
            res.json({
                ok: true,
                categoria: category
            });
        } else {
            res.status(400).json({
                ok: false,
                err: 'El id de la categoría no es válido'
            });
        }
    });
});

app.post('/categoria', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;
    let userId = req.usuario._id;
    let category = new Categoria({
        description: body.description,
        user: userId
    });
    category.save((err, dbCategory) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: dbCategory
        });
    });
});

app.put('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let categoryDesc = {
        description: body.description
    }
    Categoria.findByIdAndUpdate(id, categoryDesc, { new: true, runValidators: true, context: 'query' }, (err, dbCat) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!dbCat) {
            return res.status(400).json({
                ok: false,
                err: 'El id de la categoria no es válido'
            });
        }
        res.json({
            ok: true,
            categoria: dbCat
        });
    });
});

app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove({ _id: id }, (err, catDeleted) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (catDeleted) {
            res.json({
                ok: true,
                categoria: catDeleted
            });
        } else {
            res.status(400).json({
                ok: false,
                err: 'El id no es válido'
            });
        }
    });
});

app.delete('/test/:id', (req, resp) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove({ _id: id }, (err, dbCat) => {
        if (err) {
            resp.status(500).json({
                ok: false,
                err
            });;
        } else if (dbCat) {
            resp.json({
                ok: true,
                categoria: dbCat
            });
        } else {
            resp.status(400).json({
                ok: false,
                err: 'Id inválido'
            });
        }
    });
});

module.exports = app;