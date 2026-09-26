export function toSRT(lines) {
  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
  };
  return lines.map((l, i) =>
    `${i + 1}\n${fmt(l.start)} --> ${fmt(l.end)}\n${l.text}\n`
  ).join('\n');
}