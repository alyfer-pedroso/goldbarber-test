import { NextFunction, Request, Response } from 'express';
const jwt = require("jsonwebtoken");

export const AuthJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const secretKey = process.env.JWT_SECRET_KEY;
        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        res.status(403).json(new Error("Acesso negado"));
    }
}
