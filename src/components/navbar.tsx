import Link from "next/link";
import { Button } from "./ui/button";
import UserButton from "./user-button";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return (
        <nav className="max-w-4xl mx-auto flex border-b items-center py-3 px-5 justify-between">
           <h1 className="text-2xl font-bold text-foreground">Focus</h1>
           <div className="flex items-center gap-2">
            {user ? (
                <UserButton />
            ) : (
                <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
           </div>
        </nav>
    )
}