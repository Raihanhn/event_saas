// lib/avatarFromId.ts
export function getAvatarFromId(id: string) {
  const num = parseInt(id.slice(-2), 16) % 5 + 1;
  return `/clients/avatar${num}.jpg`;
}
