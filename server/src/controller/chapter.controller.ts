import { Request, Response, NextFunction } from "express";
import { createChapterService, deletedChapterService, getAllChapterBySubjectIdService, getAllChapterService, getByIdChapterService, updateChapterService } from "../service/chapter.service";

const createChapter = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { Name, Duration, Priority, subjectId } = req.body;
        const chapterData = await createChapterService({ Name, Duration, Priority, subjectId });

        return res.status(201).json({
            success: true,
            message: "Chapter created successfully.",
            chapterData
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllChapter = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const allChapter = await getAllChapterService();

    return res.status(200).json({
        success: true,
        message: "All chapter fetch successfully",
        allChapter
    });
} catch (error: any) {
    next(error);
}
};

const getByIdChapter = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const getChapter = await getByIdChapterService(id);

    return res.status(200).json({
        success: true,
        message: "successfully get the chapter",
        getChapter
    });
} catch (error: any) {
    next(error);
}
};

const updateChapter = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const updatedChapter = await updateChapterService(id, req.body);
    return res.status(200).json({
        success: true,
        message: "successfully update the chapter",
        updatedChapter
    });
} catch (error: any) {
    next(error);
}
};

const deleteChapter = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const deletedChapter = await deletedChapterService(id);
    return res.status(200).json({
        success: true,
        message: "Chapter deleted successfully",
        deletedChapter
    });
} catch (error: any) {
    next(error);
}
};

const getAllChapterBySubjectId = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { id } = req.params;
        const allChapter = await getAllChapterBySubjectIdService(id);
    
        return res.status(200).json({
            success: true,
            message: "All chapter fetch successfully",
            allChapter
        });
    } catch (error: any) {
        next(error);
    }
    }

export {
    createChapter,
    getAllChapter,
    getByIdChapter,
    updateChapter,
    deleteChapter, 
    getAllChapterBySubjectId
};