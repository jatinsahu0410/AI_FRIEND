import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: {
        chatId?: string; // Optional since chatId might not exist
    };
}

export const POST = async (_: Request, context: Params) => {
    try {
        // Extract `params` dynamically
        const { params } = context;

        if (!params?.chatId) {
            return NextResponse.json(
                { message: "Bad Request", status: 404 },
                { status: 404 }
            );
        }

        const botDetails = await client.chatBot.findUnique({
            where: {
                id: params.chatId,
            },
            include: {
                personality: true,
                avatars: true,
                messages: true,
            },
        });

        if (!botDetails) {
            return NextResponse.json(
                { message: "Bot details not found", status: 400 },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { botDetails, message: "Details fetch successful", status: 200 },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in getting bot details:", error);
        return NextResponse.json(
            { message: "Internal Server Error", status: 500 },
            { status: 500 }
        );
    }
};
