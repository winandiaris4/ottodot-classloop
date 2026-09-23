import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'
import type { UserRole } from '@/types'
import { getFastUserFromRequest } from '@/lib/auth/fast-auth'

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

  // 1. Fast path: Verify JWT locally (0.5ms, zero network hops)
  let user: any = await getFastUserFromRequest(request)
  let supabase: any = null

  // 2. Slow path fallback: Only if local verification fails or no token
  if (!user) {
    supabase = createServerClient<Database>(
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

    const { data } = await supabase.auth.getUser()
    user = data.user
  }

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

  // Role-based access control & Header forwarding
  let role: UserRole | undefined = user?.user_metadata?.role as UserRole | undefined
  if (user && isProtected) {
    if (!role && supabase) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      role = profile?.role as UserRole | undefined
    }

    if (role) {
      const allowedPrefix = PROTECTED_PREFIXES[role]
      if (!pathname.startsWith(allowedPrefix)) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = ROLE_HOME[role]
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // Pass authenticated user context via request headers to avoid duplicate auth calls in layouts
  const requestHeaders = new Headers(request.headers)
  if (user) {
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-role', role || 'student')
    requestHeaders.set('x-user-name', encodeURIComponent(user.user_metadata?.full_name || ''))
    requestHeaders.set('x-user-email', user.email || '')
  }

  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Copy cookies if supabaseResponse was modified
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, cookie)
  })

  return finalResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
