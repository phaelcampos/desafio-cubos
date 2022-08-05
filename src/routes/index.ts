/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from "express";
import * as ruleController from "../controllers/createRules";

import ruleSchema from "../joi/rule";
const validator = require('express-joi-validation').createValidator({});

export const index = Router();

index.post("/rule", validator.body(ruleSchema), ruleController.ruleValidator);

index.get("/rule", ruleController.listRules);

index.delete("/rule/:id", ruleController.deleteRule);


index.get("/rule/teste/", ruleController.availableTimes);
