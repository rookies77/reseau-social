const mongoose = require('mongoose');
const { isEmail } = require('Validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 55,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6,
        },
        picture: {
            type: String,
            default: "./uploads/profil/random-user.png"
        },
        bio: {
            type: String,
            max: 1024
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        like: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

// Play function before save into display: 'block'
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
    // bcrypt.genSalt(10, function(err, salt) { //  2e maniere de faire
    //     bcrypt.hash(this.password, salt, function(err, hash) {
    //         // Store hash in your password DB.
    //         console.log(' err:', err);
    //         console.log('hash :', hash);
    //     });
    // });
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password')
    }
    throw Error('Incorrect Email')
}
const UserModel = mongoose.model('user', userSchema)//user est la collection de la BDD
module.exports = UserModel;