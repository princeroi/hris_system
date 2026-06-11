<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeDocuments;

class EmployeeDocumentsSeeder extends Seeder
{
    public function run(): void
    {
        $documents = [
            ['employee_id' => 1, 'document_type_id' => 1, 'document_file_path' => 'documents/emp1/nbi_clearance.pdf',      'document_expiry_date' => '2025-06-01'],
            ['employee_id' => 1, 'document_type_id' => 4, 'document_file_path' => 'documents/emp1/birth_certificate.pdf',  'document_expiry_date' => null],
            ['employee_id' => 1, 'document_type_id' => 6, 'document_file_path' => 'documents/emp1/diploma.pdf',            'document_expiry_date' => null],
            ['employee_id' => 2, 'document_type_id' => 1, 'document_file_path' => 'documents/emp2/nbi_clearance.pdf',      'document_expiry_date' => '2025-03-15'],
            ['employee_id' => 2, 'document_type_id' => 4, 'document_file_path' => 'documents/emp2/birth_certificate.pdf',  'document_expiry_date' => null],
            ['employee_id' => 3, 'document_type_id' => 1, 'document_file_path' => 'documents/emp3/nbi_clearance.pdf',      'document_expiry_date' => '2025-08-01'],
            ['employee_id' => 3, 'document_type_id' => 8, 'document_file_path' => 'documents/emp3/medical_cert.pdf',       'document_expiry_date' => '2026-01-01'],
            ['employee_id' => 4, 'document_type_id' => 1, 'document_file_path' => 'documents/emp4/nbi_clearance.pdf',      'document_expiry_date' => '2025-07-01'],
            ['employee_id' => 5, 'document_type_id' => 1, 'document_file_path' => 'documents/emp5/nbi_clearance.pdf',      'document_expiry_date' => '2025-10-01'],
            ['employee_id' => 5, 'document_type_id' => 6, 'document_file_path' => 'documents/emp5/diploma.pdf',            'document_expiry_date' => null],
        ];

        foreach ($documents as $document) {
            EmployeeDocuments::create($document);
        }
    }
}