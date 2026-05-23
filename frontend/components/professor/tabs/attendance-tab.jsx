'use client';

import { useState, useEffect } from 'react';
import { attendanceService } from '@/lib/attendance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AttendanceTab({
  classId,
  classData: initialClassData,
}) {
  const [classData, setClassData] = useState(initialClassData || null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (initialClassData) {
      console.log('Using provided class data:', initialClassData);
      setClassData(initialClassData);
    } else if (!classData) {
      console.log(' No class data provided, using default structure');
      setClassData({
        id: classId,
        name: 'Current Class',
        students: [], 
      });
    }
  }, [classId, initialClassData]);

  useEffect(() => {
    const loadAttendance = async () => {
      if (classId && selectedDate) {
        try {
          setLoading(true);
          const existingAttendance = await attendanceService.getAttendance(
            classId,
            selectedDate
          );

          const attendanceMap = {};
          if (existingAttendance && existingAttendance.entries) {
            existingAttendance.entries.forEach((entry) => {
              attendanceMap[entry.studentId] = entry.status;
            });
          }
          setAttendance(attendanceMap);
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Error loading attendance:', error);
          setAttendance({});
          setHasUnsavedChanges(false);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAttendance();
  }, [classId, selectedDate]);

  const handleMarkAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setHasUnsavedChanges(true);
  };

  const saveAllAttendance = async () => {
    if (!classData) {
      alert('Class data not available');
      return;
    }

    const students = classData.students || [];

    if (students.length === 0) {
      alert('No students in this class yet. Add students first.');
      return;
    }

    try {
      setSaving(true);
      const entries = students.map((studentId) => ({
        studentId,
        status: attendance[studentId] || 'absent',
      }));

      await attendanceService.markAttendance(classId, selectedDate, entries);
      alert('Attendance saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getStudentStatus = (studentId) => {
    return attendance[studentId];
  };

  if (!classData)
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Loading Class Data...
        </h2>
        <p className="text-gray-600">
          Please wait while we load the class information.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Mark Attendance
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading attendance data...</p>
        </Card>
      ) : !classData.students || classData.students.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No students in this class yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {classData.students.map((studentId, index) => {
            const status = getStudentStatus(studentId);
            return (
              <Card
                key={studentId}
                className="p-6 flex flex-row items-center justify-between border-2 border-gray-200 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <p className="font-medium text-gray-800">
                    Student {index + 1} (ID: {studentId})
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'present'
                        ? 'bg-green-100 text-green-800'
                        : status === 'absent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {status || 'Not marked'}
                  </span>
                </div>
                <div className="flex gap-4 shrink-0">
                  <button
                    onClick={() => handleMarkAttendance(studentId, 'present')}
                    disabled={saving}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      status === 'present'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 bg-white hover:border-green-400'
                    }`}
                  >
                    <svg
                      className={`w-7 h-7 ${
                        status === 'present'
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(studentId, 'absent')}
                    disabled={saving}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                      status === 'absent'
                        ? 'border-red-600 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-red-400'
                    }`}
                  >
                    <svg
                      className={`w-7 h-7 ${
                        status === 'absent' ? 'text-red-600' : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </Card>
            );
          })}

          {/* Save Button */}
          <div className="flex justify-end items-center gap-4 mt-6">
            {hasUnsavedChanges && (
              <p className="text-orange-600 text-sm">
                 You have unsaved changes
              </p>
            )}
            <Button
              onClick={saveAllAttendance}
              disabled={saving || loading}
              className={`px-6 py-2 ${
                hasUnsavedChanges
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving
                ? 'Saving...'
                : hasUnsavedChanges
                ? 'Save Changes'
                : 'Save Attendance'}
            </Button>
          </div>
        </div>
      )}

      {/* Attendance Summary */}
      {classData.students && classData.students.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">
                {classData.students.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  classData.students.filter(
                    (s) => getStudentStatus(s) === 'present'
                  ).length
                }
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  classData.students.filter(
                    (s) => getStudentStatus(s) === 'absent'
                  ).length
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
