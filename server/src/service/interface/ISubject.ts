import { Types } from "mongoose";

interface ISubject {
    id?: string | Types.ObjectId;
    Name: string,
    Duration: Number,
    Priority: Number,
    competionId: string | Types.ObjectId;
}

export default ISubject;
