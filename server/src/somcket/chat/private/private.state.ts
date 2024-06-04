import { User } from "../types/user.model";

interface UserCollection {
  [id: string]: User;
}

function state() {
  const users: UserCollection = {};

  function addUser(user: User) {
    users[user.id] = user;
  }

  function removeUser(id: string) {
    delete users[id];
  }

  return {
    users,
    addUser,
    removeUser,
  };
}

export default state();
