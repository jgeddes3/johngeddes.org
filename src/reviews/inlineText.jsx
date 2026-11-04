import React from 'react';
import { Link } from 'react-router-dom';

/* Block text supports exactly one inline form: [label](target).
   Targets: "#anchor" stays on the page, "/path" is a client route,
   anything else opens externally. Shared by reviews and philosophy essays. */
export const renderText = (text) => {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, target] = m;
    if (target.startsWith('/')) {
      out.push(<Link key={m.index} to={target}>{label}</Link>);
    } else if (target.startsWith('#')) {
      out.push(<a key={m.index} href={target}>{label}</a>);
    } else {
      out.push(<a key={m.index} href={target} target="_blank" rel="noopener noreferrer">{label}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};
