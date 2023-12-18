import { NextApiRequest } from 'next';
import {  Session } from 'next-auth';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export interface AuthResult {
  userEmail: string;
  session: Session | null | undefined;
}

export async function authenticateUser(req: NextApiRequest): Promise<AuthResult> {

  // obtaining current session
    const session = (await getServerSession(authOptions)) as Session & { user?: { email?: string } }

  if (!session) {
    return {
      userEmail: '',
      session: null,
    };
  }

  const userEmail = session.user?.email || '';

  return {
    userEmail,
    session,
  };
}
