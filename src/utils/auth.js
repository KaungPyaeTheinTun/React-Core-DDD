function jwtDecode(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserRoles() {
  try {
    const raw = localStorage.getItem("roles");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hasRole(role) {
  return getUserRoles().some((r) => r.toLowerCase() === role.toLowerCase());
}

export function isAdmin() {
  return hasRole("admin");
}

export function extractRolesFromToken(token) {
  const decoded = jwtDecode(token);
  if (!decoded) {
    return [];
  }

  const possibleKeys = [
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    "role",
    "roles",
    "Role",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  ];

  for (const key of possibleKeys) {
    const raw = decoded[key];
    if (Array.isArray(raw)) {
      return raw;
    }
    if (typeof raw === "string") {
      return [raw];
    }
  }

  return [];
}
