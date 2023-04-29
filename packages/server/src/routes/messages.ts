import { Router, Request, Response } from "express";
import { MessageService } from "../services/message";
import joi from "joi";

export function messageRoutes(messageService: MessageService): Router {
    let router = Router()

    router.post("/messages/send", async (req: Request, res: Response) => {
        let token = req.get("Authorization") ?? ""

        if (!token.startsWith("Bearer ")) {
            res.status(400).send({
                message: "no bearer token"
            })
            return 
        }
        token = token.replace("Bearer ", "")

        let { to, content } = req.body

        let toErr = joi.string().required().validate(to).error
        let messageErr = joi.string().min(1).max(200).required().validate(content).error

        if (toErr || messageErr) {
            res.status(400).send({
                message: "param error"
            })
            return
        }
        
        try {
            let message = await messageService.send(token, to, content)
            res.send({
                id: message.id.id,
                from: message.from.uuid,
                to: message.to.uuid,
                date: message.sended.isoString()
            }) 
        } catch (error) {
            res.status(500).send()
        }
    })

    return router
}