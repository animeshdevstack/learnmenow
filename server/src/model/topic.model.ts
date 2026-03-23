import mongoose, { Schema } from "mongoose";
import interfaceTopic from "../interface/ITopic";

const topicSchema = new Schema<interfaceTopic>({
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
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true
        }
}, {timestamps: true});

const topicModel = mongoose.model<interfaceTopic>("Topic", topicSchema);
export default topicModel;
