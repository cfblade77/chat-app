const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }


}, {
    timestamps: true
})


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next()
    }

    try {
        const saltRounds = 10; // Number of salt rounds for hashing
        this.password = await bcrypt.hash(this.password, saltRounds);
        next(); // Proceed with the save operation
    } catch (err) {
        next(err); // Pass the error to the next middleware
    }
})


const User = mongoose.model("User", userSchema)
module.exports = User;