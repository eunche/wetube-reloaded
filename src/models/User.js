import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    location: { type: String },
    isGithubLogin: { type: Boolean, default: false },
    avatarURL: { type: String },
})

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model("User", userSchema);


export default User;