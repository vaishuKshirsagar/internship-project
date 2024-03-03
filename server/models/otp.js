import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    otpEpiration:{
        type:Date,
        default: Date.now,
        get:(otpExpiration) => otpExpiration.getTime(),
        set:(otpExpiration) => new Date(otpExpiration)
    }
})

export default mongoose.model('Otp',otpSchema);