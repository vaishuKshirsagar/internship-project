import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    videoId: String,
    userId: String,
    commentBody: String,
    userCommented: String,
    CommentOn: {type: Date, default: Date.now},
    userLocation: { type: Object }
})

export default mongoose.model("Comments", commentSchema)