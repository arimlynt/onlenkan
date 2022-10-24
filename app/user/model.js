const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const HASH_ROUND = 10;

let userSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name harus diisi']
    },
    email: {
        type: String,
        require: [true, 'Email harus diisi']
    },
    password: {
        type: String,
        require: [true, 'Password harus diisi']
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'admin'
    },
    foto: {
        type: String
    }
},
    { timestamps: true }
);

userSchema.path('email').validate(async function (value){
    try {
        const count = await this.model('User').countDocuments({email: value})
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`)

userSchema.pre('save', function (next) {
    this.password = bycrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('User', userSchema);