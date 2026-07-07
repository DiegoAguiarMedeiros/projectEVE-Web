type Translate = (key: string, options?: Record<string, unknown>) => string;

export function getGoalDeadlineCount(deadline: number | string): number {
    const parsedDeadline = Number(deadline);
    return Number.isNaN(parsedDeadline) ? 0 : parsedDeadline;
}

export function getGoalDeadlineInMonths(deadline: number | string, monthYear: boolean): number {
    const count = getGoalDeadlineCount(deadline);
    return monthYear ? count : count * 12;
}

export function formatGoalDeadline(
    t: Translate,
    deadline: number | string,
    monthYear: boolean
): string {
    const count = getGoalDeadlineCount(deadline);

    if (monthYear) {
        const unit = t(count === 1 ? "settings.goals.time.month" : "settings.goals.time.months");
        return `${count} ${unit.toLowerCase()}`;
    }

    const unit = t(count === 1 ? "settings.goals.time.year" : "settings.goals.time.years");
    return `${count} ${unit.toLowerCase()}`;
}
