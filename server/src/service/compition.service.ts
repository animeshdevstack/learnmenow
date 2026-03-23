/** @format */

import competionModel from "../model/competion.model";
import { createCompetionValidation, updateCompetionValidation } from "../validation/compition.validator";
import { ICompetion } from "./interface/ICompetionService";

const createCompitionService = async (Name: ICompetion, Desciption: ICompetion): Promise<ICompetion> => {
  try {
    if (!Name) throw new Error("Compitition Name is reauired!");

    const { error } = createCompetionValidation.validate({ Name });
    if(error) throw new Error("Invalid input");

    const createCompition = new competionModel({ Name, Desciption });
    await createCompition.save();

    return {
      id: createCompition._id.toString(),
      Name: createCompition.Name,
      Desciption: createCompition.Desciption
    };

  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getAllCompetionService = async (): Promise<ICompetion[]> => {
    try {
        const allCompetion = await competionModel.find();
        return allCompetion.map(data => ({
            id: data._id.toString(),
            Name: data.Name,
            Desciption: data.Desciption
        }));
    } catch (error: any) {
        throw new Error(error.message || "Internal server error");
    }
};


const getByIdCompitionService = async(id: string): Promise<ICompetion> => {
    if(!id) throw new Error("Competion id is required!");

    const getCompetion = await competionModel.findById(id);
    if(!getCompetion) throw new Error("Invalid id or competion is deleted!");

    return {
        id: getCompetion?._id.toString(),
        Name: getCompetion?.Name,
        Desciption: getCompetion?.Desciption
    };
};

const updateCompetionService = async(id: string, data: Partial<ICompetion>): Promise<ICompetion> => {
    if(!id) throw new Error("Id is required!");

    const { error } = updateCompetionValidation.validate(data);
    if(error) throw new Error("Invalid input");

    const updatedCompetion = await competionModel.findByIdAndUpdate(id, data, {new: true});
    if(!updatedCompetion) throw new Error("No Competion is there whith provided id.");
    
    return {
        id: updatedCompetion?._id.toString(),
        Name: updatedCompetion?.Name,
        Desciption: updatedCompetion?.Desciption
    };
};

const deletedCompetionService = async(id: string): Promise<Boolean> => {
    if(!id) throw new Error("Id is required!");

    const deleteCompetion = await competionModel.findByIdAndDelete(id);
    if(!deleteCompetion) throw new Error("Competion not found or competion already deletd!");

    return !!deleteCompetion;
};

export { createCompitionService, getAllCompetionService, getByIdCompitionService, updateCompetionService, deletedCompetionService };
