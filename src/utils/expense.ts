export const getDatesFromMonth = (monthDate: string) => {
    const [year, month] = monthDate.split('-').map(Number);
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            return {start, end}
}