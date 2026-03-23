/** @format */

import topicModel from "../model/topic.model";
import { createTopicValidation, updateTopicValidation } from "../validation/topic.validator";
import ITopic from "./interface/ITopic";

const createTopicService = async ({ Name, Duration, Priority, chapterId }: ITopic): Promise<ITopic> => {
  try {
    if (!Name || !Duration || !Priority || !chapterId) throw new Error("All fields are reauired!");

    const { error } = createTopicValidation.validate({ Name, Duration, Priority, chapterId });
    if(error) throw new Error("Invalid input");
    
    const createTopic = new topicModel({ Name, Duration, Priority, chapterId });
    await createTopic.save();

    return {
      id: createTopic._id,
      Name: createTopic.Name,
      Duration: createTopic.Duration,
      Priority: createTopic.Priority,
      chapterId: createTopic.chapterId,
    };

  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
};

const getAllTopicService = async (): Promise<ITopic[]> => {
    try {
        const allTopic = await topicModel.find();
        return allTopic.map(data => ({
            id: data._id,
            Name: data.Name,
            Duration: data.Duration,
            Priority: data.Priority,
            chapterId: data.chapterId
        }));
    } catch (error: any) {
        throw new Error(error.message || "Internal server error");
    }
};


const getByIdTopicService = async(id: string): Promise<ITopic> => {
    if(!id) throw new Error("Topic id is required!");

    const getTopic = await topicModel.findById(id);
    if(!getTopic) throw new Error("Invalid id or topic is deleted!");

    return {
      id: getTopic._id,
      Name: getTopic.Name,
      Duration: getTopic.Duration,
      Priority: getTopic.Priority,
      chapterId: getTopic.chapterId,
    };
};

const updateTopicService = async(id: string, data: Partial<ITopic>): Promise<ITopic> => {
    if(!id) throw new Error("Id is required!");

    const { error } = updateTopicValidation.validate(data);
    if(error) throw new Error("Invalid input");

    const updatedTopic = await topicModel.findByIdAndUpdate(id, data, {new: true});
    if(!updatedTopic) throw new Error("No Topic is there whith provided id.");
    
    return {
      id: updatedTopic._id,
      Name: updatedTopic.Name,
      Duration: updatedTopic.Duration,
      Priority: updatedTopic.Priority,
      chapterId: updatedTopic.chapterId,
    };
};

const deletedTopicService = async(id: string): Promise<Boolean> => {
    if(!id) throw new Error("Id is required!");

    const deleteTopic = await topicModel.findByIdAndDelete(id);
    if(!deleteTopic) throw new Error("Topic not found or topic already deletd!");

    return !!deleteTopic;
};

const getAllTopicByChapterIdServer = async(chapterId: string): Promise<ITopic[]> => {
    if(!chapterId) throw new Error("Chapter id is required!");  
    const allTopic = await topicModel.find({chapterId});
    return allTopic.map(data => ({
        id: data._id,
        Name: data.Name,
        Duration: data.Duration,
        Priority: data.Priority,
        chapterId: data.chapterId
    }));
}

export { 
    createTopicService,
    getAllTopicService,
    getByIdTopicService,
    updateTopicService,
    deletedTopicService,
    getAllTopicByChapterIdServer
 };
