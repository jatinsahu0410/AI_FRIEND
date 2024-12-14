import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // Extract 'Authorization' header
    const authorizationHeader = req.headers.get('Authorization');
    if (!authorizationHeader) {
        return NextResponse.json({ error: 'Authorization header missing' }, { status: 400 });
    }

    // Assuming the Authorization header contains the userId as Bearer token or just userId
    const userId = authorizationHeader.split(' ')[1]; // This is assuming the token is in the format 'Bearer userId'
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 });
    }

    try {
        // Query Prisma for the user
        const user = await client.user.findUnique({
            where: {
                clerkid: userId,
            },
            include: {
                profile: true,
                bots: {
                    include:{
                        avatars: true,
                        personality: true,
                    }
                }, // Include associated bots in the response
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error in get user: ", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
