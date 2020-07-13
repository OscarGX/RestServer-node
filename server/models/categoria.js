const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es requerido']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: 'El valor para {PATH} ya existe, ingrese uno diferente' });

module.exports = mongoose.model('Categoria', categoriaSchema);