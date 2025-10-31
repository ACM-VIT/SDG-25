const storage = {
  loadClassesFromStorage() {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('educonnect_classes');
    return stored ? JSON.parse(stored) : [];
  },
  saveClassesToStorage(classes) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('educonnect_classes', JSON.stringify(classes));
  }
};

let classes = storage.loadClassesFromStorage();
console.log('Current classes:', classes);

const filteredClasses = classes.filter(cls => {
  const name = cls.name?.toLowerCase() || '';
  return !name.includes('aii') && !name.includes('dfg') && name !== 'test';
});

console.log('Filtered classes:', filteredClasses);

storage.saveClassesToStorage(filteredClasses);
console.log('Test classes removed!');
