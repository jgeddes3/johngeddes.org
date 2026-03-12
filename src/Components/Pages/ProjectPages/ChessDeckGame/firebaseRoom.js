import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, remove, onDisconnect, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://chessdeck-675e3-default-rtdb.firebaseio.com/',
};

const app = initializeApp(firebaseConfig, 'chessdeck');
const db = getDatabase(app);

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

/**
 * Create a room as the host. Returns { roomId, cleanup }.
 * Calls onOpponentJoin(sendState, onReceiveState) when the opponent connects.
 * Calls onOpponentLeave() when the opponent disconnects.
 */
export function createRoom(onOpponentJoin, onOpponentLeave) {
  const roomId = generateRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);
  const hostRef = ref(db, `rooms/${roomId}/host`);
  const guestRef = ref(db, `rooms/${roomId}/guest`);
  const stateRef = ref(db, `rooms/${roomId}/gameState`);

  // Mark host as present; remove room on disconnect
  set(hostRef, true);
  onDisconnect(roomRef).remove();

  // Listen for guest joining
  const unsubGuest = onValue(guestRef, (snapshot) => {
    if (snapshot.val() === true) {
      // Guest joined — provide send/receive functions
      const sendState = (state) => {
        set(stateRef, state);
      };
      const onReceive = (callback) => {
        onValue(stateRef, (snap) => {
          const val = snap.val();
          if (val) callback(val);
        });
      };
      onOpponentJoin(sendState, onReceive);
    } else if (snapshot.val() === false) {
      onOpponentLeave();
    }
  });

  const cleanup = () => {
    unsubGuest();
    remove(roomRef);
  };

  return { roomId, cleanup };
}

/**
 * Join an existing room as the guest. Returns a Promise.
 * Resolves with { sendState, onReceiveState, cleanup }.
 * Rejects if room doesn't exist or host has left.
 */
export async function joinRoom(roomId) {
  const roomRef = ref(db, `rooms/${roomId}`);
  const hostRef = ref(db, `rooms/${roomId}/host`);
  const guestRef = ref(db, `rooms/${roomId}/guest`);
  const stateRef = ref(db, `rooms/${roomId}/gameState`);

  // Check if room exists
  const hostSnap = await get(hostRef);
  if (!hostSnap.exists() || hostSnap.val() !== true) {
    throw new Error('Room not found — the host may have left');
  }

  // Mark guest as present; mark as gone on disconnect
  await set(guestRef, true);
  onDisconnect(guestRef).set(false);

  const sendState = (state) => {
    set(stateRef, state);
  };

  const onReceive = (callback) => {
    onValue(stateRef, (snap) => {
      const val = snap.val();
      if (val) callback(val);
    });
  };

  // Listen for host leaving
  const listenForHostLeave = (onLeave) => {
    onValue(hostRef, (snap) => {
      if (!snap.exists()) {
        onLeave();
      }
    });
  };

  const cleanup = () => {
    set(guestRef, false);
  };

  return { sendState, onReceiveState: onReceive, listenForHostLeave, cleanup };
}
