// lib/auth.ts
import type { NextApiRequest, NextApiResponse, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { verifyToken } from "./jwt";
import { AuthUser } from "./types/auth";
import cookie from "cookie";

// --------------------
// API Route Auth
// --------------------
export function requireAuth(
  handler: (req: NextApiRequest & { user: AuthUser }, res: NextApiResponse) => any
) {
  return async (req: NextApiRequest & { user?: AuthUser }, res: NextApiResponse) => {
    try {
      // Parse cookies manually
      const cookies = cookie.parse(req.headers.cookie || "");
      const token = cookies.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = verifyToken(token) as {
        userId: string;
        orgId: string;
        role: string;
        permissions?: {
          canEditVendor: boolean;
        };
      };

      if (decoded.role !== "admin" && decoded.role !== "team") {
  return res.status(403).json({ message: "Forbidden" });
}


      req.user = {
        id: decoded.userId,
        organization: decoded.orgId,
        role: decoded.role,
        permissions: decoded.permissions,
      };

      return handler(req as NextApiRequest & { user: AuthUser }, res);
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

// --------------------
// Server-side Auth for getServerSideProps
// --------------------
type GSSP<P> = (context: GetServerSidePropsContext & { user?: any }) => Promise<GetServerSidePropsResult<P>>;

export function requireAuthServerSide<P>(handler: GSSP<P>) {
  return async (context: GetServerSidePropsContext & { user?: any }) => {
    try {
      // const rawCookies = context.req.headers.cookie || "";
      // parse manually without cookie package
      // const token = rawCookies
      //   .split(";")
      //   .map(c => c.trim())
      //   .find(c => c.startsWith("token="))
      //   ?.split("=")[1];

       const cookies = cookie.parse(context.req.headers.cookie || "");
      const token = cookies.token;

      if (!token) throw new Error("No token");

      const decoded = verifyToken(token) as any;

      context.user = {
        id: decoded.userId,
        organization: decoded.orgId,
        role: decoded.role,
        permissions: decoded.permissions,
      };

      return await handler(context);
    }catch (err) {
  console.error("SSR AUTH ERROR:", err);

  return {
    redirect: {
      destination: "/auth/signin",
      permanent: false,
    },
  };
}

  };
}
