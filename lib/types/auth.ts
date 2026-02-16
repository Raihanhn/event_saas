//lib/types/auth.ts
export interface AuthUser {
  id: string;
  organization: string;
   role: "admin" | "team";
  permissions?: {
    canEditVendor: boolean;
  };
}
