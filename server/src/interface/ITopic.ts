/** @format */

import { Types } from "mongoose";

interface interfaceTopic {
  Name: string;
  Duration: number;
  Priority: number;
  chapterId: Types.ObjectId;
}

export default interfaceTopic;
