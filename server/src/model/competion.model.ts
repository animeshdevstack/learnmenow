/** @format */

import mongoose, { Schema } from "mongoose";
import ICompetionSchema from "../interface/ICompetion";

const compititonSchema = new Schema<ICompetionSchema>({
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  Desciption: {
    type: String,
    required: false
  }
}, { timestamps: true });

const competionModel = mongoose.model<ICompetionSchema>("Compititon", compititonSchema);
export default competionModel;
