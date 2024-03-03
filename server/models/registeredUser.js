import mongoose from 'mongoose';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const registereduserSchema = mongoose.Schema({
    fullname: {type: String , index: true},
    email: { type: String, required: true, unique:true},
    password: { type: String},
    phone_number: { type: String,unique: true},
    avatar:{type: String},
    coverImage: {type: String},
    name: { type: String },
    desc: { type: String },
    joinedOn: { type: Date, default: Date.now },
    refreshToken: {type: String}
}, {
    timestamps: true
}
)

registereduserSchema.pre("save", async function (next){
    if(this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

registereduserSchema.methods.isPassworCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

registereduserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )
}

registereduserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export default mongoose.model("RegisteredUser", registereduserSchema)