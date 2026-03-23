/** @format */

import chapterModel from "../model/chapter.model";
import { createChapterValidation, updateChapterValidation } from "../validation/chapter.validator";
import IChapter from "./interface/IChapter";

const createChapterService = async ({ Name, Duration, Priority, subjectId }: IChapter): Promise<IChapter> => {
  try {
    if (!Name || !Duration || !Priority || !subjectId) throw new Error("All fields are reauired!");

    const { error } = createChapterValidation.validate({ Name, Duration, Priority, subjectId });
    if(error) throw new Error("Invalid input");
    
    const createChapter = new chapterModel({ Name, Duration, Priority, subjectId });
    await createChapter.save();

    return {
      id: createChapter._id,
      Name: createChapter.Name,
      Duration: createChapter.Duration,
      Priority: createChapter.Priority,
      subjectId: createChapter.subjectId,
    };

  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getAllChapterService = async (): Promise<IChapter[]> => {
    try {
        const allChapter = await chapterModel.find();
        return allChapter.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            subjectId: data.subjectId
        }));
    } catch (error: any) {
        throw new Error(error.message || "Internal server error");
    }
};


const getByIdChapterService = async(id: string): Promise<IChapter> => {
    if(!id) throw new Error("Competion id is required!");

    const getChapter = await chapterModel.findById(id);
    if(!getChapter) throw new Error("Invalid id or chapter is deleted!");

    return {
      id: getChapter._id,
      Name: getChapter.Name,
      Duration: getChapter.Duration,
      Priority: getChapter.Priority,
      subjectId: getChapter.subjectId,
    };
};

const updateChapterService = async(id: string, data: Partial<IChapter>): Promise<IChapter> => {
    if(!id) throw new Error("Id is required!");

    const { error } = updateChapterValidation.validate(data);
    if(error) throw new Error("Invalid input");

    const updatedChapter = await chapterModel.findByIdAndUpdate(id, data, {new: true});
    if(!updatedChapter) throw new Error("No Chapter is there whith provided id.");
    
    return {
      id: updatedChapter._id,
      Name: updatedChapter.Name,
      Duration: updatedChapter.Duration,
      Priority: updatedChapter.Priority,
      subjectId: updatedChapter.subjectId,
    };
};

const deletedChapterService = async(id: string): Promise<Boolean> => {
    if(!id) throw new Error("Id is required!");

    const deleteChapter = await chapterModel.findByIdAndDelete(id);
    if(!deleteChapter) throw new Error("Chapter not found or chapter already deletd!");

    return !!deleteChapter;
};

const getAllChapterBySubjectIdService = async(subjectId: string): Promise<IChapter[]> => {
  if(!subjectId) throw new Error("Subject id is required!");

  try {
      const allChapter = await chapterModel.find({ subjectId });
      return allChapter.map(data => ({
          id: data._id,
          Name: data.Name,
          Duration: data.Duration,
          Priority: data.Priority,
          subjectId: data.subjectId
      }));
  } catch (error: any) {
      throw new Error(error.message || "Internal server error");
  }
}

export { 
    createChapterService,
    getAllChapterService,
    getByIdChapterService,
    updateChapterService,
    deletedChapterService,
    getAllChapterBySubjectIdService
 };
