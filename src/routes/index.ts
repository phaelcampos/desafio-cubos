import { Router } from "express";
import * as ruleController from "../controllers/index";
import ruleSchema from "../joi/rule";
const validator = require('express-joi-validation').createValidator({})

export const index = Router();

index.post("/rule", validator.body(ruleSchema),ruleController.registerRule);