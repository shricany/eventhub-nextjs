// In-memory database for local testing
let admins = [];
let students = [];
let events = [];
let participations = [];
let nextId = { admin: 1, student: 1, event: 1, participation: 1 };

export const db = {
  // Admin operations
  createAdmin: (admin) => {
    const newAdmin = { id: nextId.admin++, ...admin, created_at: new Date() };
    admins.push(newAdmin);
    return newAdmin;
  },
  
  findAdminByEmail: (email) => {
    return admins.find(admin => admin.email === email);
  },
  
  findAdminByUsername: (username) => {
    return admins.find(admin => admin.username === username);
  },

  // Student operations
  createStudent: (student) => {
    const newStudent = { id: nextId.student++, ...student, created_at: new Date() };
    students.push(newStudent);
    return newStudent;
  },
  
  findStudentByEmail: (email) => {
    return students.find(student => student.email === email);
  },

  // Event operations
  createEvent: (event) => {
    const newEvent = { 
      id: nextId.event++, 
      ...event, 
      is_active: true,
      created_at: new Date() 
    };
    events.push(newEvent);
    return newEvent;
  },
  
  getAllEvents: () => {
    return events.filter(event => event.is_active).map(event => ({
      ...event,
      interested_count: participations.filter(p => p.event_id === event.id && p.status === 'interested').length,
      participants_count: participations.filter(p => p.event_id === event.id && p.status === 'joined').length
    }));
  },
  
  getEventsByAdmin: (adminId) => {
    return events.filter(event => event.admin_id === adminId).map(event => ({
      ...event,
      interested_count: participations.filter(p => p.event_id === event.id && p.status === 'interested').length,
      participants_count: participations.filter(p => p.event_id === event.id && p.status === 'joined').length
    }));
  },

  // Participation operations
  createParticipation: (participation) => {
    const newParticipation = { 
      id: nextId.participation++, 
      ...participation, 
      created_at: new Date() 
    };
    participations.push(newParticipation);
    return newParticipation;
  },
  
  findParticipation: (studentId, eventId) => {
    return participations.find(p => p.student_id === studentId && p.event_id === eventId);
  },
  
  updateParticipation: (studentId, eventId, updates) => {
    const index = participations.findIndex(p => p.student_id === studentId && p.event_id === eventId);
    if (index !== -1) {
      participations[index] = { ...participations[index], ...updates };
      return participations[index];
    }
    return null;
  },
  
  deleteParticipation: (studentId, eventId) => {
    const index = participations.findIndex(p => p.student_id === studentId && p.event_id === eventId);
    if (index !== -1) {
      participations.splice(index, 1);
      return true;
    }
    return false;
  },
  
  getEventParticipations: (eventId) => {
    return participations.filter(p => p.event_id === eventId).map(p => {
      const student = students.find(s => s.id === p.student_id);
      return { ...p, student };
    });
  },
  
  getStudentParticipations: (studentId) => {
    return participations.filter(p => p.student_id === studentId);
  }
};

export function initDatabase() {
  console.log('In-memory database initialized successfully');
}