import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';
import bcrypt from 'bcrypt';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const post: APIRoute = async (context) => {
  const form = await context.request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return new Response('Email and password are required', { status: 400 });
  }

  if (!emailRegex.test(email)) {
    return new Response('Invalid email format', { status: 400 });
  }

  if (password.length < 6) {
    return new Response('Password must be at least 6 characters long', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.users.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return new Response('User already exists', { status: 409 });
  }

  return context.redirect('/auth/login');
};