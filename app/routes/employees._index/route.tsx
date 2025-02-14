// routes/employees.tsx
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "react-router-dom";
import { getEmployees } from "./route.server"; // Import from server

export const loader: LoaderFunction = async () => {
    return getEmployees(); // Fetch employees from server
};

// Define Employee type
type Employee = {
    id: number;
    name: string;
    jobTitle: string;
    department: string;
    email: string;
    phoneNumber: string;
};

export default function EmployeesIndex() {
    const employees = useLoaderData<Employee[]>(); // Fetch employees from loader

    if (!employees || employees.length === 0) {
        return <div className="p-6">No employees found.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Employees</h1>

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mb-4">
                <Link to="/employees/new" className="px-4 py-2 bg-green-500 text-white rounded">
                    + New Employee
                </Link>
                <Link to="/timesheets" className="px-4 py-2 bg-gray-500 text-white rounded">
                    View Timesheets
                </Link>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search employees..."
                className="w-full p-2 border rounded mb-4"
            />

            {/* Employee Table */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Job Title</th>
                        <th className="border p-2">Department</th>
                        <th className="border p-2">Phone</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td className="border p-2">{emp.name}</td>
                            <td className="border p-2">{emp.jobTitle}</td>
                            <td className="border p-2">{emp.department}</td>
                            <td className="border p-2">{emp.phoneNumber}</td>
                            <td className="border p-2">{emp.email}</td>
                            <td className="border p-2 space-x-2">
                                <Link to={`/employees/${emp.id}`} className="px-2 py-1 bg-blue-500 text-white rounded">
                                    View
                                </Link>
                                <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
