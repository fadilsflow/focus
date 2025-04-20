import Link from "next/link";
import { Button } from "./ui/button";
import UserButton from "./user-button";
import { createClient } from "@/lib/supabase/server";
import { SettingsDialog } from "./settings-dialog";

export default async function Navbar() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return (
        <nav className="flex items-center py-5 px-5 justify-between">
            <h1 className="text-2xl font-bold text-foreground">Focus</h1>
            <div className="flex items-center gap-2">
                <SettingsDialog />
                {session ? (
                    <UserButton />
                ) : (
                    <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}