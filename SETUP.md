## EduConnect - Backend Integration Setup

### ✅ Setup Complete!

The backend is now integrated with the frontend. Classes are stored in MongoDB and accessible to both professors and students.

### 🚀 How to Run

#### 1. Start the Backend Server
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:8000`

#### 2. Start the Frontend Server
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 📝 What's Working

#### For Professors:
- ✅ Create classes (stored in MongoDB)
- ✅ View all their classes
- ✅ See student enrollment count
- ✅ Each class gets a unique 6-digit code

#### For Students:
- ✅ Join classes using 6-digit code
- ✅ View all enrolled classes
- ✅ See class details (professor name, student count)

### 🔧 API Endpoints

#### Classes
- `POST /api/classes/create` - Create a new class
- `GET /api/classes/professor/:professorId` - Get professor's classes
- `GET /api/classes/student/:studentId` - Get student's classes
- `GET /api/classes/:id` - Get single class by ID
- `POST /api/classes/join` - Join a class with code
- `GET /api/classes/code/:code` - Get class by code

### 📊 Database Schema

#### Class Model
```javascript
{
  name: String,           // Class name
  code: String,           // 6-digit unique code
  professorId: String,    // Professor's ID
  professorName: String,  // Professor's name
  students: [String],     // Array of student IDs
  createdAt: Date        // Creation timestamp
}
```

### 🔐 Environment Variables

#### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
PORT=8000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 🧪 Testing

1. **Create a class as professor:**
   - Login as professor
   - Click "+ Create Class"
   - Enter class name
   - Copy the generated 6-digit code

2. **Join class as student:**
   - Login as student
   - Click "+ Join Class"
   - Enter the 6-digit code
   - Class appears in student's list

3. **Verify in MongoDB:**
   - Check the `classes` collection
   - See the class document with students array

### 📦 Next Steps

- [ ] Add notes storage to MongoDB
- [ ] Add quizzes storage to MongoDB
- [ ] Add announcements storage to MongoDB
- [ ] Add attendance storage to MongoDB (already has model)
- [ ] Add real-time updates with Socket.io
- [ ] Add file upload for notes
- [ ] Add authentication middleware
- [ ] Add input validation with Zod
- [ ] Add error logging
- [ ] Deploy to production

### 🐛 Common Issues

**Backend not connecting:**
- Check if MongoDB URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas

**Frontend can't reach backend:**
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local

**Classes not appearing:**
- Check browser console for errors
- Verify API calls in Network tab
- Check MongoDB for data
