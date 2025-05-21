import React, { createContext, useState, useEffect } from 'react';

export const UsersContext = createContext({
  users: [],
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
});

/*const defaultUsers = [
  { email: 'user@example.com', password: 'user123', role: 'user', name: 'Diana', surname: 'Test' },
  { email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin', surname: 'Test' },
  { email: 'employer@example.com', password: 'employer123', role: 'company_employer', name: 'Facebook', surname: 'Test' },
];*/

const defaultUsers = [
  {
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    name: 'Diana',
    surname: 'Test',
    profileImage: '',
    experience: [
      {
        title: 'Frontend Developer',
        company: 'TechCorp',
        startDate: '2022-06-01',
        endDate: '2023-08-01',
        description: 'Developed responsive web interfaces using React and Bootstrap.'
      }
    ],
    education: [
      {
        institution: 'University of Bucharest',
        degree: 'Bachelor of Computer Science',
        startDate: '2018-10-01',
        endDate: '2022-06-30',
        description: 'Studied computer science fundamentals and software development.'
      }
    ]
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin',
    surname: 'Test',
    profileImage: '',
    experience: [],
    education: []
  },
  {
    email: 'employer@example.com',
    password: 'employer123',
    role: 'company_employer',
    name: 'Facebook',
    surname: 'Test',
    profileImage: '',
    experience: [
      {
        title: 'HR Manager',
        company: 'Facebook',
        startDate: '2020-01-01',
        endDate: '',
        description: 'Managing recruitment and employer branding activities.'
      }
    ],
    education: []
  }
];


export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];

    const mergedUsers = [...parsedUsers];

    defaultUsers.forEach(defaultUser => {
      if (!mergedUsers.find(u => u.email === defaultUser.email)) {
        mergedUsers.push(defaultUser);
      }
    });

    localStorage.setItem('users', JSON.stringify(mergedUsers));
    return mergedUsers;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser) => {
    setUsers(prev =>
      prev.map(user => (user.email === updatedUser.email ? updatedUser : user))
    );
  };

  const deleteUser = (email) => {
    setUsers(prev => prev.filter(user => user.email !== email));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};