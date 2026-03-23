import { Types } from "mongoose";

interface IChapter {
    id?: string | Types.ObjectId;
    Name: string,
    Duration: number,
    Priority: Number,
    subjectId: string | Types.ObjectId;
}

export default IChapter;
