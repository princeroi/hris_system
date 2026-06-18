<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\EmployeeStatusLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Rehire;

class EmployeeService
{
    public function all()
    {
        return Employee::with(['employmentDetails', 'personalInfo'])->latest()->get();
    }

    public function active()
    {
        return Employee::with([
                'employmentDetails.department',
                'employmentDetails.position',
                'employmentDetails.company',
                'employmentDetails.branch',
                'personalInfo',
            ])
            ->whereHas('employmentDetails', function ($q) {
                $q->where('status', 'active');
            })
            ->latest()
            ->get();
    }

    public function archive()
    {
        return Employee::with([
                'employmentDetails.department',
                'employmentDetails.position',
                'employmentDetails.company',
                'employmentDetails.branch',
                'personalInfo',
            ])
            ->whereHas('employmentDetails', function ($q) {
                $q->whereIn('status', [
                    'inactive',
                    'terminated',
                    'resigned',
                    'retired',
                    'contract_end',
                ]);
            })
            ->latest()
            ->get();
    }

    public function find(int $id): array
    {
        $employee = Employee::with([
            'personalInfo',
            'employmentDetails.company',
            'employmentDetails.branch',
            'employmentDetails.department',
            'employmentDetails.position',
            'govIds',
            'bankAccount',
            'compensation',
            'workExperience',
            'emergencyContacts',
        ])->findOrFail($id);

        return [
            'employee'          => $employee,
            'personalInfo'      => $employee->personalInfo,
            'employmentDetails' => $employee->employmentDetails,
            'govIds'            => $employee->govIds,
            'bankAccount'       => $employee->bankAccount,
            'compensation'      => $employee->compensation,
            'workExperiences'   => $employee->workExperience,
            'emergencyContacts' => $employee->emergencyContacts,
        ];
    }

    public function create(array $data)
    {
        $employee = Employee::create([
            'employee_number' => $data['employee_number'],
            'first_name'      => $data['first_name'],
            'last_name'       => $data['last_name'],
            'middle_name'     => $data['middle_name'] ?? null,
            'suffix'          => $data['suffix'] ?? null,
            // 'status'          => $data['status'] ?? 'active',
        ]);

        $employee->personalInfo()->create($this->personalInfoData($data));
        $employee->employmentDetails()->create($this->employmentDetailsData($data));
        $employee->govIds()->create($this->govIdsData($data));
        $employee->bankAccount()->create($this->bankAccountData($data));
        $employee->compensation()->create($this->compensationData($data));

        if (!empty($data['work_experiences'])) {
            foreach ($data['work_experiences'] as $entry) {
                $employee->workExperience()->create($this->workExperienceData($entry));
            }
        }

        if (!empty($data['emergency_contacts'])) {
            foreach ($data['emergency_contacts'] as $entry) {
                $employee->emergencyContacts()->create($this->emergencyContactData($entry));
            }
        }

        return $employee;
    }

    public function update(Employee $employee, array $data)
    {
        $employee->update([
            'employee_number' => $data['employee_number'],
            'first_name'      => $data['first_name'],
            'last_name'       => $data['last_name'],
            'middle_name'     => $data['middle_name'] ?? null,
            'suffix'          => $data['suffix'] ?? null,
            'status'          => $data['status'] ?? $employee->status,
        ]);

        $employee->personalInfo()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->personalInfoData($data)
        );

