import type { NextFunction, Request, Response } from "express";
import type AppError from "../utils/app-error.js";

const errorHandler = (err: AppError, req:Request, res:Response, next:NextFunction) => {
    const statusCode = err.statusCode  || 500;
    res.status(statusCode).json({
        status: err.status,
        message: err.isOperationel ? err.message: 'Internal Serval Error'
    })
}

export default errorHandler;