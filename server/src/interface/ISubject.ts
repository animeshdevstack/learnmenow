/** @format */

import { Types } from "mongoose";

interface ISubjectSchema {
  Name: string;
  Duration:Number;
  Priority: Number;
  competionId: Types.ObjectId;
}

export default ISubjectSchema;
