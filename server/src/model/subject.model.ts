import mongoose, { Schema } from "mongoose";
import ISubjectSchema from "../interface/ISubject";

const subjectSchema = new Schema<ISubjectSchema>({
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
    competionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competiton",
        required: true
    }
},
{timestamps: true}
);

const subjectModel = mongoose.model<ISubjectSchema>("Subject", subjectSchema);

export default subjectModel;
