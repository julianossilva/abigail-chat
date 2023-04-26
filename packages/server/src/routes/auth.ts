import { Request, Response, Router } from 'express'
import { AuthService } from '../services/auth'
import joi from 'joi'
import { RegistrationError } from '../services/errors/auth-errors'

export function authRoutes(authService: AuthService) {
    let router = Router()

    router.post("/signup", async (req: Request, res: Response) => {

        let { username, email, password } = req.body;

        let usernameErr = joi.string().required().min(3).validate(username).error
        let emailErr = joi.string().email().required().validate(email).error
        let passwordErr = joi.string().min(8).required().validate(password).error

        if (usernameErr || emailErr || passwordErr) {
            res.status(400).send({
                message: "param error"
            })
            return
        }

        try {
            await authService.register(username, email, password)
            res.status(201).send()
        } catch (error) {
            if (error instanceof RegistrationError) {
                res.status(500).send({
                    message: "registration error"
                })
            } else {
                res.status(500).send({
                    message: ""
                })
            }
        }
    })

    router.post("/singin", async (req: Request, res: Response) => {
        let { username, password } = req.body

        let usernameErr = joi.string().required().validate(username).error
        let passwordErr = joi.string().required().validate(password).error

        if (usernameErr || passwordErr) {
            res.status(400).send({
                message: "param error"
            })
            return
        }

        authService.authenticate(username, password)
    })

    return router
}