import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { UserRole } from '@/types'

const ROLE_HOME: Record<UserRole, string> = {
  student: '/student/dashboard',
  parent: '/parent/dashboard',
  teacher: '/teacher/dashboard',
  admin: '/admin/dashboard',
}

const PROTECTED_PREFIXES: Record<UserRole, string> = {
  student: '/student',
  parent: '/parent',
  teacher: '/teacher',
  admin: '/admin',
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Redirect unauthenticated users ke login
  const isProtected = Object.values(PROTECTED_PREFIXES).some((prefix) =>
    pathname.startsWith(prefix)
  )

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control
  if (user && isProtected) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role as UserRole | undefined

    if (role) {
      const allowedPrefix = PROTECTED_PREFIXES[role]
      if (!pathname.startsWith(allowedPrefix)) {
        // Redirect ke dashboard yang sesuai role
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = ROLE_HOME[role]
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // Redirect authenticated users dari /login ke dashboard sesuai role
  if (user && pathname === '/login') {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role as UserRole | undefined
    if (role) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = ROLE_HOME[role]
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

