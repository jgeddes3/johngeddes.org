import Peer from 'peerjs';

const PEER_CONFIG = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  },
};

const CONNECT_TIMEOUT = 20000;
const MAX_RETRIES = 3;

function generatePeerId() {
  return 'cd-' + Math.random().toString(36).substring(2, 8);
}

/**
 * Try an async operation up to maxRetries times.
 */
function withRetry(fn, maxRetries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    function tryOnce() {
      attempt++;
      fn()
        .then(resolve)
        .catch((err) => {
          if (attempt < maxRetries) {
            const delay = 1000 * attempt;
            console.warn(`PeerJS attempt ${attempt} failed, retrying in ${delay}ms...`, err.message);
            setTimeout(tryOnce, delay);
          } else {
            reject(err);
          }
        });
    }

    tryOnce();
  });
}

/**
 * Create a single peer and wait for it to register on the signaling server.
 */
function createPeer(peerId) {
  return new Promise((resolve, reject) => {
    const peer = new Peer(peerId, PEER_CONFIG);

    const timeout = setTimeout(() => {
      peer.destroy();
      reject(new Error('Timed out connecting to signaling server'));
    }, CONNECT_TIMEOUT);

    peer.on('open', () => {
      clearTimeout(timeout);
      resolve(peer);
    });

    peer.on('error', (err) => {
      clearTimeout(timeout);
      peer.destroy();
      reject(err);
    });
  });
}

/**
 * Create a host peer and wait for an incoming connection.
 * Retries up to MAX_RETRIES times if the signaling server is flaky.
 * Returns a Promise that resolves with { peer, peerId }.
 */
export function createHost(onConnection, onError) {
  const peerId = generatePeerId();

  return withRetry(() => createPeer(peerId)).then((peer) => {
    peer.on('connection', (conn) => {
      conn.on('open', () => {
        onConnection(conn);
      });
    });

    peer.on('error', (err) => {
      if (onError) onError(err);
    });

    return { peer, peerId };
  });
}

/**
 * Join an existing game by connecting to the host's peer ID.
 * Retries up to MAX_RETRIES times.
 * Returns a Promise that resolves with { peer, conn }.
 */
export function joinGame(hostPeerId) {
  return withRetry(() => {
    return new Promise((resolve, reject) => {
      const myId = generatePeerId();
      const peer = new Peer(myId, PEER_CONFIG);

      const timeout = setTimeout(() => {
        peer.destroy();
        reject(new Error('Connection timed out — the host may no longer be available'));
      }, CONNECT_TIMEOUT);

      peer.on('open', () => {
        const conn = peer.connect(hostPeerId, { reliable: true });

        conn.on('open', () => {
          clearTimeout(timeout);
          resolve({ peer, conn });
        });

        conn.on('error', (err) => {
          clearTimeout(timeout);
          peer.destroy();
          reject(err);
        });
      });

      peer.on('error', (err) => {
        clearTimeout(timeout);
        peer.destroy();
        reject(err);
      });
    });
  });
}

/**
 * Send game state to the connected peer.
 */
export function sendState(conn, state) {
  if (conn && conn.open) {
    conn.send(JSON.stringify(state));
  }
}

/**
 * Listen for state updates from the connected peer.
 */
export function onReceiveState(conn, callback) {
  conn.on('data', (data) => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed.board) {
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const piece = parsed.board[r][c];
            if (piece && !piece.modifiers) {
              piece.modifiers = [];
            }
          }
        }
      }
      callback(parsed);
    } catch (err) {
      console.error('Failed to parse received state:', err);
    }
  });
}
