import { User } from "../types/user.model";

interface UserCollection {
  [id: string]: User;
}

export interface PrivateState {
  getFriends: (id: string) => UserCollection;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
}

export default function state(): PrivateState {
  const users: UserCollection = {};

  function addUser(user: User) {
    users[user.id] = user;
  }

  function removeUser(id: string) {
    delete users[id];
  }

  function getFriends(id: string) {
    const friends: UserCollection = {};
    for (const friendId in users) {
      if (friendId !== id) {
        friends[friendId] = users[friendId];
      }
    }
    return friends;
  }

  return {
    getFriends,
    addUser,
    removeUser,
  };
}
