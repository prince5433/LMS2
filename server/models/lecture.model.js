import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    videoUrl: {
        type: String,
        default: "",
    },
    publicId: {
        type: String,
        default: "",
    },
    isPreviewFree: {
        type: Boolean,
        default: false,
    },
    duration: {
        type: String,
        default: "",
    },
},
    {timestamps: true}
);


export const Lecture = mongoose.model("Lecture", lectureSchema);