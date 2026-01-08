import useLocalStorage from './useLocalStorage';
import initialEmployeesData from '../api/employees.json';
import type { EmployeeData, EmployeeDocuments } from '../types/employee';


const initialEmployees = initialEmployeesData as EmployeeData[];

export const useEmployees = () => {
    const [employees, setEmployees] = useLocalStorage<EmployeeData[]>('employees-data', initialEmployees);
    const [allDocuments, setAllDocuments] = useLocalStorage<Record<number, EmployeeDocuments>>('employee-documents', {});

    const getEmployee = (id: number) => employees.find(emp => emp.id === id);

    const addEmployee = (employee: Omit<EmployeeData, 'id'>, documents?: EmployeeDocuments) => {
        const newId = Math.max(0, ...employees.map(e => e.id)) + 1;
        const newEmployee: EmployeeData = { ...employee, id: newId };
        setEmployees(prev => [newEmployee, ...prev]);
        if (documents) {
            setAllDocuments(prev => ({ ...prev, [newId]: documents }));
        }
        return newEmployee;
    };

    const updateEmployee = (id: number, employee: Partial<EmployeeData>, documents?: EmployeeDocuments) => {
        setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employee } : emp));
        if (documents) {
            setAllDocuments(prev => ({ ...prev, [id]: documents }));
        }
    };

    const deleteEmployee = (id: number) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        setAllDocuments(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const getEmployeeDocuments = (id: number) => allDocuments[id] || {
        passportPic: null,
        cnicPdf: null,
        prevSalarySlip: null,
        intermediateDegree: null,
        bachelorsDegree: null
    };

    return {
        employees,
        getEmployee,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeDocuments,
        allDocuments,
        setEmployees
    };
};
