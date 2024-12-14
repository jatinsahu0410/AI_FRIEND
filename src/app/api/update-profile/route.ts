import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        //get the user authorisation 
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader) {
            return NextResponse.json({ error: "Unauthorized User" }, { status: 400 });
        }

        // fetch the clerk user id to fetch
        const clerkUserId = authorizationHeader.split(' ')[1];
        console.log("The clerk uer id : ", clerkUserId);
        console.log("The data update profile: ", data);
        if (!clerkUserId) {
            return NextResponse.json({ error: "Usnauthorised User" }, { status: 400 });
        }

        // now find the user and 
        const userDetail = await client.user.findUnique({
            where: {
                clerkid: clerkUserId,
            },
            include: {
                profile: true,
            }
        });

        await client.profile.update({
            where: {
                id: userDetail?.profile?.id,
            },
            data: {
                gender: data.gender,
                emotions: data.emotionalConnect,
                interest: data.selectedInterests
            }
        });

        // now also update the user if any changes 
        const photo : string = data.profilePicUrl.split('//')[1];
        const secure_url = photo.includes("dicebar") === true ? null : data.profilePicUrl;
        // now update the user 
        const updatedUser = await client.user.update({
            where: {
                id: userDetail?.id,
            },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                profilePic: secure_url
            },
            include: {
                profile: true,
                bots: true,
            }
        });
        return NextResponse.json({data: updatedUser , message: "update user is successfull", status: 200 }, { status: 200 });
    } catch (error) {
        console.log("Error in update profile : ", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, { status: 500 });
    }
}