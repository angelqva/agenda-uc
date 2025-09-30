import { ServiceAuth } from "@/services/auth";
import NextAuth from "next-auth";

const handler = NextAuth(ServiceAuth.authOptions);

export { handler as GET, handler as POST };
