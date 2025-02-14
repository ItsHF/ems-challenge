import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDB } from '~/db/getDB'; 

// Get timesheet and employees from the database
async function getTimesheet(timesheetId: string) {
    const db = await getDB(); 
    if (!db) return { timesheet: null, employees: [] };

    try {
        const timesheet = await db.get(
            `
            SELECT t.*, e.name as employeeName
            FROM Timesheets t
            JOIN Employees e ON t.employee_id = e.id
            WHERE t.id = ?`,
            timesheetId
        );

        const employees = await db.all(
            `SELECT id, name FROM Employees ORDER BY name ASC`
        );

        return { timesheet, employees };
    } catch (error) {
        console.error("Error fetching timesheet:", error);
        return { timesheet: null, employees: [] };
    } finally {
        await db.close(); // Ensure the connection is closed after query
    }
}

// Update timesheet in the database
async function updateTimesheet(timesheetId: string, formData: FormData) {
    const db = await getDB();
    if (!db) return { success: false, error: "Database connection failed" };

    try {
        const startTime = new Date(formData.get("startTime") as string);
        const endTime = new Date(formData.get("endTime") as string);

        if (startTime >= endTime) {
            return { success: false, error: "Start time must be before end time" };
        }

        const updates = {
            employee_id: formData.get("employee_id"),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            summary: formData.get("summary"),
        };

        await db.run(
            `UPDATE Timesheets SET employee_id = ?, startTime = ?, endTime = ?, summary = ? WHERE id = ?`,
            ...Object.values(updates),
            timesheetId
        );

        return { success: true };
    } catch (error) {
        console.error("Error updating timesheet:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, error: errorMessage };
    } finally {
        await db.close(); // Ensure the connection is closed after query
    }
}

// Delete timesheet from the database
async function deleteTimesheet(timesheetId: string) {
    const db = await getDB();
    if (!db) return { success: false, error: "Database connection failed" };

    try {
        await db.run("DELETE FROM Timesheets WHERE id = ?", timesheetId);
        return { success: true };
    } catch (error) {
        console.error("Error deleting timesheet:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, error: errorMessage };
    } finally {
        await db.close(); // Ensure the connection is closed after query
    }
}

// TimesheetDetail component
export default function TimesheetDetail() {
    const { timesheetId } = useParams(); // Get timesheetId from URL
    const navigate = useNavigate(); // Hook for navigation
    const [timesheet, setTimesheet] = useState<any | null>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Load data from the database
    useEffect(() => {
        async function loadData() {
            const data = await getTimesheet(timesheetId || "");
            if (data.timesheet) {
                setTimesheet(data.timesheet);
                setEmployees(data.employees);
            } else {
                setError("Timesheet not found.");
            }
        }
        loadData();
    }, [timesheetId]);

    // Handle form submission for update or delete
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const intent = formData.get("intent");

        if (intent === "delete") {
            const result = await deleteTimesheet(timesheetId || "");
            if (result.success) {
                navigate("/timesheets"); // Redirect on successful delete
            } else {
                setError(result.error || "Failed to delete timesheet");
            }
        } else if (intent === "update") {
            const result = await updateTimesheet(timesheetId || "", formData);
            if (result.success) {
                navigate(`/timesheets/${timesheetId}`); // Redirect on successful update
            } else {
                setError(result.error || "Failed to update timesheet");
            }
        }
    };

    // Render error or loading state
    if (!timesheet) {
        return <div>{error || "Loading..."}</div>;
    }

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Edit Timesheet</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between pt-6">
                        <button
                            type="submit"
                            name="intent"
                            value="update"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Update Timesheet
                        </button>
                        <button
                            type="submit"
                            name="intent"
                            value="delete"
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={(e) => {
                                if (!confirm("Are you sure you want to delete this timesheet?")) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Delete Timesheet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
