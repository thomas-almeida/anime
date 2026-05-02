'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <>
            <nav className="flex justify-between items-center p-2 px-10 mb-10 border-b border-slate-400/10 shadow">
                <Link href={"/"}>
                    <h1 className="font-bold font-mono tracking-tighter text-xl">SilkRoad</h1>
                </Link>
                <div className="flex justify-between items-center px-4 w-130 rounded-full border border-neutral-700/40 shadow">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className="outline-none w-full py-2 font-semibold placeholder:font-medium"
                        placeholder="Pesquisar"
                    />
                </div>
            </nav>
        </>
    )
}