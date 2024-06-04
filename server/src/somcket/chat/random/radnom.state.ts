import { User } from "../types/user.model";

interface UserCollection {
  [id: string]: User;
}

function state() {
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
    users,
    addUser,
    removeUser,
    findFriend,
  };
}

export default state();
