/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setUserData } from '@/store/userSlice';

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const [hovered, setHovered] = useState('');
    const dispatch = useDispatch();
    const [curruser, setCurruser] = useState<any>(); // Use 'any' or define the type for 'curruser'

    const handleHover = (page: string) => setHovered(page);
    const handleLeave = () => setHovered('');

    useEffect(() => {
        if (isSignedIn && user) {
            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/get-user`, {
                        headers: {
                            'Authorization': `Bearer ${user.id}`
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to fetch User');
                    }
                    const data = await res.json();
                    console.log("The curr user: ", data);
                    setCurruser(data);
                    // console.log(data)
                    dispatch(setUserData(data));
                } catch (error) {
                    console.log("fetch: ", error);
                }
            };
            fetchUser();
        }
    }, [isSignedIn, user, dispatch]);
    if(curruser !== undefined){
        console.log("The current user : ", curruser);
        // console.log("First : ", curruser);
    }
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-transparent text-white shadow-md shadow-purple-400 z-50">
            <div className="container mx-auto flex items-center justify-between p-4">

                {/* Logo */}
                <div
                    className="text-2xl font-bold cursor-pointer text-orange-400 hover:text-orange-300 transition"
                    onClick={() => router.push('/')}
                >
                    AI_Friend
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => router.push(item.path)}
                            onMouseEnter={() => handleHover(item.name)}
                            onMouseLeave={handleLeave}
                            className={`relative py-2 px-4 text-lg font-semibold transition-colors duration-200 ${pathname === item.path
                                ? 'text-blue-500'
                                : hovered === item.name
                                    ? 'text-blue-400'
                                    : 'text-white'
                                }`}
                        >
                            {item.name}
                            {/* Bottom Border for Active Link */}
                            {pathname === item.path && (
                                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-400" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Login/Signup or Profile & Logout */}
                <div className="flex items-center space-x-4">
                    {isSignedIn && user && curruser !== undefined ? (
                        <>
                            <Link href="/dashboard">
                                <Image src={`${curruser?.profilePic !== null ? curruser?.profilePic : `https://api.dicebear.com/5.x/initials/svg?seed=${curruser.firstName}%20${curruser.lastName}`}`}
                                    alt={curruser?.lastName}
                                    className="w-11 h-11 rounded-full object-cover shadow-md "
                                    width={28}
                                    height={28}
                                />  
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="text-sm px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Login Button */}
                            <button
                                onClick={() => router.push('/auth/sign-in')}
                                className="text-sm px-5 py-2 font-semibold text-white border border-orange-400 rounded hover:bg-orange-400 transition"
                            >
                                Login
                            </button>

                            {/* Signup Button */}
                            <button
                                onClick={() => router.push('/auth/sign-up')}
                                className="text-sm px-5 py-2 font-semibold text-black bg-orange-400 rounded hover:bg-orange-300 transition"
                            >
                                Signup
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
