import Peer from 'peerjs';

// Generate a short random ID for peer connections
function generatePeerId() {
  return 'cd-' + Math.random().toString(36).substring(2, 8);
}

/**
 * Create a host peer and wait for an incoming connection.
 * Returns a Promise that resolves with { peer, peerId } once the peer is
 * registered on the signaling server and ready to accept connections.
 */
export function createHost(onConnection, onError) {
  const peerId = generatePeerId();
  const peer = new Peer(peerId);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      peer.destroy();
      reject(new Error('Timed out connecting to signaling server'));
    }, 15000);

    peer.on('open', () => {
      clearTimeout(timeout);
      resolve({ peer, peerId });
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        onConnection(conn);
      });
    });

    peer.on('error', (err) => {
      clearTimeout(timeout);
      if (onError) onError(err);
      reject(err);
    });
  });
}

/**
 * Join an existing game by connecting to the host's peer ID.
 * Returns a Promise that resolves with { peer, conn } or rejects on
 * timeout / error.
 */
export function joinGame(hostPeerId) {
  return new Promise((resolve, reject) => {
    const peer = new Peer(generatePeerId());

    const timeout = setTimeout(() => {
      peer.destroy();
      reject(new Error('Connection timed out — the host may no longer be available'));
    }, 15000);

    peer.on('open', () => {
      const conn = peer.connect(hostPeerId, { reliable: true });
      conn.on('open', () => {
        clearTimeout(timeout);
        resolve({ peer, conn });
      });
      conn.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    peer.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
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
      // Restore any missing modifiers arrays on board pieces
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
