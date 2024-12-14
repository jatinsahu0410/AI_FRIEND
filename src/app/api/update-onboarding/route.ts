import {client} from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Parse incoming request data
        const data = await req.json();

        // Extract and validate the Authorization header
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader) {
            return NextResponse.json({ error: 'Authorization header missing' }, { status: 400 });
        }

        // Extract userId from the Authorization header
        const userId = authorizationHeader.split(' ')[1];
        if (!userId) {
            return NextResponse.json(
                { error: 'User ID not found in Authorization header' },
                { status: 400 }
            );
        }

        console.log('The received data:', data);
        console.log('The extracted userId:', userId);

        // Check if a user and profile already exist
        const profileExist = await client.user.findUnique({
            where: {
                clerkid: userId,
            },
            include: {
                profile: true,
            },
        });

        // If profile already exists, return conflict response
        if (profileExist?.profile !== null) {
            return NextResponse.json(
                { message: 'Profile already exists', status: 409 },
                { status: 409 }
            );
        }
        console.log("The actual user id : ", profileExist.id);
        // Create a new profile
        const newProfile = await client.profile.create({
            data: {
                gender: data.gender,
                interest: Array.isArray(data.selectedInterests) ? data.selectedInterests : [],
                emotions: data.emotionalConnect,
                userId: profileExist.id,
            },
        });

        // Link the new profile to the user
        const updatedUser = await client.user.update({
            where: {
                id: profileExist.id,
            },
            data: {
                profile: { connect: { id: newProfile.id } },
                profilePic: data.profilePicUrl,
                onboarding: true,
            },
            include: {
                profile: {
                    where:{
                        userId: profileExist.id,
                    }
                },
                bots: {
                    where: {
                        userId: profileExist.id,
                    }
                }
            }
        });

        // Success response
        return NextResponse.json({ message: 'onboarding complete', data: updatedUser, status: 200 }, { status: 200 });
    } catch (e) {
        // Internal Server Error response
        return NextResponse.json(
            { message: 'Internal Server Error', e },
            { status: 500 }
        );
    }
}
