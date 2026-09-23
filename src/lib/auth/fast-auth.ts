import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'
import type { UserRole } from '@/types'

export interface FastAuthUser {
  id: string
  email?: string
  user_metadata: {
    role?: UserRole
    full_name?: string
    avatar_url?: string
    [key: string]: any
  }
}

const secretBytes = process.env.SUPABASE_JWT_SECRET
  ? new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET)
  : null

function decodeBase64URL(str: string): string {
  // Pad if necessary
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  if (typeof atob === 'function') {
    return atob(base64)
  }
  return Buffer.from(base64, 'base64').toString('utf8')
}

export async function getFastUserFromRequest(request: NextRequest): Promise<FastAuthUser | null> {
  if (!secretBytes) return null

  try {
    const cookies = request.cookies.getAll()
    const authCookies = cookies.filter((c) => c.name.includes('-auth-token'))

    if (authCookies.length === 0) return null

    let rawValue = ''

    // Check if chunked (.0, .1, etc.)
    const chunked = authCookies.filter((c) => /\.\d+$/.test(c.name))
    if (chunked.length > 0) {
      chunked.sort((a, b) => {
        const idxA = parseInt(a.name.split('.').pop() || '0', 10)
        const idxB = parseInt(b.name.split('.').pop() || '0', 10)
        return idxA - idxB
      })
      rawValue = chunked.map((c) => c.value).join('')
    } else {
      rawValue = authCookies[0].value
    }

    if (!rawValue) return null

    let jsonString = rawValue
    if (rawValue.startsWith('base64-')) {
      jsonString = decodeBase64URL(rawValue.slice(7))
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonString)
    } catch {
      return null
    }

    const accessToken = parsed.access_token || (Array.isArray(parsed) ? parsed[0] : null)
    if (!accessToken || typeof accessToken !== 'string') return null

    const { payload } = await jwtVerify(accessToken, secretBytes)

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    return {
      id: payload.sub as string,
      email: payload.email as string | undefined,
      user_metadata: (payload.user_metadata as any) || {},
    }
  } catch {
    // If local verification fails for any reason, return null to allow fallback to getUser()
    return null
  }
}

