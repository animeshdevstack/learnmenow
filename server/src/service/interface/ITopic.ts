import { Types } from "mongoose";

interface ITopic {
    id?: string | Types.ObjectId,
    Name: string,
    Duration: number,
    Priority: Number,
    chapterId: string | Types.ObjectId;
}

export default ITopic;
