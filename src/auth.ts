export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  phone: string;
};

export function readStoredAuthUser(): AuthUser | null {
  const storedUser = localStorage.getItem("authUser");
  if (!storedUser) {
    return null;
  }

  try {
    const user: unknown = JSON.parse(storedUser);
    if (
      typeof user === "object" &&
      user !== null &&
      "id" in user &&
      typeof user.id === "string" &&
      "name" in user &&
      typeof user.name === "string" &&
      "email" in user &&
      typeof user.email === "string" &&
      "roles" in user &&
      Array.isArray(user.roles) &&
      user.roles.every((role: unknown) => typeof role === "string")) {
      const phone =
        "phone" in user && typeof user.phone === "string"
          ? user.phone
          : "";
  
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        phone,
      };
    }
  } catch {
    localStorage.removeItem("authUser");
  }

  return null;
}
