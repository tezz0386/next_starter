import { Request, Response, NextFunction } from 'express';
export type ReqResNext = {
    req:Request,
    res:Response,
    next:NextFunction,
}