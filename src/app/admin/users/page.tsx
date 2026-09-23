import React from 'react'
import { getCachedAdminUsersData } from '@/lib/cache/admin-cache'
import { UsersListTable } from './UsersListTable'

export default async function AdminUsersPage() {
  const { users, links } = await getCachedAdminUsersData()

  return (
    <div className="space-y-6">
      <UsersListTable users={users as any} links={links} />
    </div>
  )
}
