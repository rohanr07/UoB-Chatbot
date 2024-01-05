import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        provider: {
            type: String,
            required: false,
        },
        isVerified: {
            type: Boolean,
            required: false, // verification not required for Google or GitHub
        },
        verificationToken: {
            type: String,
            required: false, // token not required for Google or GitHub
        },

    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
