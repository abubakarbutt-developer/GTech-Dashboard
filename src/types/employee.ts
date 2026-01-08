export interface EmployeeData {
    id: number;
    name: string;
    cnic: string;
    contact: string;
    designation: string;
    startedDate: string;
    status: 'active' | 'inactive';
    department: string;
    salary: string;
    companyEmail: string;
}

export interface EmployeeDocuments {
    passportPic: string | null;
    cnicPdf: string | null;
    prevSalarySlip: string | null;
    intermediateDegree: string | null;
    bachelorsDegree: string | null;
}
