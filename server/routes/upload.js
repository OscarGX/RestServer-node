const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const Producto = require('../models/producto');

app.use(fileUpload({
    useTempFiles: true
}));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(500).json({
            ok: false,
            err: 'No hay archivos'
        });
    }
    let file = req.files.data;
    let nameSplit = file.name.split('.');
    let ext = nameSplit[nameSplit.length - 1];
    let validExt = ['png', 'jpg', 'jpeg', 'gif'];
    let validCollections = ['products', 'users'];
    if (validCollections.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: `Los tipos permitidos son: ${validCollections.join(', ')}`,
            tipo
        });
    }
    if (validExt.indexOf(ext) < 0) {
        return res.status(400).json({
            ok: false,
            err: `Las extensiones permitidas son: ${validExt.join(', ')}`,
            extension: ext
        });
    }
    let fileName = `${id}-${new Date().getMilliseconds()}.${ext}`;
    file.mv(`uploads/${tipo}/${fileName}`, (err) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        } else if (tipo === 'products') {
            productImage(res, fileName, id);
        } else {
            userImage(res, fileName, id);
        }
    });
});

function userImage(res, fileName, id) {
    User.findById(id, (err, dbUser) => {
        if (err) {
            deleteImg(fileName, 'users');
            res.status(500).json({
                ok: false,
                err
            });
        } else if (dbUser) {
            deleteImg(dbUser.img, 'users');
            dbUser.img = fileName;
            dbUser.save((err, userUpdated) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        usuario: userUpdated
                    });
                }
            });
        } else {
            deleteImg(fileName, 'users');
            res.status(400).json({
                ok: false,
                err: 'Id inválido'
            });
        }
    });
}

function productImage(res, fileName, id) {
    Producto.findById(id, (err, dbProduct) => {
        if (err) {
            deleteImg(fileName, 'products');
            res.status(500).json({
                ok: false,
                err
            });
        } else if (dbProduct) {
            deleteImg(dbProduct.img, 'products');
            dbProduct.img = fileName;
            dbProduct.save((err, productUpdated) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    });
                } else {
                    res.json({
                        ok: true,
                        producto: productUpdated
                    });
                }
            });
        } else {
            deleteImg(fileName, 'products');
            res.status(400).json({
                ok: false,
                err: 'Id inválido'
            });
        }
    });
}

function deleteImg(userImage, folder) {
    let imagePath = path.resolve(__dirname, `../../uploads/${folder}/${userImage}`);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
}

module.exports = app;