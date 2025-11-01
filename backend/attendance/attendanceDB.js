class AttendanceDB {
  constructor() {
    this.attendance = [];
    this.nextId = 1;
  }

  async save(classId, date, entries) {
    const dateStr = new Date(date).toDateString();
    const existingIndex = this.attendance.findIndex(
      (record) => record.classId === classId && record.date === dateStr
    );

    const attendanceRecord = {
      id:
        existingIndex >= 0 ? this.attendance[existingIndex].id : this.nextId++,
      classId,
      date: dateStr,
      entries,
      createdAt:
        existingIndex >= 0
          ? this.attendance[existingIndex].createdAt
          : new Date(),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      this.attendance[existingIndex] = attendanceRecord;
      return { message: 'Attendance updated', attendance: attendanceRecord };
    } else {
      this.attendance.push(attendanceRecord);
      return { message: 'Attendance created', attendance: attendanceRecord };
    }
  }

  // Find attendance by class and date
  async findByClassAndDate(classId, date) {
    const dateStr = new Date(date).toDateString();
    return this.attendance.find(
      (record) => record.classId === classId && record.date === dateStr
    );
  }

  // Find all attendance for a student
  async findByStudent(studentId) {
    const studentRecords = [];

    this.attendance.forEach((record) => {
      const studentEntry = record.entries.find(
        (entry) => entry.studentId === studentId
      );
      if (studentEntry) {
        studentRecords.push({
          classId: record.classId,
          date: record.date,
          status: studentEntry.status,
          recordId: record.id,
        });
      }
    });

    return studentRecords;
  }

  // Get all attendance records
  async findAll() {
    return this.attendance;
  }

  // Get attendance summary for a class
  async getClassSummary(classId) {
    const classRecords = this.attendance.filter(
      (record) => record.classId === classId
    );
    return classRecords.map((record) => ({
      date: record.date,
      totalStudents: record.entries.length,
      presentCount: record.entries.filter((entry) => entry.status === 'present')
        .length,
      absentCount: record.entries.filter((entry) => entry.status === 'absent')
        .length,
      entries: record.entries,
    }));
  }
}

const attendanceDB = new AttendanceDB();

export default attendanceDB;
