export const safeIntParse = (value: any): number | null => {
    const str = String(value ?? '').replace(/\D/g, '');
    return str === '' ? null : Number(str);
};
