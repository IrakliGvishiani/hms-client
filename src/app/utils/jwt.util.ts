const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  const payload = decodeToken(token);
  if (!payload) return null;

  const role = payload[ROLE_CLAIM] ?? payload['role'];
  // roles შეიძლება იყოს ერთი string ან string[] (თუ მომავალში მრავალ როლს დაამატებთ)
  return Array.isArray(role) ? role[0] : role;
}