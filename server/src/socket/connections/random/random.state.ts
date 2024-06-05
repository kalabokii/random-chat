import { User } from "../types/user.model";

interface UserCollection {
  [id: string]: User;
}

export interface RandomState {
  getUser: (id: string) => User;
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

  function getUser(id: string) {
    return users[id];
  }

  return {
    getUser,
    addUser,
    removeUser,
    findFriend,
  };
}

export default state();
