import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader) {
            return NextResponse.json({ error: 'Authorization header missing' }, { status: 400 });
        }

        // Assuming the Authorization header contains the userId as Bearer token or just userId
        const chatBotId = authorizationHeader.split(' ')[1]; // This is assuming the token is in the format 'Bearer userId'
        if (!chatBotId) {
            return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 });
        }
        const data = await req.json();

        // now add create new message 
        const res = await client.message.create({
            data:{
                text: data,
                isUserInput: false,
                chatBotId: chatBotId
            }
        });
        return NextResponse.json({res, message: "message added successfull", status: 200}, {status: 200});
    } catch (error) {
        console.log("The create message error : ", error);
        return NextResponse.json({error, message:"Internal Server Error", status: 500}, {status: 500});
    }
}