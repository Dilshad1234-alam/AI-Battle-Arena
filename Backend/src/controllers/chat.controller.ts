import type { Request, Response } from "express";
import Chat from "../models/chat.model.js";
import runGraph from "../ai/graph.ai.js";

export const invokeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        message: "Input is required",
      });
    }

    const result = await runGraph(input);

    const chat = await Chat.create({
      problem: input,
      solution_1: result.solution_1,
      solution_2: result.solution_2,
      judge: result.judge,
    });

    return res.status(200).json({
      success: true,
      message: "Graph executed successfully",
      result: chat,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getChatsController = async (
  req: Request,
  res: Response
) => {
  const chats = await Chat.find()
    .sort({ createdAt: -1 });

  res.json(chats);
};

export const deleteChatController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    await Chat.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};