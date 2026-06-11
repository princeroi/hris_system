<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocuments extends Model
{
    protected $table = 'employee_documents';

    protected $fillable = [
        'employee_id',
        'document_type_id',
        'document_file_path',
        'document_expiry_date',
    ];

    protected $casts = [
        'document_expiry_date'      => 'date',
    ];

}
