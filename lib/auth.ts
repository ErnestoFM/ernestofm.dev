import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email !== process.env.ADMIN_EMAIL) return null;

        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!passwordHash) return null;

        const isValid = await compare(credentials.password, passwordHash);
        if (!isValid) return null;

        return { id: '1', email: credentials.email, name: 'Admin' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
