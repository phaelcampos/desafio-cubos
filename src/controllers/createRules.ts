/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ISpecificRule, IDailyRule, IWeeklyRule } from "../interfaces/iRules";
import { Request,Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";
/**
 * GET /
 * Home page.
 */
export const specificDayRule = async (content:ISpecificRule, res:Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    const { day, intervals } = content;
    const result = validateDateHour(day, intervals);
    if (result === "invalid") return res.status(400).json({ error: "Intervalo inválido" });
    const schedule = JSON.parse(fileContent);
    content.id = uuidv4();
    schedule.specific.push(content);
    await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));

    return res.status(201).json({});
};

export const dailyRule = async (content: IDailyRule, res:Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    const result = validateDateHour(null, content.intervals);
    if (result === "invalid") return res.status(400).json({ error: "Intervalo inválido" });
    const schedule = JSON.parse(fileContent);
    content.id = uuidv4();
    schedule.daily.push(content);
    await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));
    return res.status(201).json({});
};


export const weeklyRule = async (content: IWeeklyRule, res:Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    const newJson = {} as any;
    const result = validateDateHour(null, content.intervals);
    if (result === "invalid") return res.status(400).json({ error: "Intervalo inválido" });
    const schedule = JSON.parse(fileContent);
    for(let i = 0; i < content.weekly.length; i++) {
        content.weekly[i] == "monday" ? newJson.monday = content.intervals : undefined;
        content.weekly[i] == "tuesday" ? newJson.tuesday= content.intervals : undefined;
        content.weekly[i] == "wednesday" ? newJson.wednesday= content.intervals : undefined;
        content.weekly[i] == "thursday" ? newJson.thursday= content.intervals : undefined;
        content.weekly[i] == "friday" ? newJson.friday= content.intervals : undefined;
        content.weekly[i] == "saturday" ? newJson.saturday= content.intervals : undefined;
        content.weekly[i] == "sunday" ? newJson.sunday= content.intervals : undefined;
    }
    newJson.id = uuidv4();
    schedule.weekly.push(newJson);
    await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));
    return res.status(201).json({});
};


function validateDateHour(day: any, intervals:any) {
    if(!day) day = "05-08-2022";
    console.log(day);
    const toFormatDate = day.toString().split("-");
    const formatedDate = new Date(parseInt(toFormatDate[2]),parseInt(toFormatDate[1])-1, parseInt(toFormatDate[0]));
    const date = formatedDate.getDate();
    const month = formatedDate.getMonth();
    const year = formatedDate.getFullYear();
    for (const interval of intervals) {
        const initial_hour = interval.start.split(":");
        const final_hour = interval.end.split(":");
        const inicio = new Date(year,month,date,parseInt(initial_hour[0]),parseInt(initial_hour[1]));
        const fim = new Date(year,month,date,parseInt(final_hour[0]),parseInt(final_hour[1]));
        if (inicio > fim) {
            return "invalid";
        }
    }
    return;
}

export const ruleValidator =  async (req: Request, res: Response) => { 
    if (req.body.type === "specific") {
        const body  ={
            day: req.body.day,
            intervals: req.body.intervals,
        };
        return await specificDayRule(body,res);
    }
    if (req.body.type === "daily") {
        const body = {
            intervals: req.body.intervals,
        };
        return await dailyRule(body,res);
    }
    if(req.body.type === "weekly") {
        const body = {
            weekly: req.body.weekly,
            intervals: req.body.intervals,
        };
        return await weeklyRule(body,res);
    }
};

function split(arg0: string) {
    throw new Error("Function not implemented.");
}

export const listRules = async (req: Request, res: Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    return res.status(200).json(JSON.parse(fileContent));
};

export const deleteRule = async (req: Request, res: Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    const schedule = JSON.parse(fileContent);
    const { id } = req.params;
    const index = schedule.specific.findIndex((rule: { id: string; }) => rule.id === id);
    if (index !== -1) {
        schedule.specific.splice(index, 1);
        await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));
        return res.status(200).json({});
    }
    const index2 = schedule.daily.findIndex((rule: { id: string; }) => rule.id === id);
    if (index2 !== -1) {
        schedule.daily.splice(index2, 1);
        await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));
        return res.status(200).json({});
    }
    const index3 = schedule.weekly.findIndex((rule: { id: string; }) => rule.id === id);
    if (index3 !== -1) {
        schedule.weekly.splice(index3, 1);
        await fs.writeFileSync ("./schedule.json", JSON.stringify(schedule));
        return res.status(200).json({});
    }
    return res.status(400).json({ error: "Regra não encontrada" });

};

export const availableTimes = async (req: Request, res: Response) => {
    const fileContent = await fs.readFileSync("./schedule.json", "utf8");
    const schedule = JSON.parse(fileContent);
    const { start, end } = req.query;
    const toFormatDate = start.toString().split("-");
    const formatedDate = new Date(parseInt(toFormatDate[2]),parseInt(toFormatDate[1])-1, parseInt(toFormatDate[0]));
    const toFormatDate2 = end.toString().split("-");
    const formatedDate2 = new Date(parseInt(toFormatDate2[2]),parseInt(toFormatDate2[1])-1, parseInt(toFormatDate2[0]));
    const availableTimes = [];

    for (const rule of schedule.specific) {
        const jsonItens ={
            day : rule.day,
            intervals : [],
        };
        const ruleDate = new Date(rule.day.split("-")[2],rule.day.split("-")[1]-1,rule.day.split("-")[0]);
        if (ruleDate.getTime() >= formatedDate.getTime() && ruleDate.getTime() <= formatedDate2.getTime()) {
            jsonItens.intervals.push(rule.intervals);
        }
        availableTimes.push(jsonItens);
    }
    for (const rule of schedule.daily) {
        const jsonItens ={
            day : formatedDate.toString(),
            intervals : [],
        };
        jsonItens.intervals.push(rule.intervals);
        availableTimes.push(rule.intervals);
    }
    // for (const rule of schedule.weekly) {
    //     //using toDateString compare the day of the week
    //     const ruleDate = new Date(rule.day.split("-")[2],rule.day.split("-")[1]-1,rule.day.split("-")[0]);
    //     if (formatedDate.toDateString().includes(ruleDate.toDateString().slice(" ")[0])) {
    //         availableTimes.push(rule.intervals);
    //     }


    // }
    return res.status(200).json(availableTimes);
};
