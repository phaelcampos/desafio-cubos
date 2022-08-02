const Joi = require('joi')

const ruleSchema = Joi.object({
    weekly: Joi.boolean(),
    daily: Joi.boolean(),
    day: Joi.string().required(),
    intervals: Joi.array().items({
        start: Joi.string().required(),
        end: Joi.string().required()
    }).required()
})

export default ruleSchema