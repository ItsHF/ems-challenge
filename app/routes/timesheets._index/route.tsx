// routes/timesheets.tsx
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "react-router-dom";
import { getTimesheets } from "./route.server"; // Fetch timesheets from the server

export const loader: LoaderFunction = async () => {
    return getTimesheets(); // Fetch timesheets from database
};

// Define Timesheet type
type Timesheet = {
    id: number;
    employeeName: string;
    date: string;
    hoursWorked: number;
    notes?: string;
};

export default function TimesheetsIndex() {
    const timesheets = useLoaderData<Timesheet[]>(); // Fetch timesheets from loader

    if (!timesheets || timesheets.length === 0) {
        return <div className="p-6">No timesheets found.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Timesheets</h1>

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mb-4">
                <Link to="/timesheets/new" className="px-4 py-2 bg-green-500 text-white rounded">
                    + New Timesheet
                </Link>
                <Link to="/employees" className="px-4 py-2 bg-gray-500 text-white rounded">
                    View Employees
                </Link>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search timesheets..."
                className="w-full p-2 border rounded mb-4"
            />

            {/* Timesheet Table */}
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="border p-2">Employee Name</th>
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Hours Worked</th>
                        <th className="border p-2">Notes</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {timesheets.map((timesheet) => (
                        <tr key={timesheet.id}>
                            <td className="border p-2">{timesheet.employeeName}</td>
                            <td className="border p-2">{timesheet.date}</td>
                            <td className="border p-2">{timesheet.hoursWorked}</td>
                            <td className="border p-2">{timesheet.notes || "—"}</td>
                            <td className="border p-2 space-x-2">
                                <Link to={`/timesheets/${timesheet.id}`} className="px-2 py-1 bg-blue-500 text-white rounded">
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
