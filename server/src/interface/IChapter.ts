/** @format */

import { Types } from "mongoose";

interface IChapter {
  Name: string;
  Duration: number;
  Priority: number;
  subjectId: string | Types.ObjectId;
}

export default IChapter;
