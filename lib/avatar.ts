//lib/avatar.ts
export function getRandomAvatar() {
  const n = Math.floor(Math.random() * 5) + 1;
  return `/clients/avatar${n}.jpg`;
}
