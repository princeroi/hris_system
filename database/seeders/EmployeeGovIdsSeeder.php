<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeGovIds;

class EmployeeGovIdsSeeder extends Seeder
{
    public function run(): void
    {
        $govIds = [
            [
                'employee_id'         => 1,
                'sss_number'          => '34-5678901-2',
                'sss_status'          => 'verified',
                'sss_remarks'         => null,
                'pagibig_number'      => '1234-5678-9012',
                'pagibig_status'      => 'verified',
                'pagibig_remarks'     => null,
                'philhealth_number'   => '12-345678901-2',
                'philhealth_status'   => 'verified',
                'philhealth_remarks'  => null,
                'tin_number'          => '123-456-789-000',
                'tin_status'          => 'verified',
                'tin_remarks'         => null,
            ],
            [
                'employee_id'         => 2,
                'sss_number'          => '34-6789012-3',
                'sss_status'          => 'verified',
                'sss_remarks'         => null,
                'pagibig_number'      => '2345-6789-0123',
                'pagibig_status'      => 'verified',
                'pagibig_remarks'     => null,
                'philhealth_number'   => '12-456789012-3',
                'philhealth_status'   => 'verified',
                'philhealth_remarks'  => null,
                'tin_number'          => '234-567-890-000',
                'tin_status'          => 'verified',
                'tin_remarks'         => null,
            ],
            [
                'employee_id'         => 3,
                'sss_number'          => '34-7890123-4',
                'sss_status'          => 'verified',
                'sss_remarks'         => null,
                'pagibig_number'      => '3456-7890-1234',
                'pagibig_status'      => 'verified',
                'pagibig_remarks'     => null,
                'philhealth_number'   => '12-567890123-4',
                'philhealth_status'   => 'verified',
                'philhealth_remarks'  => null,
                'tin_number'          => '345-678-901-000',
                'tin_status'          => 'for_verification',
                'tin_remarks'         => 'For updating',
            ],
            [
                'employee_id'         => 4,
                'sss_number'          => '34-8901234-5',
                'sss_status'          => 'verified',
                'sss_remarks'         => null,
                'pagibig_number'      => '4567-8901-2345',
                'pagibig_status'      => 'verified',
                'pagibig_remarks'     => null,
                'philhealth_number'   => '12-678901234-5',
                'philhealth_status'   => 'verified',
                'philhealth_remarks'  => null,
                'tin_number'          => '456-789-012-000',
                'tin_status'          => 'verified',
                'tin_remarks'         => null,
            ],
            [
                'employee_id'         => 5,
                'sss_number'          => '34-9012345-6',
                'sss_status'          => 'verified',
                'sss_remarks'         => null,
                'pagibig_number'      => '5678-9012-3456',
                'pagibig_status'      => 'verified',
                'pagibig_remarks'     => null,
                'philhealth_number'   => '12-789012345-6',
                'philhealth_status'   => 'verified',
                'philhealth_remarks'  => null,
                'tin_number'          => '567-890-123-000',
                'tin_status'          => 'verified',
                'tin_remarks'         => null,
            ],
        ];

        foreach ($govIds as $govId) {
            EmployeeGovIds::create($govId);
        }
    }
}