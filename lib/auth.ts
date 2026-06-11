import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

// User type for the in-memory store
type DemoUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "ADMIN" | "USER";
  image: string | null;
};

// In-memory demo users (replace with Prisma when DB is connected)
const DEMO_USERS: DemoUser[] = [
  {
    id: "1",
    email: "admin@jobnest.com",
    name: "Admin User",
    password: "$2a$10$xJ8Kq5Kp5bZ5Z5Z5Z5Z5ZeZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5", // will be set on register
    role: "ADMIN",
    image: null,
  },
];

// Simple in-memory user store for demo (no DB required)
const users: DemoUser[] = [...DEMO_USERS];

export function getUsers() {
  return users;
}

export function addUser(user: DemoUser) {
  users.push(user);
}

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email) || null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = findUserByEmail(email);
        if (!user) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role as string;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.role = token.role as string;
        u.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
