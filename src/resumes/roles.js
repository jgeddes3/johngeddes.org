// Maps a ?role= value on the Recruiters page to a track key. Links sent to
// recruiters before the rebuild can carry the legacy values web, dev,
// manager, mgmt, executive and exec, which LEGACY_ROLES maps to a current
// track. av is a current key and passes through unchanged.
import { TRACKS, LEGACY_ROLES } from './data.js';

const KEYS = new Set(TRACKS.map((t) => t.key));

export function resolveRole(param) {
  if (param && KEYS.has(param)) return param;
  // Own keys only, so ?role=toString or ?role=__proto__ does not resolve to
  // something inherited from Object.prototype.
  if (param && Object.prototype.hasOwnProperty.call(LEGACY_ROLES, param)) return LEGACY_ROLES[param];
  return 'main';
}
