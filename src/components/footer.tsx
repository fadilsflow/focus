import Link from "next/link";

export default function Footer() {
    return (
        <footer className="max-w-4xl mx-auto border-t text-center items-center py-10 px-5">
            <p>&copy; Focus 2025. All Rights Reserved.</p>
            <p>Powered by <Link href="https://www.qodrat.dev" className="underline">Qodrat</Link></p>
        </footer>
    )
}