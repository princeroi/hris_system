// resources/js/Pages/Employees/BulkUpload.jsx

import { useState, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";
import ExcelJS from "exceljs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { downloadEmployeeTemplate } from "@/utils/generateEmployeeTemplate";
import { ChevronDown, X, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { TABS, REQUIRED, DATE_KEYS, NUM_KEYS, CELL_OPTIONS, FK_COLS } from "./bulkUploadConfig";
import { parseRow, validateRow, flatErrors, emptyRow, colLabel, applyRowDefaults } from "./bulkUploadUtils";

import Pill                   from "./components/Pill";
import SmartCell              from "./components/SmartCell";
import WorkExperiencePanel    from "./components/WorkExperiencePanel";
import EmergencyContactsPanel from "./components/EmergencyContactsPanel";
import CompensationPanel      from "./components/CompensationPanel";

const GOV_ID_COLS = ["sss_number", "pagibig_number", "philhealth_number", "tin_number"];

// ── Import Summary Panel ──────────────────────────────────────────────────────
function ImportSummary({ results, onReset, onViewEmployees }) {
    const succeeded = results.filter(r => r.status === "imported");
    const skipped   = results.filter(r => r.status === "skipped");

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-slate-800">Import Results</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        ✓ {succeeded.length} imported
                    </span>
                    {skipped.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 ring-1 ring-inset ring-red-200">
                            ✗ {skipped.length} skipped
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={onViewEmployees}
                        className="h-7 text-xs bg-blue-700 hover:bg-blue-800 text-white"
                    >
                        View employees
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onReset}
                        className="h-7 text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        Upload another
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Imported ({succeeded.length})
                    </p>
                    {succeeded.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">None imported.</p>
                    ) : (
                        <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                            {succeeded.map((r, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50/60 rounded-md px-2.5 py-1.5">
                                    <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                                    <span className="font-mono font-medium text-emerald-800">{r.employee_number}</span>
                                    <span className="text-slate-500 truncate">{r.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-red-600 mb-3 flex items-center gap-1.5">
                        <XCircle size={12} /> Skipped ({skipped.length})
                    </p>
                    {skipped.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No rows were skipped.</p>
                    ) : (
                        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {skipped.map((r, i) => (
                                <li key={i} className="bg-red-50/60 rounded-md px-2.5 py-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <XCircle size={11} className="text-red-400 shrink-0" />
                                        <span className="font-mono text-xs font-medium text-red-700">
                                            {r.employee_number || (
                                                <span className="italic text-slate-400">No ID</span>
                                            )}
                                        </span>
                                        <span className="text-xs text-slate-500 truncate">{r.name}</span>
                                    </div>
                                    <ul className="pl-4 space-y-0.5">
                                        {r.reasons.map((reason, ri) => (
                                            <li key={ri} className="text-[11px] text-red-600 flex items-start gap-1">
                                                <span className="mt-px shrink-0">•</span>
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BulkUpload({
    companies               = [],
    branches                = [],
    departments             = [],
    positions               = [],
    existingEmployeeNumbers = [],
    workTimeFactors         = [],
}) {
    const fileRef = useRef(null);
    const [rows,          setRows         ] = useState([emptyRow()]);
    const [fileName,      setFileName     ] = useState("");
    const [uploading,     setUploading    ] = useState(false);
    const [importResults, setImportResults] = useState(null);
    const [activeTab,     setActiveTab    ] = useState(0);
    const [serverErrors,  setServerErrors ] = useState([]);

    const fkOptions = {
        company_id:    companies.map(c   => ({ value: String(c.id), label: c.company_name    })),
        branch_id:     branches.map(b    => ({ value: String(b.id), label: b.branch_name     })),
        department_id: departments.map(d => ({ value: String(d.id), label: d.department_name })),
        position_id:   positions.map(p   => ({ value: String(p.id), label: p.position_name   })),
    };

    const existingNumbersSet = new Set(
        existingEmployeeNumbers.map(n => String(n).trim().toLowerCase())
    );

    // ── File handler ──────────────────────────────────────────────────────────
    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setImportResults(null);
        setServerErrors([]);
        setActiveTab(0);

        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(await file.arrayBuffer());
        const ws = wb.worksheets[0];

        const headers = [];
        ws.getRow(1).eachCell(cell =>
            headers.push(cell.value?.toString().replace(" *", "").trim())
        );

        const parsed = [];
        ws.eachRow((row, rowNum) => {
            if (rowNum === 1) return;
            const obj = {};
            row.eachCell({ includeEmpty: true }, (cell, colNum) => {
                const key = headers[colNum - 1];
                if (key) obj[key] = cell.value ?? "";
            });
            if (Object.values(obj).every(v => v === "" || v === null)) return;
            parsed.push(applyRowDefaults({ ...emptyRow(), ...parseRow(obj) }));
        });

        setRows(prev => {
            const hasData = prev.some(r =>
                Object.entries(r).some(([k, v]) =>
                    !["work_experiences", "emergency_contacts"].includes(k) &&
                    v !== "" && v !== "active" && v !== "for_verification"
                )
            );
            return hasData ? [...prev, ...parsed] : parsed;
        });
    };

    // ── Cell update ───────────────────────────────────────────────────────────
    const ALWAYS_APPLY_DEFAULTS = new Set([
        "sss_number",        "sss_status",
        "pagibig_number",    "pagibig_status",
        "philhealth_number", "philhealth_status",
        "tin_number",        "tin_status",
        "atm_status",        "atm_card_number",
    ]);

    const updateCell = useCallback((rowIdx, col, value) => {
        setRows(prev => {
            const next    = [...prev];
            let updated   = { ...next[rowIdx], [col]: value };

            // Auto-compute age whenever birth_date changes
            if (col === "birth_date") {
                if (value) {
                    const birth = new Date(value);
                    if (!isNaN(birth)) {
                        const today = new Date();
                        let age = today.getFullYear() - birth.getFullYear();
                        const m = today.getMonth() - birth.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                        updated.age = age >= 0 ? String(age) : "";
                    }
                } else {
                    updated.age = "";
                }
            }

            next[rowIdx] = ALWAYS_APPLY_DEFAULTS.has(col)
                ? applyRowDefaults(updated)
                : updated;
            return next;
        });
    }, []);

    const deleteRow = (idx) => setRows(prev => prev.filter((_, i) => i !== idx));
    const addRow    = ()    => { setRows(prev => [...prev, emptyRow()]); setActiveTab(0); };

    // ── Derived state ─────────────────────────────────────────────────────────
    const rowValidations = rows.map((row, i) =>
        validateRow(row, rows, i, existingNumbersSet, fkOptions)
    );
    const rowErrorsFlat = rowValidations.map(v => flatErrors(v));
    const totalErrors   = rowErrorsFlat.filter(e => e.length > 0).length;
    const cleanCount    = rows.length - totalErrors;
    const currentTab    = TABS[activeTab];
    const currentCols   = currentTab.cols ?? [];
    const isSpecial     = !!currentTab.special;

    const tabErrorCounts = TABS.map(tab => {
        if (tab.cols) {
            const colSet = new Set(tab.cols);
            return rowValidations.filter(({ fieldErrors }) =>
                Object.keys(fieldErrors).some(k => colSet.has(k))
            ).length;
        }
        if (tab.special === "work_experience") {
            return rowValidations.filter(({ fieldErrors }) =>
                Object.keys(fieldErrors).some(k => k.startsWith("work_experiences["))
            ).length;
        }
        if (tab.special === "emergency_contacts") {
            return rowValidations.filter(({ fieldErrors }) =>
                Object.keys(fieldErrors).some(k => k.startsWith("emergency_contacts["))
            ).length;
        }
        return 0;
    });

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = () => {
        const cleanRows   = rows.filter((_, i) => rowErrorsFlat[i].length === 0);
        const skippedRows = rows
            .map((row, i) => ({ row, errors: rowErrorsFlat[i] }))
            .filter(({ errors }) => errors.length > 0);

        if (cleanRows.length === 0) return;

        setUploading(true);
        setServerErrors([]);

        router.post("/employees/bulk", { employees: cleanRows }, {
            onSuccess: () => {
                const results = [
                    ...cleanRows.map(row => ({
                        status:          "imported",
                        employee_number: row.employee_number,
                        name:            [row.first_name, row.last_name].filter(Boolean).join(" ") || "—",
                    })),
                    ...skippedRows.map(({ row, errors }) => ({
                        status:          "skipped",
                        employee_number: row.employee_number,
                        name:            [row.first_name, row.last_name].filter(Boolean).join(" ") || "—",
                        reasons:         errors,
                    })),
                ];
                setImportResults(results);
                setUploading(false);
            },
            onError: (e) => {
                setServerErrors(Object.values(e).flat());
                setUploading(false);
            },
        });
    };

    // ── Reset ─────────────────────────────────────────────────────────────────
    const reset = () => {
        setRows([emptyRow()]);
        setFileName("");
        setImportResults(null);
        setServerErrors([]);
        setActiveTab(0);
        if (fileRef.current) fileRef.current.value = "";
    };

    // ── Column min-width helper ───────────────────────────────────────────────
    const colMinWidth = (col) => {
        if (FK_COLS.includes(col) || CELL_OPTIONS[col])  return 160;
        if (GOV_ID_COLS.includes(col))                   return 180;
        if (DATE_KEYS.includes(col))                     return 148;
        if (NUM_KEYS.includes(col))                      return 120;
        return 140;
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit("/employees")}
                        className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 gap-1"
                    >
                        <span className="text-base leading-none">←</span> Back
                    </Button>
                    <div className="w-px h-5 bg-blue-200" />
                    <h2 className="text-xl font-semibold text-gray-800">Bulk Upload Employees</h2>
                </div>
            }
        >
            <Head title="Bulk Upload Employees" />

            {/* Outer wrapper: flush to layout edges, minimal vertical padding */}
            <div className="py-2">
                <div className="w-full px-2 space-y-2">

                    {/* ── Upload bar ──────────────────────────────────────── */}
                    <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-3 py-2">
                        <label className="flex items-center gap-2 flex-1 cursor-pointer group">
                            <span className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.5 1.5v8M4.5 4.5l3-3 3 3M2.5 10.5v2a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-2"
                                        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                            </span>

                            {fileName ? (
                                <span className="text-xs font-medium text-blue-700 truncate">
                                    ✓ {fileName}{" "}
                                    <span className="text-slate-400 font-normal">
                                        · {rows.length} row{rows.length !== 1 ? "s" : ""}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                                    Upload .xlsx file{" "}
                                    <span className="text-slate-400">or type directly in the table below</span>
                                </span>
                            )}

                            <input
                                ref={fileRef}
                                type="file"
                                accept=".xlsx"
                                className="hidden"
                                onChange={handleFile}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    e.preventDefault();
                                    const dt = new DataTransfer();
                                    dt.items.add(e.dataTransfer.files[0]);
                                    fileRef.current.files = dt.files;
                                    handleFile({ target: { files: dt.files } });
                                }}
                            />
                        </label>

                        <div className="w-px h-4 bg-slate-200 shrink-0" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={downloadEmployeeTemplate}
                            className="h-7 text-xs text-slate-500 hover:text-blue-700 hover:bg-blue-50 shrink-0 px-2 gap-1"
                        >
                            ↓ Template
                        </Button>
                    </div>

                    {/* ── Server errors ────────────────────────────────────── */}
                    {serverErrors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-semibold text-red-700 mb-2">
                                {serverErrors.length} server error{serverErrors.length > 1 ? "s" : ""}
                            </p>
                            <ul className="space-y-1 max-h-28 overflow-y-auto">
                                {serverErrors.map((err, i) => (
                                    <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                                        <span className="mt-px shrink-0">•</span> {err}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Import summary ───────────────────────────────────── */}
                    {importResults && (
                        <ImportSummary
                            results={importResults}
                            onReset={reset}
                            onViewEmployees={() => router.visit("/employees")}
                        />
                    )}

                    {/* ── Main table card ──────────────────────────────────── */}
                    {!importResults && (
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">

                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-semibold text-slate-800">Employees</p>
                                    <Pill count={rows.length} color="slate" />
                                    {totalErrors > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 ring-1 ring-inset ring-red-200">
                                            ⚠ {totalErrors} with errors
                                        </span>
                                    )}
                                    {cleanCount > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                            ✓ {cleanCount} ready
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={addRow}
                                        className="h-7 text-xs gap-1 text-slate-600 border-slate-200 hover:bg-slate-50"
                                    >
                                        + Add row
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={reset}
                                        className="h-7 text-xs text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>

                            {/* ── Tabs ─────────────────────────────────────── */}
                            <div className="flex items-end border-b border-slate-200 bg-slate-50/70">
                                {TABS.map((tab, i) => {
                                    const isActive = i === activeTab;
                                    const errCount = tabErrorCounts[i];
                                    const hasErr   = errCount > 0;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTab(i)}
                                            className={[
                                                "flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 border-x border-x-blue-100 whitespace-nowrap transition-colors -mb-px rounded-t",
                                                isActive
                                                    ? hasErr
                                                        ? "border-red-500 text-red-600 bg-white shadow-sm"
                                                        : "border-blue-600 text-blue-700 bg-white shadow-sm"
                                                    : hasErr
                                                        ? "border-transparent text-red-500 hover:text-red-600 hover:bg-red-50/60"
                                                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60",
                                            ].join(" ")}
                                        >
                                            <span>{tab.icon}</span>
                                            {tab.label}
                                            {hasErr && (
                                                <span className={[
                                                    "inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold leading-none",
                                                    isActive ? "bg-red-100 text-red-600" : "bg-red-500 text-white",
                                                ].join(" ")}>
                                                    {errCount}
                                                </span>
                                            )}
                                            {tab.special === "work_experience" && (
                                                <Pill
                                                    count={rows.reduce((s, r) => s + (r.work_experiences?.length ?? 0), 0)}
                                                    color={hasErr ? "red" : "blue"}
                                                />
                                            )}
                                            {tab.special === "emergency_contacts" && (
                                                <Pill
                                                    count={rows.reduce((s, r) => s + (r.emergency_contacts?.length ?? 0), 0)}
                                                    color={hasErr ? "red" : "blue"}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Special panels */}
                            {isSpecial && currentTab.special === "work_experience" && (
                                <WorkExperiencePanel rows={rows} onUpdate={setRows} />
                            )}
                            {isSpecial && currentTab.special === "compensation" && (
                                <CompensationPanel rows={rows} onUpdate={setRows} workTimeFactors={workTimeFactors} />
                            )}
                            {isSpecial && currentTab.special === "emergency_contacts" && (
                                <EmergencyContactsPanel rows={rows} onUpdate={setRows} />
                            )}

                            {/* ── Regular table ─────────────────────────────── */}
                            {!isSpecial && (
                                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-180px)] w-full">
                                    <table
                                        className="border-collapse"
                                        style={{ tableLayout: "auto", width: "max-content", minWidth: "100%" }}
                                    >
                                        <thead className="sticky top-0 z-10">
                                            <tr className="border-b-2 border-slate-200 bg-slate-50">
                                                <th className="px-3 py-2 text-center text-slate-400 font-semibold text-[11px] w-10 shrink-0">
                                                    #
                                                </th>
                                                {currentCols.map(col => {
                                                    const isDropdown = CELL_OPTIONS[col] || FK_COLS.includes(col);
                                                    const isReq      = REQUIRED.includes(col);
                                                    return (
                                                        <th
                                                            key={col}
                                                            style={{ minWidth: colMinWidth(col) }}
                                                            className={`px-2.5 py-2 text-left font-semibold text-[11px] uppercase tracking-wide whitespace-nowrap border-r border-slate-200 last:border-r-0 ${
                                                                isReq ? "text-blue-700" : "text-slate-500"
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-1">
                                                                {colLabel(col)}
                                                                {isReq      && <span className="text-red-400 font-bold">*</span>}
                                                                {isDropdown && <ChevronDown size={10} className="text-slate-300" />}
                                                            </span>
                                                        </th>
                                                    );
                                                })}
                                                <th className="px-2.5 py-2 w-10 shrink-0" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {rows.map((row, ri) => {
                                                const validation                 = rowValidations[ri];
                                                const { fieldErrors, rowErrors } = validation;
                                                const allFlat                    = flatErrors(validation);
                                                const hasErr                     = allFlat.length > 0;

                                                const isDup        = rowErrors.some(e => e.includes("Duplicate"));
                                                const isConflict   = rowErrors.some(e => e.includes("conflicts with"));
                                                const isDBConflict = (fieldErrors["employee_number"] ?? [])
                                                    .some(e => e.includes("already exists in the system"));

                                                return (
                                                    <tr
                                                        key={ri}
                                                        className={`border-b border-slate-100 last:border-b-0 transition-colors ${
                                                            isDup        ? "bg-orange-50/40" :
                                                            isConflict   ? "bg-yellow-50/40" :
                                                            hasErr       ? "bg-red-50/40"    :
                                                            ri % 2 === 0 ? "bg-white hover:bg-blue-50/20"
                                                                         : "bg-slate-50/50 hover:bg-blue-50/20"
                                                        }`}
                                                    >
                                                        <td className="text-center px-2 py-0 h-10 align-middle w-10">
                                                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold ${
                                                                isDup        ? "bg-orange-100 text-orange-600" :
                                                                isConflict   ? "bg-yellow-100 text-yellow-700" :
                                                                hasErr       ? "bg-red-100 text-red-600"       :
                                                                               "bg-slate-100 text-slate-500"
                                                            }`}>
                                                                {ri + 1}
                                                            </span>
                                                        </td>

                                                        {currentCols.map(col => {
                                                            const cellError = (fieldErrors[col] ?? [])[0];
                                                            return (
                                                                <td
                                                                    key={col}
                                                                    className={`p-0 align-middle border-r border-slate-100 last:border-r-0 ${
                                                                        cellError ? "ring-1 ring-inset ring-red-300 bg-red-50/30" : ""
                                                                    }`}
                                                                >
                                                                    {col === "employee_number" && isDBConflict ? (
                                                                        <div className="relative">
                                                                            <SmartCell
                                                                                col={col}
                                                                                value={String(row[col] ?? "")}
                                                                                onChange={v => updateCell(ri, col, v)}
                                                                                fkOptions={fkOptions}
                                                                                error={cellError}
                                                                            />
                                                                            <span className="absolute top-1 right-1 inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 pointer-events-none">
                                                                                <AlertTriangle size={8} /> EXISTS
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <SmartCell
                                                                            col={col}
                                                                            value={String(row[col] ?? "")}
                                                                            onChange={v => updateCell(ri, col, v)}
                                                                            fkOptions={fkOptions}
                                                                            error={cellError}
                                                                        />
                                                                    )}
                                                                </td>
                                                            );
                                                        })}

                                                        <td className="px-2 py-0 h-10 align-middle text-center w-10">
                                                            <button
                                                                onClick={() => deleteRow(ri)}
                                                                className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors mx-auto"
                                                                title="Delete row"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Ghost / padding rows */}
                                            {Array.from({ length: Math.max(0, 8 - rows.length) }).map((_, i) => {
                                                const ri = rows.length + i;
                                                return (
                                                    <tr key={`pad-${i}`} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                                        <td className="h-10 px-2 text-center align-middle w-10">
                                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-200">
                                                                {ri + 1}
                                                            </span>
                                                        </td>
                                                        {currentCols.map((col, ci) => (
                                                            <td key={col} className="h-10 border-r border-slate-100 last:border-r-0 px-3 align-middle whitespace-nowrap">
                                                                {i === 0 && rows.length === 0 && ci === Math.floor(currentCols.length / 2) && (
                                                                    <span className="text-xs text-slate-300 italic select-none whitespace-nowrap">
                                                                        No data — type in a row or upload a file
                                                                    </span>
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td className="h-10 px-2 w-10" />
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ── Row-level error list (footer) ──────────────── */}
                            {totalErrors > 0 && (
                                <div className="px-4 py-2 border-t border-red-100 bg-red-50/50">
                                    <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1.5">
                                        <AlertTriangle size={11} />
                                        {totalErrors} row{totalErrors > 1 ? "s" : ""} with errors
                                        {cleanCount > 0 && (
                                            <span className="ml-1 font-normal text-slate-500">
                                                — {cleanCount} clean row{cleanCount > 1 ? "s" : ""} will still be imported
                                            </span>
                                        )}
                                    </p>
                                    <ul className="space-y-0.5 max-h-24 overflow-y-auto">
                                        {rows.map((row, ri) =>
                                            rowErrorsFlat[ri].map((err, ei) => (
                                                <li key={`${ri}-${ei}`} className="text-xs text-red-600 flex items-start gap-1.5">
                                                    <span className="shrink-0 font-semibold">
                                                        Row {ri + 1}
                                                        {row.employee_number ? ` (${row.employee_number})` : ""}:
                                                    </span>
                                                    <span>{err}</span>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 bg-slate-50/60">
                                <p className="text-xs text-slate-400">
                                    Click any cell to edit · Dropdowns open on click · Enter or Tab to confirm · Esc to cancel
                                </p>
                                <Button
                                    size="sm"
                                    disabled={cleanCount === 0 || uploading}
                                    onClick={handleSubmit}
                                    className="h-7 text-xs bg-blue-700 hover:bg-blue-800 text-white disabled:opacity-50 gap-1.5"
                                >
                                    {uploading
                                        ? "Importing…"
                                        : cleanCount === 0
                                            ? "No valid rows to import"
                                            : totalErrors > 0
                                                ? `Import ${cleanCount} valid · skip ${totalErrors}`
                                                : `Import ${cleanCount} employee${cleanCount > 1 ? "s" : ""}`
                                    }
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}