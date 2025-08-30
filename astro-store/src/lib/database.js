import users from '../data/users.json';

export const db = {
  users: {
    findMany: async () => {
      return users;
    },
    findUnique: async ({ where: { email } }) => {
      return users.find(user => user.email === email);
    },
    create: async ({ data }) => {
      const newUser = { ...data, id: users.length + 1 };
      users.push(newUser);
      return newUser;
    },
  },
};
