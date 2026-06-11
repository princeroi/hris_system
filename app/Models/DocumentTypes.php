<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentTypes extends Model
{
    protected $table = 'document_types';

    protected $fillable = [
        'document_type_name',
    ];

    public function employeeDocument() : HasMany 
    {
        return $this->belongsTo('EmployeeDocuments', 'document_type_id', 'id');
    }
}
