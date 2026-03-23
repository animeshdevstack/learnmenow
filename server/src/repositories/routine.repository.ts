import mongoose from "mongoose";
import topicModel from "../model/topic.model";

export const getTopicsWithChapterAndSubject = async (
  topicIds: string[],
  competitionId: string
) => {
  const topicObjectIds = topicIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  return topicModel.aggregate([
    {
      $match: {
        _id: { $in: topicObjectIds }
      }
    },
    {
      $lookup: {
        from: "chapters",
        localField: "chapterId",
        foreignField: "_id",
        as: "chapter"
      }
    },
    {
      $unwind: {
        path: "$chapter",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "subjects",
        localField: "chapter.subjectId",
        foreignField: "_id",
        as: "subject"
      }
    },
    {
      $unwind: {
        path: "$subject",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: {
        "subject.competionId": new mongoose.Types.ObjectId(competitionId)
      }
    },
    {
      $project: {
        _id: 1,
        Name: 1,
        Duration: 1,
        Priority: 1,
        chapterId: 1,
        "chapter._id": 1,
        "chapter.Name": 1,
        "chapter.Duration": 1,
        "chapter.Priority": 1,
        "chapter.subjectId": 1,
        "subject._id": 1,
        "subject.Name": 1,
        "subject.Duration": 1,
        "subject.Priority": 1,
        "subject.competionId": 1
      }
    }
  ]);
};