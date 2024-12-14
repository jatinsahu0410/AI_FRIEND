import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const authorizationHeader = req.headers.get('Authorization');
        if (!authorizationHeader) {
            return NextResponse.json({ message: "Unauthorized User", status: 400 }, { status: 400 });
        }

        // get the data for the creation of the bot 
        const data = await req.json();
        console.log("create bot data : ", data);
        if (data.avatar === ' ') {
            return NextResponse.json({ Message: "Avatar is Required", status: 400 }, { status: 400 });
        }
        const clerkUserId = authorizationHeader.split(' ')[1];
        const userDetail = await client.user.findUnique({
            where: {
                clerkid: clerkUserId
            },
            include: {
                bots: true,
            }
        });

        if (!userDetail) {
            return NextResponse.json({ message: "Unauthorized Access Deined", status: 404 }, { status: 404 });
        }
        // find the avatr 
        const botAvatar = await client.avatars.findUnique({
            where: {
                id: data.avatar,
            }
        });

        // create the bot first 
        const bot = await client.chatBot.create({
            data: {
                name: data.name,
                avatarsId: botAvatar?.id,
                userId: userDetail?.id
            }
        })
        // create the bot personality  
        await client.personality.create({
            data: {
                tone: data.tone,
                communicationStyle: data.communicationStyle,
                intelligenceLevel: data.intelligenceLevel,
                politenessLevel: data.politenessLevel,
                chatBotId: bot.id,
            },
        });

        // fetch the new user 
        const updatedUser = await client.user.findUnique({
            where: {
                id: userDetail.id,
            },
            include: {
                profile: true,
                bots: {
                    include: {
                        personality: true,
                        messages: true,
                    }
                }
            }
        });

        return NextResponse.json({ user: updatedUser, message: "bot creation is successfull", status: 200 }, { status: 200 });
    } catch (error) {
        console.log("Error in bot creation : ", error);
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500,
        }, { status: 500 });
    }
}