import { Request, Response, NextFunction } from "express";
import { createSubjectService, deletedSubjectService, getAllSubjectByCompitionIdService, getAllSubjectService, getByIdSubjectService, updateSubjectService } from "../service/subject.service";

const createSubject = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { Name, Duration, Priority, competionId } = req.body;
        const subjectData = await createSubjectService({ Name, Duration, Priority, competionId });

        return res.status(201).json({
            success: true,
            message: "subject created successfully.",
            subjectData
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllSubject = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const allsubject = await getAllSubjectService();

    return res.status(200).json({
        success: true,
        message: "All subject fetch successfully",
        allsubject
    });
} catch (error: any) {
    next(error);
}
};

const getByIdSubject = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const getSubject = await getByIdSubjectService(id);

    return res.status(200).json({
        success: true,
        message: "successfully get the subject",
        getSubject
    });
} catch (error: any) {
    next(error);
}
};

const updateSubject = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const updatedSubject = await updateSubjectService(id, req.body);
    return res.status(200).json({
        success: true,
        message: "successfully update the subject",
        updatedSubject
    });
} catch (error: any) {
    next(error);
}
};

const deleteSubject = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const deletedSubject = await deletedSubjectService(id);
    return res.status(200).json({
        success: true,
        message: "Subject deleted successfully",
        deletedSubject
    });
} catch (error: any) {
    next(error);
}
};

const getAllSubjectByCompition = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const allsubject = await getAllSubjectByCompitionIdService(id);
    
        return res.status(200).json({
            success: true,
            message: "All subject fetch successfully",
            allsubject
        });
    } catch (error: any) {
        next(error);
    }
    }

export {
    createSubject,
    getAllSubject,
    getByIdSubject,
    updateSubject,
    deleteSubject, 
    getAllSubjectByCompition
};