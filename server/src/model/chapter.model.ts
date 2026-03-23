import mongoose, { Schema } from "mongoose";
import IChapter from "../interface/IChapter";

const chapterSchema = new Schema<IChapter>({
    Name: {
            type: String,
            required: true
        },
        Duration: {
            type: Number,
            required: true
        },
        Priority: {
            type: Number,
            required: true
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        }
}, {timestamps: true});

const chapterModel = mongoose.model<IChapter>("Chapter", chapterSchema);
export default chapterModel;
