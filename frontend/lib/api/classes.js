export const classAPI = {
  async create(name, professorId, professorName) {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, professorId, professorName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class');
      }

      return data.class;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  },

  async getProfessorClasses(professorId) {
    try {
      const response = await fetch(`/api/classes?professorId=${professorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch classes');
      }

      return data.classes || [];
    } catch (error) {
      console.error('Error fetching professor classes:', error);
      throw error;
    }
  },

  async getStudentClasses(studentId) {
    try {
      const response = await fetch(`/api/classes?studentId=${studentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch classes');
      }

      return data.classes || [];
    } catch (error) {
      console.error('Error fetching student classes:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      console.log('Fetching class by ID:', id);
      const response = await fetch(`/api/classes/${id}`);
      const data = await response.json();

      console.log('API response:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch class');
      }

      return data.class;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  },

  async joinClass(code, studentId) {
    try {
      const response = await fetch('/api/classes/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, studentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join class');
      }

      return data.class;
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  },
};
