// resources/js/Pages/Employees/components/SmartCell.jsx

import { CELL_OPTIONS, FK_COLS, DATE_KEYS, NUM_KEYS } from "../bulkUploadConfig";
import SelectCell   from "./SelectCell";
import EditableCell from "./EditableCell";
import GovIdCell    from "./GovIdCell";

const GOV_ID_COLS = ["sss_number", "pagibig_number", "philhealth_number", "tin_number"];

export default function SmartCell({ col, value, onChange, fkOptions, error }) {
    if (GOV_ID_COLS.includes(col)) {
        return <GovIdCell col={col} value={value} onChange={onChange} error={error} />;
    }

    if (FK_COLS.includes(col)) {
        return <SelectCell value={value} options={fkOptions?.[col] ?? []} onChange={onChange} error={error} />;
    }

    if (CELL_OPTIONS[col]) {
        const options = CELL_OPTIONS[col].map(v => ({ value: v, label: v.replace(/_/g, " ") }));
        return <SelectCell value={value} options={options} onChange={onChange} error={error} />;
    }

    if (DATE_KEYS.includes(col)) return <EditableCell value={value} onChange={onChange} type="date"   error={error} />;
    if (NUM_KEYS.includes(col))  return <EditableCell value={value} onChange={onChange} type="number" error={error} />;

    return <EditableCell value={value} onChange={onChange} error={error} />;
}