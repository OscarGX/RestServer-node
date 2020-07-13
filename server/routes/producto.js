const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/auth');
const Producto = require('../models/producto');

app.get('/productos', verifyToken, (req, res) => {
    let limit = req.query.limit ? Number(req.query.limit) : 5;
    let from = req.query.from ? Number(req.query.from) : 0;
    Producto.find({ available: true }).skip(from).limit(limit).populate('category', 'description').populate('user', 'name email').exec((err, products) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else {
            Producto.countDocuments({ available: true }, (err, count) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        total: count,
                        productos: products
                    });
                }
            });
        }
    });
});

app.get('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Producto.findOne({ $and: [{ available: true }, { _id: id }] }).populate('category', 'description').populate('user', 'name email').exec((err, product) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (product) {
            res.json({
                ok: true,
                producto: product
            });
        } else {
            res.status(400).json({
                ok: false,
                err: 'Id del producto inválido'
            });
        }
    });
});

app.get('/productos/search/:query', (req, res) => {
    let query = req.params.query;
    let regex = new RegExp(query, 'i');
    Producto.find({ name: regex, available: true }).populate('category', 'description').exec((err, productos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                productos
            });
        }
    });
});

app.post('/producto', verifyToken, (req, res) => {
    let body = req.body;
    let product = new Producto({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.usuario._id
    });
    product.save((err, dbProduct) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                producto: dbProduct
            });
        }
    });
});

app.put('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let product = {
        name: body.name,
        unitPrice: Number(body.unitPrice),
        description: body.description
    };
    Producto.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, dbProduct) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (dbProduct) {
            res.json({
                ok: true,
                producto: dbProduct
            });
        } else {
            res.status(400).json({
                ok: false,
                err: 'Id de producto inválido'
            });
        }
    });
});

app.delete('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let product = {
        available: false
    };
    Producto.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, dbProduct) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (dbProduct) {
            res.json({
                ok: true,
                producto: dbProduct
            });
        } else {
            res.status(400).json({
                ok: false,
                err: 'Id del producto inválido'
            });
        }
    });
});

module.exports = app;