        $employee->employmentDetails()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->employmentDetailsData($data)
        );

        $employee->govIds()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->govIdsData($data)
        );

        $employee->bankAccount()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->bankAccountData($data)
        );

        $employee->compensation()->updateOrCreate(
            ['employee_id' => $employee->id],
            $this->compensationData($data)
        );

        if (array_key_exists('work_experiences', $data)) {
            $employee->workExperience()->delete();

            foreach ($data['work_experiences'] as $entry) {
                $employee->workExperience()->create($this->workExperienceData($entry));
            }
        }

        if (array_key_exists('emergency_contacts', $data)) {
            $employee->emergencyContacts()->delete();

            foreach ($data['emergency_contacts'] as $entry) {
                $employee->emergencyContacts()->create($this->emergencyContactData($entry));
            }
        }

        return $employee;
    }

    public function delete(Employee $employee)
    {
        return $employee->delete();
    }

    private function personalInfoData(array $data): array
    {
        return [
            'birth_date'        => $data['birth_date']        ?? null,
            'birth_place'       => $data['birth_place']       ?? null,
            'age'               => $data['age']               ?? null,
            'gender'            => $data['gender']            ?? null,
            'civil_status'      => $data['civil_status']      ?? null,
            'nationality'       => $data['nationality']       ?? null,
            'religion'          => $data['religion']          ?? null,
            'home_address'      => $data['home_address']      ?? null,
            'current_address'   => $data['current_address']   ?? null,
            'phone_number'      => $data['phone_number']      ?? null,
            'telephone_number'  => $data['telephone_number']  ?? null,
            'email'             => $data['email']             ?? null,
            'alternate_email'   => $data['alternate_email']   ?? null,
            'highest_education' => $data['highest_education'] ?? null,
            'course'            => $data['course']            ?? null,
            'school'            => $data['school']            ?? null,
        ];
    }

    private function employmentDetailsData(array $data): array
    {
        return [
            'hired_date'                   => $data['hired_date']                   ?? null,
            'regularization_date'          => $data['regularization_date']          ?? null,
            'contract_date_from'           => $data['contract_date_from']           ?? null,
            'contract_date_to'             => $data['contract_date_to']             ?? null,
            'contract_status'              => $data['contract_status']              ?? null,
            'employment_type'              => $data['employment_type']              ?? null,
            'status'                       => $data['status']                       ?? null,
            'company_id'                   => $data['company_id']                   ?? null,
            'branch_id'                    => $data['branch_id']                    ?? null,
            'department_id'                => $data['department_id']                ?? null,
            'position_id'                  => $data['position_id']                  ?? null,
            'job_level'                    => $data['job_level']                    ?? null,
            'probationary_period_months'   => $data['probationary_period_months']   ?? null,
            'probationary_evaluation_date' => $data['probationary_evaluation_date'] ?? null,
        ];
    }

    private function govIdsData(array $data): array
    {
        return [
            'sss_number'         => $data['sss_number']         ?? null,
            'sss_status'         => $data['sss_status']         ?? null,
            'sss_remarks'        => $data['sss_remarks']        ?? null,
            'pagibig_number'     => $data['pagibig_number']     ?? null,
            'pagibig_status'     => $data['pagibig_status']     ?? null,
            'pagibig_remarks'    => $data['pagibig_remarks']    ?? null,
            'philhealth_number'  => $data['philhealth_number']  ?? null,
            'philhealth_status'  => $data['philhealth_status']  ?? null,
            'philhealth_remarks' => $data['philhealth_remarks'] ?? null,
            'tin_number'         => $data['tin_number']         ?? null,
            'tin_status'         => $data['tin_status']         ?? null,
            'tin_remarks'        => $data['tin_remarks']        ?? null,
        ];
    }

    private function bankAccountData(array $data): array
    {
        return [
            'bank_name'            => $data['bank_name']            ?? null,
            'account_number'       => $data['account_number']       ?? null,
            'account_name'         => $data['account_name']         ?? null,
            'atm_card_number'      => $data['atm_card_number']      ?? null,
            'atm_status'           => $data['atm_status']           ?? null,
            'gcash_account_number' => $data['gcash_account_number'] ?? null,
            'gcash_account_name'   => $data['gcash_account_name']   ?? null,
            'other_bank_type'      => $data['other_bank_type']      ?? null,
            'other_bank_name'      => $data['other_bank_name']      ?? null,
            'other_account_number' => $data['other_account_number'] ?? null,
            'other_account_name'   => $data['other_account_name']   ?? null,
        ];
    }

    private function compensationData(array $data): array
    {
        return [
            'work_time_factor_id' => $data['work_time_factor_id'] ?? null,
            'monthly_rate'   => $data['monthly_rate']   ?? null,
            'daily_rate'     => $data['daily_rate']     ?? null,
            'hourly_rate'    => $data['hourly_rate']    ?? null,
            'payroll_type'   => $data['payroll_type']   ?? null,
            'salary_type'    => $data['salary_type']    ?? null,
            'effective_date' => $data['effective_date'] ?? null,
            'is_current'     => $data['is_current']     ?? true,
        ];
    }

    private function workExperienceData(array $entry): array
    {
        return [
            'company_name'     => $entry['company_name']     ?? null,
            'position'         => $entry['position']         ?? null,
            'department'       => $entry['department']       ?? null,
            'start_date'       => $entry['start_date']       ?? null,
            'end_date'         => $entry['end_date']         ?? null,
            'years_of_service' => $entry['years_of_service'] ?? null,
            'remarks'          => $entry['remarks']          ?? null,
        ];
    }

    private function emergencyContactData(array $entry): array
    {
        return [
            'contact_person_name'         => $entry['contact_person_name']         ?? null,
            'contact_person_relationship' => $entry['contact_person_relationship'] ?? null,
            'contact_person_phone'        => $entry['contact_person_phone']        ?? null,
            'contact_person_telephone'    => $entry['contact_person_telephone']    ?? null,
            'contact_person_address'      => $entry['contact_person_address']      ?? null,
        ];
    }

    public function changeStatus(Employee $employee, array $data): EmployeeStatusLog
    {
        if ($employee->employmentDetails?->status !== 'active') {
            throw new \RuntimeException('Only active employees can have their status changed.');
        }

        return DB::transaction(function () use ($employee, $data) {
            $previousStatus = $employee->employmentDetails?->status;

            $employee->employmentDetails()->updateOrCreate(
                ['employee_id' => $employee->id],
                ['status' => $data['new_status']]
            );

            return EmployeeStatusLog::create([
                'employee_id'       => $employee->id,
                'type'              => 'archive',
                'previous_status'   => $previousStatus,
                'new_status'        => $data['new_status'],
                'effective_date'    => $data['effective_date'],
                'last_working_date' => $data['last_working_date'] ?? null,
                'reason'            => $data['reason'] ?? null,
                'changed_by'        => Auth::id(),
                'applied_at'        => now(),
            ]);
        });
    }

    public function rehire(Employee $employee, array $data): EmployeeStatusLog
    {
        if ($employee->employmentDetails?->status === 'active') {
            throw new \RuntimeException('Employee is already active.');
        }

        return DB::transaction(function () use ($employee, $data) {
            $previousStatus = $employee->employmentDetails?->status;

            $employee->employmentDetails()->updateOrCreate(
                ['employee_id' => $employee->id],
                ['status' => 'active']
            );

            return EmployeeStatusLog::create([
                'employee_id'     => $employee->id,
                'type'            => 'rehire',
                'previous_status' => $previousStatus,
                'new_status'      => 'active',
                'effective_date'  => $data['rehire_date'],
                'reason'          => $data['reason'] ?? null,
                'changed_by'      => Auth::id(),
                'applied_at'      => now(),
            ]);
        });
    }
}