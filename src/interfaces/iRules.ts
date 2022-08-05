export interface ISpecificRule {
    id?: string;
    day: Date;
    intervals: IInterval[];
}

export interface IDailyRule {
    id?: string;
    intervals: IInterval[];
}

export interface IWeeklyRule {
    id?: string;
    weekly: string[];
    intervals: IInterval[];
}

interface IInterval {
    start: string;
    end: string;
}
