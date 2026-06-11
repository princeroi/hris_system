export function computeRates(changedField, value, factor) {
    if (!factor || value === "" || value === null || isNaN(value)) return {};

    const days  = parseFloat(factor.working_days_per_month);
    const hours = parseFloat(factor.working_hours_per_day);
    const num   = parseFloat(value);

    if (!days || !hours || num < 0) return {};

    switch (changedField) {
        case "monthly_rate":
            return {
                daily_rate:  (num / days).toFixed(2),
                hourly_rate: (num / days / hours).toFixed(2),
            };
        case "daily_rate":
            return {
                monthly_rate: (num * days).toFixed(2),
                hourly_rate:  (num / hours).toFixed(2),
            };
        case "hourly_rate":
            return {
                daily_rate:   (num * hours).toFixed(2),
                monthly_rate: (num * hours * days).toFixed(2),
            };
        default:
            return {};
    }
}