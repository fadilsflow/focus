'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function LogoutDropdown() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <DropdownMenuItem 
      onClick={logout}
    >
      <span>Sign out</span>
    </DropdownMenuItem>
  )
}
export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }
  return (
    <Button variant="outline" onClick={logout}>
      <span>Sign out</span>
    </Button>
  )
}