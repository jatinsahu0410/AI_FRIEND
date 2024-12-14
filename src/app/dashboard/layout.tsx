'use client'
import Link from 'next/link'
import { Person, Chat, Logout, Settings } from '@mui/icons-material'
import React, { useEffect } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/store/userSlice'

type Props = {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
    const { signOut } = useClerk();
    const { user } = useUser();
    const dispatch = useDispatch();

    const menuItems = [
        { label: 'My Profile', href: '/dashboard/profile', icon: <Person /> },
        { label: 'Chatbots', href: '/dashboard/chatbots', icon: <Chat /> },
        { label: 'Settings', href: '/dashboard/settings', icon: <Settings /> },
    ]

    // get the user details 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/get-user', {
                    method: 'GET',
                    headers: {
                        'content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.id}`
                    },
                });
                const data = await res.json();
                dispatch(setUserData(data));
                console.log("The data is : ", data);
            } catch (error) {
                console.log("dashboard fetch user : ", error);
            }
        };
        fetchUser();
    }, [user?.id])
    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1e2f] p-6 flex flex-col justify-between h-[calc(100vh-6rem)]">
                <div>
                    <h2 className="text-purple-400 text-2xl font-bold mb-6">Dashboard</h2>
                    <nav className="space-y-4">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition"
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white transition"
                >
                    <Logout className="text-lg" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#292942] p-6 overflow-y-auto h-[calc(100vh-6rem)]">
                {children}
            </main>
        </div>
    )
}
