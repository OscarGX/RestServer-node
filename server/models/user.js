const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe, ingrese uno diferente' });

module.exports = mongoose.model('User', userSchema);