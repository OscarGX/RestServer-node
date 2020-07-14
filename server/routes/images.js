const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const { verifyImgToken } = require('../middlewares/auth');

app.get('/imagen/:tipo/:img', verifyImgToken, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let imagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = app;