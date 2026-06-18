// resources/js/Pages/Employees/BulkUpload.jsx

import { useState, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";
import ExcelJS from "exceljs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { downloadEmployeeTemplate } from "@/utils/generateEmployeeTemplate";
import { ChevronDown, X, CheckCircle2, XCircle, AlertTriangle, Upload, Download, Plus, RotateCcw, ArrowLeft } from "lucide-react";

import { TABS, REQUIRED, DATE_KEYS, NUM_KEYS, CELL_OPTIONS, FK_COLS } from "./bulkUploadConfig";
import { parseRow, validateRow, flatErrors, emptyRow, colLabel, applyRowDefaults } from "./bulkUploadUtils";

import Pill                   from "./components/Pill";
import SmartCell              from "./components/SmartCell";
import WorkExperiencePanel    from "./components/WorkExperiencePanel";
import EmergencyContactsPanel from "./components/EmergencyContactsPanel";
import CompensationPanel      from "./components/CompensationPanel";

const GOV_ID_COLS         = ["sss_number", "pagibig_number", "philhealth_number", "tin_number"];
const CONTRACT_DATE_COLS  = ["contract_date_from", "contract_date_to"];
const PROBATION_ONLY_COLS = ["regularization_date", "probationary_evaluation_date", "probationary_period_months"];
const PROBATION_TYPES     = ["probationary", "regular"];

// ── Small helper cell ───────────────────────────────────────────────────────
function NotApplicableCell() {
    return (
        <div className="h-11 px-3 flex items-center text-xs text-slate-300 select-none">
            Not applicable
        </div>
    );
}

// ── Import Summary Panel ──────────────────────────────────────────────────────
function ImportSummary({ results, onReset, onViewEmployees }) {
    const succeeded = results.filter(r => r.status === "imported");
    const skipped   = results.filter(r => r.status === "skipped");

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-4 sm:px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-900">Import results</h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <CheckCircle2 size={12} strokeWidth={2.5} /> {succeeded.length} imported
                    </span>
                    {skipped.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                            <XCircle size={12} strokeWidth={2.5} /> {skipped.length} skipped
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={onViewEmployees}
                        className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        View employees
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onReset}
                        className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                        Upload another
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                <div className="p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 size={12} strokeWidth={2.5} /> Imported ({succeeded.length})
                    </p>
                    {succeeded.length === 0 ? (
                        <p className="text-xs text-slate-400">None imported.</p>
                    ) : (
                        <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                            {succeeded.map((r, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700 bg-emerald-50/60 rounded-md px-3 py-2">
                                    <CheckCircle2 size={12} strokeWidth={2.5} className="text-emerald-500 shrink-0" />
                                    <span className="font-mono font-medium text-emerald-800">{r.employee_number}</span>
                                    <span className="text-slate-500 truncate">{r.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-4 sm:p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-600 mb-3 flex items-center gap-1.5">
                        <XCircle size={12} strokeWidth={2.5} /> Skipped ({skipped.length})
                    </p>
                    {skipped.length === 0 ? (
                        <p className="text-xs text-slate-400">No rows were skipped.</p>
                    ) : (
                        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {skipped.map((r, i) => (
                                <li key={i} className="bg-rose-50/60 rounded-md px-3 py-2.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <XCircle size={12} strokeWidth={2.5} className="text-rose-400 shrink-0" />
                                        <span className="font-mono text-xs font-medium text-rose-700">
                                            {r.employee_number || (
                                                <span className="text-slate-400">No ID</span>
                                            )}
                                        </span>
                                        <span className="text-xs text-slate-500 truncate">{r.name}</span>
                                    </div>
                                    <ul className="pl-5 space-y-0.5">
                                        {r.reasons.map((reason, ri) => (
                                            <li key={ri} className="text-[11px] text-rose-600 flex items-start gap-1.5">
                                                <span className="mt-px shrink-0">·</span>
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
        "hired_date",
        "employment_type",
        "probationary_period_months",
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
        if (FK_COLS.includes(col) || CELL_OPTIONS[col])  return 168;
        if (GOV_ID_COLS.includes(col))                   return 188;
        if (DATE_KEYS.includes(col))                     return 152;
        if (NUM_KEYS.includes(col))                      return 120;
        return 148;
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
                        className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1.5 px-2"
                    >
                        <ArrowLeft size={15} strokeWidth={2} /> Back
                    </Button>
                    <div className="w-px h-5 bg-slate-200" />
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Bulk upload employees</h2>
                </div>
            }
        >
            <Head title="Bulk Upload Employees" />

            <div className="py-4 sm:py-6">
                <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 space-y-3">

                    {/* ── Upload bar ──────────────────────────────────────── */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                        <label className="flex items-center gap-3 flex-1 cursor-pointer group min-w-0">
                            <span className="shrink-0 w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                                <Upload size={16} strokeWidth={2} />
                            </span>

                            {fileName ? (
                                <span className="text-sm font-medium text-slate-800 truncate">
                                    {fileName}
                                    <span className="text-slate-400 font-normal ml-2">
                                        {rows.length} row{rows.length !== 1 ? "s" : ""} loaded
                                    </span>
                                </span>
                            ) : (
                                <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors truncate">
                                    Upload an .xlsx file
                                    <span className="text-slate-400"> — or enter data directly in the table below</span>
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

                        <Button
                            variant="info-outline"
                            size="sm"
                            onClick={downloadEmployeeTemplate}
                            className="h-9 text-xs text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-700 shrink-0 px-3 gap-1.5 w-full sm:w-auto"
                        >
                            <Download size={13} strokeWidth={2} /> Download template
                        </Button>
                    </div>

                    {/* ── Server errors ────────────────────────────────────── */}
                    {serverErrors.length > 0 && (
                        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                            <p className="text-sm font-semibold text-rose-700 mb-2">
                                {serverErrors.length} server error{serverErrors.length > 1 ? "s" : ""}
                            </p>
                            <ul className="space-y-1 max-h-28 overflow-y-auto">
                                {serverErrors.map((err, i) => (
                                    <li key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                                        <span className="mt-px shrink-0">·</span> {err}
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
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <p className="text-sm font-semibold text-slate-900">Employees</p>
                                    <Pill count={rows.length} color="slate" />
                                    {totalErrors > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                                            <AlertTriangle size={11} strokeWidth={2.5} /> {totalErrors} with errors
                                        </span>
                                    )}
                                    {cleanCount > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                            <CheckCircle2 size={11} strokeWidth={2.5} /> {cleanCount} ready
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={addRow}
                                        className="h-8 text-xs gap-1.5 text-slate-100 border-slate-200 hover:bg-slate-50"
                                    >
                                        <Plus size={13} strokeWidth={2} /> Add row
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="warning-outline"
                                        onClick={reset}
                                        className="h-8 text-xs gap-1.5 text-rose-500 border-slate-200 hover:bg-rose-50 hover:border-rose-200"
                                    >
                                        <RotateCcw size={13} strokeWidth={2} /> Reset
                                    </Button>
                                </div>
                            </div>

                            {/* ── Tabs ─────────────────────────────────────── */}
                            <div className="border-b border-slate-200 bg-slate-50/60 overflow-x-auto">
                                <div className="flex min-w-max sm:min-w-0">
                                    {TABS.map((tab, i) => {
                                        const isActive = i === activeTab;
                                        const errCount = tabErrorCounts[i];
                                        const hasErr   = errCount > 0;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setActiveTab(i)}
                                                className={[
                                                    "flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors -mb-px sm:flex-1",
                                                    isActive
                                                        ? hasErr
                                                            ? "border-rose-500 text-rose-600 bg-white"
                                                            : "border-indigo-600 text-indigo-700 bg-white"
                                                        : hasErr
                                                            ? "border-transparent text-rose-500 hover:text-rose-600 hover:bg-rose-50/60"
                                                            : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60",
                                                ].join(" ")}
                                            >
                                                <span className="text-sm leading-none">{tab.icon}</span>
                                                {tab.label}
                                                {hasErr && (
                                                    <span className={[
                                                        "inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold leading-none",
                                                        isActive ? "bg-rose-100 text-rose-600" : "bg-rose-500 text-white",
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
                                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-260px)] w-full">
                                    <table
                                        className="border-collapse"
                                        style={{ tableLayout: "auto", width: "max-content", minWidth: "100%" }}
                                    >
                                        <thead className="sticky top-0 z-10">
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-3 py-2.5 text-center text-slate-400 font-semibold text-[11px] w-10 shrink-0">
                                                    #
                                                </th>
                                                {currentCols.map(col => {
                                                    const isDropdown = CELL_OPTIONS[col] || FK_COLS.includes(col);
                                                    const isReq      = REQUIRED.includes(col);
                                                    return (
                                                        <th
                                                            key={col}
                                                            style={{ minWidth: colMinWidth(col) }}
                                                            className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wide whitespace-nowrap border-r border-slate-100 last:border-r-0 ${
                                                                isReq ? "text-indigo-700" : "text-slate-500"
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                {colLabel(col)}
                                                                {isReq      && <span className="text-rose-400 font-bold">*</span>}
                                                                {isDropdown && <ChevronDown size={11} strokeWidth={2} className="text-slate-300" />}
                                                            </span>
                                                        </th>
                                                    );
                                                })}
                                                <th className="px-2.5 py-2.5 w-10 shrink-0" />
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

                                                const empType = String(row.employment_type ?? "");
                                                const isProb  = PROBATION_TYPES.includes(empType);

                                                return (
                                                    <tr
                                                        key={ri}
                                                        className={`border-b border-slate-100 last:border-b-0 transition-colors ${
                                                            isDup        ? "bg-orange-50/50" :
                                                            isConflict   ? "bg-amber-50/50" :
                                                            hasErr       ? "bg-rose-50/40"    :
                                                            ri % 2 === 0 ? "bg-white hover:bg-slate-50/70"
                                                                         : "bg-slate-50/40 hover:bg-slate-50/70"
                                                        }`}
                                                    >
                                                        <td className="text-center px-2 py-0 h-11 align-middle w-10">
                                                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold tabular-nums ${
                                                                isDup        ? "bg-orange-100 text-orange-600" :
                                                                isConflict   ? "bg-amber-100 text-amber-700" :
                                                                hasErr       ? "bg-rose-100 text-rose-600"       :
                                                                               "bg-slate-100 text-slate-500"
                                                            }`}>
                                                                {ri + 1}
                                                            </span>
                                                        </td>

                                                        {currentCols.map(col => {
                                                            const cellError = (fieldErrors[col] ?? [])[0];

                                                            const tdClass = `p-0 align-middle border-r border-slate-100 last:border-r-0 ${
                                                                cellError ? "ring-1 ring-inset ring-rose-300" : ""
                                                            }`;

                                                            // Contract date range doesn't apply to probationary/regular
                                                            if (CONTRACT_DATE_COLS.includes(col) && isProb) {
                                                                return (
                                                                    <td key={col} className={tdClass}>
                                                                        <NotApplicableCell />
                                                                    </td>
                                                                );
                                                            }

                                                            // Probationary-only fields don't apply to other employment types
                                                            if (PROBATION_ONLY_COLS.includes(col) && !isProb) {
                                                                return (
                                                                    <td key={col} className={tdClass}>
                                                                        <NotApplicableCell />
                                                                    </td>
                                                                );
                                                            }

                                                            return (
                                                                <td key={col} className={tdClass}>
                                                                    {col === "employee_number" && isDBConflict ? (
                                                                        <div className="relative">
                                                                            <SmartCell
                                                                                col={col}
                                                                                value={String(row[col] ?? "")}
                                                                                onChange={v => updateCell(ri, col, v)}
                                                                                fkOptions={fkOptions}
                                                                                error={cellError}
                                                                            />
                                                                            <span className="absolute top-1 right-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-600 pointer-events-none">
                                                                                <AlertTriangle size={9} strokeWidth={2.5} /> EXISTS
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

                                                        <td className="px-2 py-0 h-11 align-middle text-center w-10">
                                                            <button
                                                                onClick={() => deleteRow(ri)}
                                                                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors mx-auto"
                                                                title="Delete row"
                                                            >
                                                                <X size={13} strokeWidth={2} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Ghost / padding rows */}
                                            {Array.from({ length: Math.max(0, 8 - rows.length) }).map((_, i) => {
                                                const ri = rows.length + i;
                                                return (
                                                    <tr key={`pad-${i}`} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                                                        <td className="h-11 px-2 text-center align-middle w-10">
                                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-50 text-[10px] font-semibold text-slate-300">
                                                                {ri + 1}
                                                            </span>
                                                        </td>
                                                        {currentCols.map((col, ci) => (
                                                            <td key={col} className="h-11 border-r border-slate-100 last:border-r-0 px-3 align-middle whitespace-nowrap">
                                                                {i === 0 && rows.length === 0 && ci === Math.floor(currentCols.length / 2) && (
                                                                    <span className="text-xs text-slate-300 whitespace-nowrap">
                                                                        No data yet — type in a row or upload a file
                                                                    </span>
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td className="h-11 px-2 w-10" />
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* ── Row-level error list (footer) ──────────────── */}
                            {totalErrors > 0 && (
                                <div className="px-4 sm:px-5 py-3 border-t border-rose-100 bg-rose-50/40">
                                    <p className="text-xs font-semibold text-rose-700 mb-1.5 flex items-center gap-1.5">
                                        <AlertTriangle size={12} strokeWidth={2.5} />
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
                                                <li key={`${ri}-${ei}`} className="text-xs text-rose-600 flex items-start gap-1.5">
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
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                                <p className="text-xs text-slate-400 hidden sm:block">
                                    Click any cell to edit · Dropdowns open on click · Enter or Tab to confirm · Esc to cancel
                                </p>
                                <Button
                                    size="sm"
                                    disabled={cleanCount === 0 || uploading}
                                    onClick={handleSubmit}
                                    className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 gap-1.5 w-full sm:w-auto"
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