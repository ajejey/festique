// app/lib/auth.js
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const token = cookies().get('auth-token')
  
  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = verify(token.value, process.env.JWT_SECRET)
    return decoded
  } catch {
    redirect('/login')
  }
}

export async function requireRole(allowedRoles) {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    redirect('/')
  }
  
  return user
}

export async function getUser() {
  const token = cookies().get('auth-token')
  
  if (!token) {
    return null
  }

  try {
    return verify(token.value, process.env.JWT_SECRET)
  } catch {
    return null
  }
}