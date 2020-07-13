const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let productoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    unitPrice: { type: Number, required: [true, 'El precio unitario es necesario'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Producto', productoSchema);