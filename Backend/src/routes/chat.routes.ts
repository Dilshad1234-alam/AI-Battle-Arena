import express from "express";
import { deleteChatController, getChatsController, invokeController } from "../controllers/chat.controller.js";


const router = express.Router();

router.post("/invoke", invokeController)

router.get("/", getChatsController)

router.delete("/:id", deleteChatController)

export default router;