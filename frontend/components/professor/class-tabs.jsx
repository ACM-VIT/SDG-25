'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dummyClasses } from '@/lib/dummy-data';
import { classStorage } from '@/lib/storage';
import NotesTab from './tabs/notes-tab';
import AttendanceTab from './tabs/attendance-tab';
import QuizTab from './tabs/quiz-tab';
import AnnouncementTab from './tabs/announcement-tab';

export default function ClassTabs({ classId, activeTab, setActiveTab }) {
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    let cls = classStorage.getById(classId);
    if (!cls) {
      cls = dummyClasses.find((c) => c.id === classId);
    }
    setClassData(cls);
  }, [classId]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'quiz', label: 'Quiz/Assignments' },
    { id: 'announcements', label: 'Announcements' },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            className={`whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && (
          <OverviewTab classId={classId} classData={classData} />
        )}
        {activeTab === 'notes' && <NotesTab classId={classId} />}
        {activeTab === 'attendance' && (<AttendanceTab classId={classId} classData={classData} />
        )}
        {activeTab === 'quiz' && <QuizTab classId={classId} />}
        {activeTab === 'announcements' && <AnnouncementTab classId={classId} />}
      </div>
    </div>
  );
}

function OverviewTab({ classId, classData: initialClassData }) {
  const [classData, setClassData] = useState(initialClassData);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialClassData) {
      setClassData(initialClassData);
    } else {
      let cls = classStorage.getById(classId);
      if (!cls) {
        cls = dummyClasses.find((c) => c.id === classId);
      }
      setClassData(cls);
    }
  }, [classId, initialClassData]);

  const copyCode = () => {
    if (classData?.code) {
      navigator.clipboard.writeText(classData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!classData) {
    return (
      <Card className="p-6">
        <p>Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Class Overview</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-blue-600">
            {classData.students?.length || 0}
          </p>
        </div>
        <div>
          <p className="text-gray-600 text-sm mb-2">Class Code</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-mono font-bold text-gray-800">
              {classData.code}
            </p>
            <button
              onClick={copyCode}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
              title="Copy code"
            >
              {copied ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Share this code with your students</strong> so they can join
          your class. Students can enter this code in the "Join Class" section.
        </p>
      </div>

      {classData.students && classData.students.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Enrolled Students
          </h3>
          <div className="space-y-2">
            {classData.students.map((studentId, index) => (
              <div
                key={studentId}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Student ID: {studentId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
