/** @format */

import { get } from "mongoose";
import subjectModel from "../model/subject.model";
import { createSubjectValidation, updateSubjectValidation } from "../validation/subject.validator";
import ISubject from "./interface/ISubject";

const createSubjectService = async ({ Name, Duration, Priority, competionId }: ISubject): Promise<ISubject> => {
  try {
    if (!Name || !Duration || !Priority || !competionId) throw new Error("All fields are reauired!");

    const { error } = createSubjectValidation.validate({ Name, Duration, Priority, competionId });
    if(error) throw new Error("Invalid input");
    
    const createSubject = new subjectModel({ Name, Duration, Priority, competionId });
    await createSubject.save();

    return {
      Name: createSubject.Name,
      Duration: createSubject.Duration,
      Priority: createSubject.Priority,
      competionId: createSubject.competionId,
    };

  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getAllSubjectService = async (): Promise<ISubject[]> => {
    try {
        const allCompetion = await subjectModel.find();
        return allCompetion.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            competionId: data.competionId
        }));
    } catch (error: any) {
        throw new Error(error.message || "Internal server error");
    }
};


const getByIdSubjectService = async(id: string): Promise<ISubject> => {
    if(!id) throw new Error("Competion id is required!");

    const getCompetion = await subjectModel.findById(id);
    if(!getCompetion) throw new Error("Invalid id or competion is deleted!");

    return {
      id: getCompetion._id,
      Name: getCompetion.Name,
      Duration: getCompetion.Duration,
      Priority: getCompetion.Priority,
      competionId: getCompetion.competionId,
    };
};

const updateSubjectService = async(id: string, data: Partial<ISubject>): Promise<ISubject> => {
    if(!id) throw new Error("Id is required!");

    const { error } = updateSubjectValidation.validate(data);
    if(error) throw new Error("Invalid input");

    const updatedCompetion = await subjectModel.findByIdAndUpdate(id, data, {new: true});
    if(!updatedCompetion) throw new Error("No Competion is there whith provided id.");
    
    return {
      Name: updatedCompetion.Name,
      Duration: updatedCompetion.Duration,
      Priority: updatedCompetion.Priority,
      competionId: updatedCompetion.competionId,
    };
};

const deletedSubjectService = async(id: string): Promise<Boolean> => {
    if(!id) throw new Error("Id is required!");

    const deleteCompetion = await subjectModel.findByIdAndDelete(id);
    if(!deleteCompetion) throw new Error("Competion not found or competion already deletd!");

    return !!deleteCompetion;
};

const getAllSubjectByCompitionIdService = async(competionId: string): Promise<ISubject[]> => {
  if(!competionId) throw new Error("Competion id is required!");

  try {
    const subjects = await subjectModel.find({ competionId });
    return subjects.map(data => ({
      id: data._id,
      Name: data.Name,
      Duration: data.Duration,
      Priority: data.Priority,
      competionId: data.competionId
    }));
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

export { 
    createSubjectService,
    getAllSubjectService,
    getByIdSubjectService,
    updateSubjectService,
    deletedSubjectService,
    getAllSubjectByCompitionIdService
 };
