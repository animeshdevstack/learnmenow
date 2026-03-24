"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTopicByChapterIdServer = exports.deletedTopicService = exports.updateTopicService = exports.getByIdTopicService = exports.getAllTopicService = exports.createTopicService = void 0;
const topic_model_1 = __importDefault(require("../model/topic.model"));
const topic_validator_1 = require("../validation/topic.validator");
const createTopicService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ Name, Duration, Priority, chapterId }) {
    try {
        if (!Name || !Duration || !Priority || !chapterId)
            throw new Error("All fields are reauired!");
        const { error } = topic_validator_1.createTopicValidation.validate({ Name, Duration, Priority, chapterId });
        if (error)
            throw new Error("Invalid input");
        const createTopic = new topic_model_1.default({ Name, Duration, Priority, chapterId });
        yield createTopic.save();
        return {
            id: createTopic._id,
            Name: createTopic.Name,
            Duration: createTopic.Duration,
            Priority: createTopic.Priority,
            chapterId: createTopic.chapterId,
        };
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.createTopicService = createTopicService;
const getAllTopicService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTopic = yield topic_model_1.default.find();
        return allTopic.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            chapterId: data.chapterId
        }));
    }
    catch (error) {
        throw new Error(error.message || "Internal server error");
    }
});
exports.getAllTopicService = getAllTopicService;
const getByIdTopicService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Topic id is required!");
    const getTopic = yield topic_model_1.default.findById(id);
    if (!getTopic)
        throw new Error("Invalid id or topic is deleted!");
    return {
        id: getTopic._id,
        Name: getTopic.Name,
        Duration: getTopic.Duration,
        Priority: getTopic.Priority,
        chapterId: getTopic.chapterId,
    };
});
exports.getByIdTopicService = getByIdTopicService;
const updateTopicService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const { error } = topic_validator_1.updateTopicValidation.validate(data);
    if (error)
        throw new Error("Invalid input");
    const updatedTopic = yield topic_model_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTopic)
        throw new Error("No Topic is there whith provided id.");
    return {
        id: updatedTopic._id,
        Name: updatedTopic.Name,
        Duration: updatedTopic.Duration,
        Priority: updatedTopic.Priority,
        chapterId: updatedTopic.chapterId,
    };
});
exports.updateTopicService = updateTopicService;
const deletedTopicService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("Id is required!");
    const deleteTopic = yield topic_model_1.default.findByIdAndDelete(id);
    if (!deleteTopic)
        throw new Error("Topic not found or topic already deletd!");
    return !!deleteTopic;
});
exports.deletedTopicService = deletedTopicService;
const getAllTopicByChapterIdServer = (chapterId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!chapterId)
        throw new Error("Chapter id is required!");
    const allTopic = yield topic_model_1.default.find({ chapterId });
    return allTopic.map(data => ({
        id: data._id,
        Name: data.Name,
        Duration: data.Duration,
        Priority: data.Priority,
        chapterId: data.chapterId
    }));
});
exports.getAllTopicByChapterIdServer = getAllTopicByChapterIdServer;
//# sourceMappingURL=topic.service.js.map