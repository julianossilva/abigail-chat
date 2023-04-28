import { Router, Request, Response } from "express";
import { MessageService } from "../services/message";

export function messageRoutes(messageService: MessageService): Router {
    let router = Router()

    router.post("/messages/send", async (req: Request, res: Response) => {
        let token = req.get("Authorization") ?? ""
        let { to, message } = req.body

        try {
            await messageService.send(token, to, message)
            res.send()
        } catch (error) {
            res.status(500).send()
        }
    })

    return router
}