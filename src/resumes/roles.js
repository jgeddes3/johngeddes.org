// Maps a ?role= value on the Recruiters page to a track key. Links sent to
// recruiters before the rebuild used web, manager, executive and av.
import { TRACKS, LEGACY_ROLES } from './data.js';

const KEYS = new Set(TRACKS.map((t) => t.key));

export function resolveRole(param) {
  if (param && KEYS.has(param)) return param;
  if (param && LEGACY_ROLES[param]) return LEGACY_ROLES[param];
  return 'main';
}
