import Peer from 'peerjs';

// ICE servers including TURN relays for cross-network connectivity
const ICE_SERVERS = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:global.stun.twilio.com:3478' },
      // PeerJS default TURN
      { urls: 'turn:0.peerjs.com:3478', username: 'peerjs', credential: 'peerjsp' },
      // Open Relay TURN servers (free, multiple ports for firewall traversal)
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
    ],
  },
};

// Generate a short random ID for peer connections
function generatePeerId() {
  return 'cd-' + Math.random().toString(36).substring(2, 8);
}

/**
 * Create a host peer and wait for an incoming connection.
 * Returns { peer, peerId }
 */
export function createHost(onConnection, onError) {
  const peerId = generatePeerId();
  const peer = new Peer(peerId, ICE_SERVERS);

  peer.on('open', () => {
    // Peer server connection established
  });

  peer.on('connection', (conn) => {
    conn.on('open', () => {
      onConnection(conn);
    });
  });

  peer.on('error', (err) => {
    if (onError) onError(err);
  });

  return { peer, peerId };
}

/**
 * Join an existing game by connecting to the host's peer ID.
 * Returns a Promise that resolves with { peer, conn }.
 * Rejects after 20 seconds if connection can't be established.
 */
export function joinGame(hostPeerId) {
  return new Promise((resolve, reject) => {
    const peer = new Peer(generatePeerId(), ICE_SERVERS);

    const timeout = setTimeout(() => {
      peer.destroy();
      reject(new Error('Connection timed out — the host may no longer be available'));
    }, 20000);

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
