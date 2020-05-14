export function parseSeconds(secs) {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  return { hours, minutes };
};
