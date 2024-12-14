// app/api/authenticate/route.ts
import { NextResponse } from 'next/server'
import { onAuthenticateUser } from '@/app/actions/user'

export async function POST() {
    const authResponse = await onAuthenticateUser()

    if (authResponse.status === 200) {
        return NextResponse.json(authResponse.user, { status: 200 })
    }

    return NextResponse.json({ message: "Authentication failed" }, { status: authResponse.status })
}
