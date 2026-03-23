import { Request, Response, NextFunction } from "express";
import { createTopicService, deletedTopicService, getAllTopicByChapterIdServer, getAllTopicService, getByIdTopicService, updateTopicService } from "../service/topic.service";

const createTopic = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { Name, Duration, Priority, chapterId } = req.body;
        const topicData = await createTopicService({ Name, Duration, Priority, chapterId });

        return res.status(201).json({
            success: true,
            message: "Topic created successfully.",
            topicData
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllTopic = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const allTopic = await getAllTopicService();

    return res.status(200).json({
        success: true,
        message: "All topic fetch successfully",
        allTopic
    });
} catch (error: any) {
    next(error);
}
};

const getByIdTopic = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const getTopic = await getByIdTopicService(id);

    return res.status(200).json({
        success: true,
        message: "successfully get the topic",
        getTopic
    });
} catch (error: any) {
    next(error);
}
};

const updateTopic = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const updatedTopic = await updateTopicService(id, req.body);
    return res.status(200).json({
        success: true,
        message: "successfully update the topic",
        updatedTopic
    });
} catch (error: any) {
    next(error);
}
};

const deleteTopic = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const deletedTopic = await deletedTopicService(id);
    return res.status(200).json({
        success: true,
        message: "Topic deleted successfully",
        deletedTopic
    });
} catch (error: any) {
    next(error);
}
};

const getAllTopicByChapterId = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
try {
    const { id } = req.params;
    const allTopic = await getAllTopicByChapterIdServer(id);

    return res.status(200).json({
        success: true,
        message: "All topic fetch successfully",
        allTopic
    });
} catch (error: any) {
    next(error);
}
}

export {
    createTopic,
    getAllTopic,
    getByIdTopic,
    updateTopic,
    deleteTopic, 
    getAllTopicByChapterId
};