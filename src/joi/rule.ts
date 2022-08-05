/* eslint-disable max-len */
import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);


const pattern = /([0-9]{2})\:([0-9]{2})/;

const ruleSchema = Joi.object({
    type: Joi.string().valid('daily', 'weekly','specific').required(),
    day: Joi.alternatives().conditional('type', { 
        is: 'specific', then: Joi.date().greater('now').iso().format("DD-MM-YYYY").raw().required(),
     }),
    weekly: Joi.alternatives().conditional('type', {            
        is: 'weekly', then: Joi.array().items(Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')).required(),
    }),
    intervals: Joi.array().items({
        start: Joi.string().pattern(new RegExp(pattern)).required(),
        end: Joi.string().pattern(new RegExp(pattern)).required(),
    }).required(),
});


export default ruleSchema;
