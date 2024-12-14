import { client } from "@/lib/prisma"
import { NextResponse } from "next/server";

export const GET = async() => {
    try {
        // all the avatars 
        const allAvatars = await client.avatars.findMany();
        return NextResponse.json({data: allAvatars, message:"get avatars successfull"}, {status: 200});
    } catch (error) {
        console.log("Error in get avatars: ", error);
        return NextResponse.json({error: "Internal Server Error", status: 500});
    }
}