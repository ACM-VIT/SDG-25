'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { attendanceService } from '@/lib/attendance';
import { useAuth } from '@/lib/auth-context';

export default function StudentAttendanceTab({ classId }) {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.id) {
        console.log(' No user ID available yet');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(
          'Fetching attendance for student:',
          user.id,
          'in class:',
          classId
        );

        const response = await attendanceService.getStudentAttendance(user.id);
        console.log(' Raw API response:', response);

        if (!response) {
          console.log(' No response from API');
          setAttendance([]);
          return;
        }

        if (response.error) {
          console.error(' API returned error:', response.error);
          setError(response.error);
          return;
        }

        const records = Array.isArray(response) ? response : [];
        console.log(' Parsed records (all):', records);
        console.log(' Current classId from props:', classId);
        console.log(
          'ClassIds in records:',
          records.map((r) => r.classId)
        );

        const classRecords = records.filter((r) => {
          const matches = r.classId === classId;
          console.log(
            `  Comparing: "${r.classId}" === "${classId}" ? ${matches}`
          );
          return matches;
        });
        console.log(' Filtered class records:', classRecords);

        setAttendance(classRecords);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError(
          'Failed to load attendance records. Make sure the backend server is running.'
        );
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, user?.id]);

  const present = attendance.filter((a) => a.status === 'present').length;
  const absent = attendance.filter((a) => a.status === 'absent').length;
  const total = present + absent;
  const attendancePercentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Loading attendance records...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Please try refreshing the page
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Your Attendance</h2>

      {/* Debug Info
      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Debug Info:</strong> Querying attendance for Student ID:{' '}
          <code className="bg-white px-2 py-1 rounded">{user?.id}</code> in
          Class ID:{' '}
          <code className="bg-white px-2 py-1 rounded">{classId}</code>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Check browser console for API response details. Make sure the
          professor used this exact Student ID when marking attendance.
        </p>
      </Card> */}

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm">Present</p>
          <p className="text-3xl font-bold text-green-600">{present}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm">Absent</p>
          <p className="text-3xl font-bold text-red-600">{absent}</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-gray-600 text-sm">Attendance %</p>
          <p className="text-3xl font-bold text-blue-600">
            {attendancePercentage}%
          </p>
        </Card>
      </div>

      {attendance.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No attendance records yet</p>
        </Card>
      ) : (
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">Attendance History</h3>
          <div className="space-y-2">
            {attendance.map((record, index) => (
              <div
                key={`${record.date}-${index}`}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <p className="text-gray-700">
                  {new Date(record.date).toLocaleDateString()}
                </p>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    record.status === 'present'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {record.status === 'present' ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
