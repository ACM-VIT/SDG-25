import { useEffect, useState } from 'react';
import { attendanceService } from '../../lib/attendance.js';

export default function AttendanceView({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching attendance for student:', studentId);
        const response = await attendanceService.getStudentAttendance(
          studentId
        );
        console.log('API response:', response);

        const data = Array.isArray(response) ? response : [];
        setRecords(data);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError(
          'Failed to fetch attendance records. Make sure backend server is running on port 8000.'
        );
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAttendance();
    }
  }, [studentId]);

  if (loading) return <div>Loading attendance records...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Attendance</h2>
      {records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.classId}</td>
                <td style={{ color: r.status === 'present' ? 'green' : 'red' }}>
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
