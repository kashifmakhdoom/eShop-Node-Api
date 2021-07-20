const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 120,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 120,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        default: '',
        trim: true
    },
    apartment: {
        type: String,
        default: '',
        trim: true
    },
    zip: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: '',
        uppercase: true,
        validate: {
            validator: function(city) {
                //TODO: validate city from list of cities for the given country
                return true
            },
            message: ''
        }
    },
    country: {
        type: String,
        default: '',
        uppercase: true,
        validate: {
            validator: function(country) {
                //TODO: validate country from the list of countries
                return true;
            },
            message: ''
        }
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
})

function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(120).required(),
        email: Joi.string().min(3).max(120).required().email(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        zip: Joi.string().optional(),
        street: Joi.string().optional(),
        apartment: Joi.string().optional(),
        city: Joi.string().optional(),
        country: Joi.string().optional(),
        isAdmin: Joi.boolean().optional(),
    }

    return Joi.validate(user, schema)
}

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            id: this._id,
            isAdmin: this.isAdmin,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
    )
    return token;
}

/*
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});
*/

exports.userSchema = userSchema
exports.User = mongoose.model('users', userSchema)
exports.validate = validateUser
