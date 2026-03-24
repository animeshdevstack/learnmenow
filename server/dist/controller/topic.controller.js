"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTopicByChapterId = exports.deleteTopic = exports.updateTopic = exports.getByIdTopic = exports.getAllTopic = exports.createTopic = void 0;
const topic_service_1 = require("../service/topic.service");
const createTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name, Duration, Priority, chapterId } = req.body;
        const topicData = yield (0, topic_service_1.createTopicService)({ Name, Duration, Priority, chapterId });
        return res.status(201).json({
            success: true,
            message: "Topic created successfully.",
            topicData
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createTopic = createTopic;
const getAllTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTopic = yield (0, topic_service_1.getAllTopicService)();
        return res.status(200).json({
            success: true,
            message: "All topic fetch successfully",
            allTopic
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTopic = getAllTopic;
const getByIdTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const getTopic = yield (0, topic_service_1.getByIdTopicService)(id);
        return res.status(200).json({
            success: true,
            message: "successfully get the topic",
            getTopic
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getByIdTopic = getByIdTopic;
const updateTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedTopic = yield (0, topic_service_1.updateTopicService)(id, req.body);
        return res.status(200).json({
            success: true,
            message: "successfully update the topic",
            updatedTopic
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateTopic = updateTopic;
const deleteTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTopic = yield (0, topic_service_1.deletedTopicService)(id);
        return res.status(200).json({
            success: true,
            message: "Topic deleted successfully",
            deletedTopic
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTopic = deleteTopic;
const getAllTopicByChapterId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const allTopic = yield (0, topic_service_1.getAllTopicByChapterIdServer)(id);
        return res.status(200).json({
            success: true,
            message: "All topic fetch successfully",
            allTopic
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTopicByChapterId = getAllTopicByChapterId;
//# sourceMappingURL=topic.controller.js.map