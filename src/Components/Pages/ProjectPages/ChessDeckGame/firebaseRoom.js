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

// Firebase strips null values from objects, which destroys the board array
// (empty squares are null). Serialize as JSON string to preserve nulls.
function encode(state) {
  return JSON.stringify(state);
}

function decode(raw) {
  if (typeof raw === 'string') return JSON.parse(raw);
  return raw;
}

/**
 * Create a room as the host. Returns { roomId, cleanup }.
 * Calls onOpponentJoin(sendState, onReceiveState) when the opponent connects.
 * Calls onOpponentLeave() when the opponent disconnects.
 */
export function createRoom(onOpponentJoin, onOpponentLeave, onError = () => {}) {
  const roomId = generateRoomId();
  const roomRef = ref(db, `rooms/${roomId}`);
  const hostRef = ref(db, `rooms/${roomId}/host`);
  const guestRef = ref(db, `rooms/${roomId}/guest`);
  const stateRef = ref(db, `rooms/${roomId}/gameState`);

  // Mark host as present; remove room on disconnect. The write is caught —
  // unreachable, ad-blocked or rules-denied Firebase used to fail silently and
  // leave the host waiting on a room that was never created.
  set(hostRef, true).catch(onError);
  onDisconnect(roomRef).remove();

  // The guest key is absent until someone joins, so a null reading only means
  // "gone" once we have actually seen them arrive.
  let guestHasJoined = false;

  const unsubGuest = onValue(
    guestRef,
    (snapshot) => {
      const val = snapshot.val();
      if (val === true) {
        guestHasJoined = true;
        const sendState = (state) => {
          set(stateRef, encode(state));
        };
        const onReceive = (callback) => {
          onValue(stateRef, (snap) => {
            const raw = snap.val();
            if (raw) callback(decode(raw));
          });
        };
        onOpponentJoin(sendState, onReceive);
      } else if (guestHasJoined) {
        // false (clean exit) and null (key removed) both mean they left.
        onOpponentLeave();
      }
    },
    onError
  );

  const cleanup = () => {
    unsubGuest();
    remove(roomRef);
  };

  return { roomId, cleanup };
}

/**
 * Join an existing room as the guest. Returns a Promise.
 * Resolves with { sendState, onReceiveState, listenForHostLeave, cleanup }.
 * Rejects if room doesn't exist or host has left.
 */
export async function joinRoom(roomId) {
  const hostRef = ref(db, `rooms/${roomId}/host`);
  const guestRef = ref(db, `rooms/${roomId}/guest`);
  const stateRef = ref(db, `rooms/${roomId}/gameState`);
  const roomRef = ref(db, `rooms/${roomId}`);

  // Check if room exists
  const hostSnap = await get(hostRef);
  if (!hostSnap.exists() || hostSnap.val() !== true) {
    throw new Error('Room not found — the host may have left');
  }

  // Mark guest as present; mark as gone on disconnect
  await set(guestRef, true);
  onDisconnect(guestRef).set(false);

  const sendState = (state) => {
    set(stateRef, encode(state));
  };

  const onReceive = (callback) => {
    onValue(stateRef, (snap) => {
      const val = snap.val();
      if (val) callback(decode(val));
    });
  };

  const listenForHostLeave = (onLeave, onError = () => {}) => {
    onValue(
      hostRef,
      (snap) => {
        if (!snap.exists()) {
          onLeave();
        }
      },
      onError
    );
  };

  // Only mark ourselves absent. This used to also remove the whole room, which
  // deleted the host's presence key along with it — so the host's listener read
  // null instead of false and never learned the guest had gone. The room is the
  // host's to tear down, and onDisconnect covers a host that crashes.
  const cleanup = () => {
    set(guestRef, false).catch(() => {});
  };

  return { sendState, onReceiveState: onReceive, listenForHostLeave, cleanup };
}
