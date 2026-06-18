// resources/js/utils/dateUtils.js

const PH_LOCALE = "en-PH";
const PH_TZ     = "Asia/Manila";

export const fmtDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(PH_LOCALE, {
        year: "numeric", month: "long", day: "numeric",
        timeZone: PH_TZ,
    });
};

export const fmtDateShort = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString(PH_LOCALE, {
        year: "numeric", month: "short", day: "numeric",
        timeZone: PH_TZ,
    });
};

export const fmtDateTime = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleString(PH_LOCALE, {
        year: "numeric", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
        hour12: true,
        timeZone: PH_TZ,
    });
};

export const fmtTime = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return "—";
    return d.toLocaleTimeString(PH_LOCALE, {
        hour: "numeric", minute: "2-digit",
        hour12: true,
        timeZone: PH_TZ,
    });
};