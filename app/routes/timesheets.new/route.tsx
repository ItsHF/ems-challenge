import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDB } from '~/db/getDB'; // Importing the getDB function

interface Employee {
    id: number;
    name: string;
}

interface Timesheet {
    employee_id: number;
    startTime: string;
    endTime: string;
    summary: string;
}

export default function NewTimesheet() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadEmployees() {
            setIsLoading(true);
            try {
                const db = await getDB();
                const employeeList: Employee[] = await db.all('SELECT id, name FROM Employees');
                setEmployees(employeeList);
            } catch (err) {
                console.error("Error loading employees:", err);
                setError("Error loading employees.");
            } finally {
                setIsLoading(false);
            }
        }

        loadEmployees();
    }, []);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const startTimeString = formData.get("startTime") as string;
        const endTimeString = formData.get("endTime") as string;

        const startTime = new Date(startTimeString);
        const endTime = new Date(endTimeString);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            setError("Invalid start or end time.");
            return;
        }

        if (startTime >= endTime) {
            setError("Start time must be before end time.");
            return;
        }

        const timesheet: Timesheet = {
            employee_id: parseInt(formData.get("employee_id") as string, 10),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            summary: formData.get("summary") as string,
        };

        try {
            const db = await getDB();
            const result = await db.run(
                `INSERT INTO Timesheets (employee_id, startTime, endTime, summary) 
                 VALUES (?, ?, ?, ?)`,
                ...Object.values(timesheet)
            );

            if (result.lastID) {
                navigate(`/timesheets/${result.lastID}`);
            } else {
                console.warn("Timesheet created, but lastID is missing.");
                navigate("/timesheets");
            }
        } catch (error) {
            console.error("Error creating timesheet:", error);
            setError("Failed to create timesheet.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">New Timesheet</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Employee *</label>
                        <select
                            name="employee_id"
                            className="mt-1 block w-full border rounded p-2"
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time *</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            className="mt-1 block w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">End Time *</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            className="mt-1 block w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Summary</label>
                        <textarea
                            name="summary"
                            className="mt-1 block w-full border rounded p-2"
                            rows={4}
                            placeholder="Describe the work done during this period..."
                        />
                    </div>

                    <div className="flex justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Timesheet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
