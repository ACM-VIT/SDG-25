const API_BASE_URL = 'http://localhost:8000/api';

export const attendanceService = {
  async markAttendance(classId, date, entries) {
    try {
      console.log('Attendance data:', { classId, date, entries });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId, date, entries }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save attendance');
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout - Backend server is not responding!');
        console.error('   Make sure:');
        console.error('   1. Backend server is running on port 5000');
        console.error('   2. MongoDB is connected');
        throw new Error('Please check if the server is running.');
      }
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  async getAttendance(classId, date) {
    try {
      console.log('Fetching attendance for:', { classId, date });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${API_BASE_URL}/attendance/${classId}/${date}`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('Received attendance data:', data);
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
      }
      console.error('Error fetching attendance:', error);
      return { entries: [] };
    }
  },

  async getStudentAttendance(studentId) {
    try {
      console.log('Fetching attendance for student:', studentId);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 

      const response = await fetch(
        `${API_BASE_URL}/attendance/student/${studentId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log('Student attendance data received:', data);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(
          'Request timeout - Backend server not responding on port 8000'
        );
        throw new Error(
          "Backend server is not responding. Please check if it's running on port 8000."
        );
      }
      console.error(' Error fetching student attendance:', error);
      throw error;
    }
  },
};

export default attendanceService;
