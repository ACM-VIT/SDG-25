const STORAGE_KEY = 'educonnect_classes'
const NOTES_KEY = 'educonnect_notes'
const ATTENDANCE_KEY = 'educonnect_attendance'
const QUIZZES_KEY = 'educonnect_quizzes'
const ANNOUNCEMENTS_KEY = 'educonnect_announcements'

const loadClassesFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading classes from storage:', error)
    return []
  }
}

const saveClassesToStorage = (classes) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
    console.log('Classes saved to localStorage:', classes)
  } catch (error) {
    console.error('Error saving classes to storage:', error)
  }
}

const loadNotesFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(NOTES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading notes from storage:', error)
    return []
  }
}

const saveNotesToStorage = (notes) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('Error saving notes to storage:', error)
  }
}

const loadAttendanceFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading attendance from storage:', error)
    return []
  }
}

const saveAttendanceToStorage = (attendance) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance))
  } catch (error) {
    console.error('Error saving attendance to storage:', error)
  }
}

const loadQuizzesFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(QUIZZES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading quizzes from storage:', error)
    return []
  }
}

const saveQuizzesToStorage = (quizzes) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes))
  } catch (error) {
    console.error('Error saving quizzes to storage:', error)
  }
}

const loadAnnouncementsFromStorage = () => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(ANNOUNCEMENTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading announcements from storage:', error)
    return []
  }
}

const saveAnnouncementsToStorage = (announcements) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(announcements))
  } catch (error) {
    console.error('Error saving announcements to storage:', error)
  }
}

let classes = loadClassesFromStorage()
let notes = loadNotesFromStorage()
let attendance = loadAttendanceFromStorage()
let quizzes = loadQuizzesFromStorage()
let announcements = loadAnnouncementsFromStorage()

export const classStorage = {
  create: (name, professorId, professorName) => {
    // Generate a proper 6-character alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    const newClass = {
      id: Date.now().toString(),
      name,
      code,
      professorId,
      professorName,
      students: [],
      createdAt: new Date().toISOString(),
    }
    classes.push(newClass)
    saveClassesToStorage(classes)
    console.log('Created class with code:', code, newClass)
    return newClass
  },

  getAll: () => {
    classes = loadClassesFromStorage()
    return classes
  },

  getById: (id) => {
    classes = loadClassesFromStorage()
    return classes.find((c) => c.id === id)
  },

  getByCode: (code) => {
    classes = loadClassesFromStorage()
    console.log('Looking for class with code:', code, 'Available classes:', classes)
    return classes.find((c) => c.code === code.toUpperCase())
  },

  getProfessorClasses: (professorId) => {
    classes = loadClassesFromStorage()
    return classes.filter((c) => c.professorId === professorId)
  },

  getStudentClasses: (studentId) => {
    classes = loadClassesFromStorage()
    return classes.filter((c) => c.students.includes(studentId))
  },

  joinClass: (classId, studentId) => {
    classes = loadClassesFromStorage()
    const cls = classes.find((c) => c.id === classId)
    if (cls && !cls.students.includes(studentId)) {
      cls.students.push(studentId)
      saveClassesToStorage(classes)
      console.log('Student', studentId, 'joined class', cls.name, 'Students now:', cls.students)
    }
    return cls
  },
}

export const noteStorage = {
  create: (classId, title, content, uploadedBy) => {
    notes = loadNotesFromStorage()
    const newNote = {
      id: Date.now().toString(),
      classId,
      title,
      content,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
    }
    notes.push(newNote)
    saveNotesToStorage(notes)
    return newNote
  },

  getByClass: (classId) => {
    notes = loadNotesFromStorage()
    return notes.filter((n) => n.classId === classId)
  },

  delete: (id) => {
    notes = loadNotesFromStorage()
    notes = notes.filter((n) => n.id !== id)
    saveNotesToStorage(notes)
  },
}

export const attendanceStorage = {
  create: (classId, studentId, status, date = new Date()) => {
    attendance = loadAttendanceFromStorage()
    const newAttendance = {
      id: Date.now().toString(),
      classId,
      date: date.toISOString(),
      studentId,
      status,
    }
    attendance.push(newAttendance)
    saveAttendanceToStorage(attendance)
    return newAttendance
  },

  getByClass: (classId) => {
    attendance = loadAttendanceFromStorage()
    return attendance.filter((a) => a.classId === classId)
  },

  getByStudent: (classId, studentId) => {
    attendance = loadAttendanceFromStorage()
    return attendance.filter((a) => a.classId === classId && a.studentId === studentId)
  },

  markAttendance: (classId, studentId, status) => {
    attendance = loadAttendanceFromStorage()
    const today = new Date().toISOString().split('T')[0]
    
    // Check if attendance already marked for today
    const existingIndex = attendance.findIndex(
      (a) => a.classId === classId && 
             a.studentId === studentId && 
             a.date.split('T')[0] === today
    )
    
    if (existingIndex >= 0) {
      // Update existing
      attendance[existingIndex].status = status
    } else {
      // Create new
      attendance.push({
        id: Date.now().toString(),
        classId,
        date: new Date().toISOString(),
        studentId,
        status,
      })
    }
    saveAttendanceToStorage(attendance)
    return attendance
  },
}

export const quizStorage = {
  create: (classId, title, questions, createdBy) => {
    quizzes = loadQuizzesFromStorage()
    const newQuiz = {
      id: Date.now().toString(),
      classId,
      title,
      questions,
      createdBy,
      createdAt: new Date().toISOString(),
    }
    quizzes.push(newQuiz)
    saveQuizzesToStorage(quizzes)
    return newQuiz
  },

  getByClass: (classId) => {
    quizzes = loadQuizzesFromStorage()
    return quizzes.filter((q) => q.classId === classId)
  },

  getById: (id) => {
    quizzes = loadQuizzesFromStorage()
    return quizzes.find((q) => q.id === id)
  },
}

export const announcementStorage = {
  create: (classId, title, content, createdBy) => {
    announcements = loadAnnouncementsFromStorage()
    const newAnnouncement = {
      id: Date.now().toString(),
      classId,
      title,
      content,
      createdBy,
      createdAt: new Date().toISOString(),
    }
    announcements.push(newAnnouncement)
    saveAnnouncementsToStorage(announcements)
    return newAnnouncement
  },

  getByClass: (classId) => {
    announcements = loadAnnouncementsFromStorage()
    return announcements.filter((a) => a.classId === classId)
  },
}

export const clearStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(NOTES_KEY)
    localStorage.removeItem(ATTENDANCE_KEY)
    localStorage.removeItem(QUIZZES_KEY)
    localStorage.removeItem(ANNOUNCEMENTS_KEY)
    classes = []
    notes = []
    attendance = []
    quizzes = []
    announcements = []
    console.log('All storage cleared')
  }
}

export const getStorageStats = () => {
  classes = loadClassesFromStorage()
  notes = loadNotesFromStorage()
  attendance = loadAttendanceFromStorage()
  quizzes = loadQuizzesFromStorage()
  announcements = loadAnnouncementsFromStorage()
  
  return {
    totalClasses: classes.length,
    totalNotes: notes.length,
    totalAttendance: attendance.length,
    totalQuizzes: quizzes.length,
    totalAnnouncements: announcements.length,
    classes: classes,
  }
}
