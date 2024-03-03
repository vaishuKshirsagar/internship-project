import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique:true},
    name: { type: String },
    desc: { type: String },
    joinedOn: { type: Date, default: Date.now }
}, {
    timestamps: true
}
)
export default mongoose.model("User", userSchema)