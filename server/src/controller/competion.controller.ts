import { Request, Response, NextFunction } from "express";
import { createCompitionService, deletedCompetionService, getAllCompetionService, getByIdCompitionService, updateCompetionService } from "../service/compition.service";

const createCompetition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { Name, Desciption } = req.body;
        const compititonName = await createCompitionService(Name, Desciption);        

        return res.status(201).json({
            success: true,
            message: "Competion created successfully.",
            compititonName
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllCompetition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const allCompetion = await getAllCompetionService();

    return res.status(200).json({
        success: true,
        message: "All competion exams fetch successfully",
        allCompetion
    });
} catch (error: any) {
    next(error);
}
};

const getByIdCompetition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const getCompetion = await getByIdCompitionService(id);

    return res.status(200).json({
        success: true,
        message: "successfully get the competion",
        getCompetion
    });
} catch (error: any) {
    next(error);
}
};

const updateCompetition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const updatedCompition = await updateCompetionService(id, req.body);
    return res.status(200).json({
        success: true,
        message: "successfully update the competion",
        updatedCompition
    });
} catch (error: any) {
    next(error);
}
};

const deleteCompetition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const deletedCompetion = await deletedCompetionService(id);
    return res.status(200).json({
        success: true,
        message: "Competion deleted successfully",
        deletedCompetion
    });
} catch (error: any) {
    next(error);
}
};

export {
    createCompetition,
    getAllCompetition,
    getByIdCompetition,
    updateCompetition,
    deleteCompetition, 
};