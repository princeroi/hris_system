import ExcelJS from "exceljs";

export async function downloadEmployeeTemplate() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Employees");

    const columns = [
        // Step 1 - Personal Info
        { header: "employee_number *", key: "employee_number", width: 18 },
        { header: "first_name *",      key: "first_name",      width: 18 },
        { header: "middle_name",       key: "middle_name",     width: 18 },
        { header: "last_name *",       key: "last_name",       width: 18 },
        { header: "suffix",            key: "suffix",          width: 10 },
        { header: "birth_date",        key: "birth_date",      width: 14 },
        { header: "birth_place",       key: "birth_place",     width: 20 },
        { header: "gender",            key: "gender",          width: 12 },
        { header: "civil_status",      key: "civil_status",    width: 14 },
        { header: "nationality",       key: "nationality",     width: 14 },
        { header: "religion",          key: "religion",        width: 14 },
        { header: "home_address",      key: "home_address",    width: 30 },
        { header: "current_address",   key: "current_address", width: 30 },
        { header: "phone_number",      key: "phone_number",    width: 16 },
        { header: "telephone_number",  key: "telephone_number",width: 16 },
        { header: "email",             key: "email",           width: 24 },
        { header: "alternate_email",   key: "alternate_email", width: 24 },
        { header: "highest_education", key: "highest_education",width: 20 },
        { header: "course",            key: "course",          width: 20 },
        { header: "school",            key: "school",          width: 28 },
        // Step 2 - Employment
        { header: "employment_type",   key: "employment_type", width: 16 },
        { header: "status",            key: "status",          width: 14 },
        { header: "hired_date",        key: "hired_date",      width: 14 },
        { header: "regularization_date", key: "regularization_date", width: 20 },
        { header: "contract_date_from",key: "contract_date_from", width: 18 },
        { header: "contract_date_to",  key: "contract_date_to",   width: 18 },
        { header: "contract_status",   key: "contract_status", width: 16 },
        { header: "company_id",        key: "company_id",      width: 12 },
        { header: "branch_id",         key: "branch_id",       width: 12 },
        { header: "department_id",     key: "department_id",   width: 14 },
        { header: "position_id",       key: "position_id",     width: 12 },
        { header: "job_level",         key: "job_level",       width: 12 },
        { header: "probationary_period_months", key: "probationary_period_months", width: 24 },
        // Step 3 - Gov IDs
        { header: "sss_number",        key: "sss_number",      width: 16 },
        { header: "sss_status",        key: "sss_status",      width: 16 },
        { header: "pagibig_number",    key: "pagibig_number",  width: 16 },
        { header: "pagibig_status",    key: "pagibig_status",  width: 16 },
        { header: "philhealth_number", key: "philhealth_number", width: 18 },
        { header: "philhealth_status", key: "philhealth_status", width: 18 },
        { header: "tin_number",        key: "tin_number",      width: 16 },
        { header: "tin_status",        key: "tin_status",      width: 14 },
        // Step 4 - Bank
        { header: "bank_name",         key: "bank_name",       width: 18 },
        { header: "account_name",      key: "account_name",    width: 20 },
        { header: "account_number",    key: "account_number",  width: 20 },
        { header: "atm_card_number",   key: "atm_card_number", width: 20 },
        { header: "atm_status",        key: "atm_status",      width: 14 },
        // Step 5 - Compensation
        { header: "monthly_rate",      key: "monthly_rate",    width: 14 },
        { header: "daily_rate",        key: "daily_rate",      width: 12 },
        { header: "hourly_rate",       key: "hourly_rate",     width: 12 },
        { header: "payroll_type",      key: "payroll_type",    width: 14 },
        { header: "salary_type",       key: "salary_type",     width: 16 },
        { header: "effective_date",    key: "effective_date",  width: 14 },
    ];

    ws.columns = columns;

    // Header row styling
    const headerRow = ws.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FF1E3A8A" }, size: 11 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = {
            bottom: { style: "thin", color: { argb: "FF93C5FD" } },
        };
    });
    headerRow.height = 36;

    // Notes sheet — valid enum values for dropdowns
    const notes = wb.addWorksheet("Reference");
    notes.getCell("A1").value = "gender";
    notes.getCell("A2").value = "Male";
    notes.getCell("A3").value = "Female";

    notes.getCell("B1").value = "civil_status";
    ["Single","Married","Divorced","Widowed"].forEach((v, i) => notes.getCell(`B${i+2}`).value = v);

    notes.getCell("C1").value = "employment_type";
    ["probationary","regular","project_based","contractual","reliever","part_time","intern"].forEach((v,i) => notes.getCell(`C${i+2}`).value = v);

    notes.getCell("D1").value = "status";
    ["active","inactive","on_leave","terminated","resigned","retired","contract_end"].forEach((v,i) => notes.getCell(`D${i+2}`).value = v);

    notes.getCell("E1").value = "sss/pagibig/philhealth/tin _status";
    ["for_verification","verified","no_sss","no_pagibig","no_philhealth","no_tin"].forEach((v,i) => notes.getCell(`E${i+2}`).value = v);

    notes.getCell("F1").value = "atm_status";
    ["active","pending","released","inactive"].forEach((v,i) => notes.getCell(`F${i+2}`).value = v);

    notes.getCell("G1").value = "payroll_type";
    ["monthly","semi_monthly","weekly","daily","hourly"].forEach((v,i) => notes.getCell(`G${i+2}`).value = v);

    notes.getCell("H1").value = "salary_type";
    ["monthly_rate","semi_monthly_rate","weekly_rate","daily_rate","hourly_rate"].forEach((v,i) => notes.getCell(`H${i+2}`).value = v);

    notes.getCell("I1").value = "Dates: YYYY-MM-DD";
    notes.getCell("I2").value = "e.g. 2024-03-01";

    // Style reference headers
    ["A1","B1","C1","D1","E1","F1","G1","H1","I1"].forEach(addr => {
        const c = notes.getCell(addr);
        c.font = { bold: true, color: { argb: "FF1E3A8A" } };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDBEAFE" } };
    });

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_bulk_upload_template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
}