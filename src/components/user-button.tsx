import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import { ModeToggle } from "./mode-toggle"
import { redirect } from "next/navigation"
import { LogoutDropdown } from "./logout-button"
export default async function UserButton() {
    const supabase = await createClient()

     const { data, error } = await supabase.auth.getUser()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={data.user?.user_metadata.avatar_url} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{data.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center justify-between">
                 Theme
                 <ModeToggle />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <LogoutDropdown />
            </DropdownMenuContent>
        </DropdownMenu>
        
    )
}