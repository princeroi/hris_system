<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentTypes;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['document_type_name' => 'NBI Clearance'],
            ['document_type_name' => 'Police Clearance'],
            ['document_type_name' => 'Barangay Clearance'],
            ['document_type_name' => 'Birth Certificate (PSA)'],
            ['document_type_name' => 'Marriage Certificate (PSA)'],
            ['document_type_name' => 'Diploma / Transcript of Records'],
            ['document_type_name' => 'Employment Certificate'],
            ['document_type_name' => 'Medical Certificate'],
            ['document_type_name' => 'Valid Government ID'],
            ['document_type_name' => 'Resume / Curriculum Vitae'],
        ];

        foreach ($types as $type) {
            DocumentTypes::create($type);
        }
    }
}