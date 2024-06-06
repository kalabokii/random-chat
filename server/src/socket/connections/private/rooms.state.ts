import privateState, { PrivateState } from "./private.state";

// TODO:
//  1. it will probably need a method that will delete the room if it is empty so we don't have memory leaks
function chatRoomState() {
  const rooms: { [id: string]: PrivateState } = {};

  function getRoom(id: string): PrivateState {
    if (!rooms[id]) {
      rooms[id] = privateState();
    }
    return rooms[id];
  }

  return {
    getRoom,
  };
}

export default chatRoomState();
