'use server';

import { signIn, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function authenticate(email: string, password: string) {
  try {
    const r = await signIn('credentials', {
      username: email,
      password: password,
      callbackUrl: '/',
      redirect: false
    });
    return {
      res: r,
      error: false
    };
  } catch (error) {
    return {
      error: true
    };
  }
}

export async function signout() {
  await signOut({
    redirect: false
  });

  return redirect('/login');
}
