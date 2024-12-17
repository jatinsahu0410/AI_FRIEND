'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { onAuthenticateUser } from '@/app/actions/user'
import AuthLoading from './loading'

const AuthCallBackPage = () => {
    const router = useRouter()  
    const { user } = useClerk()
    const [isLoading, setIsLoading] = useState(true)  // State for loading

    useEffect(() => {
        const authenticateUser = async () => {
            if (user) {
                const auth = await onAuthenticateUser();
                if (auth.status === 200) {
                    router.push(auth.user?.onboarding ? '/dashboard/chatbots' : '/onboarding');
                } else {
                    router.push('/auth/sign-in');
                }
            } else {
                router.push('/auth/sign-in');
            }
            setIsLoading(false);
        };

        authenticateUser();
    }, [user, router]);


    // Display Loader component while loading
    if (isLoading) return <AuthLoading />

    return null
}

export default AuthCallBackPage
