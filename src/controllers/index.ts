import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const registerRule = async (req: Request, res: Response) => {
    console.log(req.body);
    return res.status(200).json({});
};