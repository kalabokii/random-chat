import { User } from "../types/user.model";

// ? This file is responsible for the state of the random chat
// ? It will keep track of all users and their status

interface UserCollection {
  [id: string]: User;
}

export interface RandomState {
  users: UserCollection;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  findFriend: (id: string) => string | undefined;
}

function state(): RandomState {
  const users: UserCollection = {};
  const queue: Set<string> = new Set();

  function addUser(user: User) {
    users[user.id] = user;
  }

  function removeUser(id: string) {
    queue.has(id) && queue.delete(id);
    delete users[id];
  }

  function findFriend(id: string) {
    if (queue.has(id)) return;
    if (queue.size === 0) {
      queue.add(id);
      return;
    } else {
      const friendId = Array.from(queue.values()).pop()!;
      queue.delete(friendId);
      return friendId;
    }
  }

  return {
    users: { ...users },
    addUser,
    removeUser,
    findFriend,
  };
}

export default state();
