import runChat, { MessageObject, RunChatParams } from "@/lib/gemini";
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
            return NextResponse.json({ error: 'Bot not Found' }, { status: 401 });
        }

        const { messages } = await req.json();
        // console.log("The data is :", messages);
        const lastMessage = messages.pop();
        // console.log("the data now : ", messages);
        const textData = lastMessage.parts[0].text
        // console.log("Th last message :", textData);

        // add the latest message from the user to the db 
        await client.message.create({
            data: {
                text: textData,
                isUserInput: true,
                chatBotId: chatBotId
            }
        });

        // const history: MessageObject[] = [
        //     {
        //         role: "user",
        //         parts: [{ text: "Hi" }]
        //     },
        //     ...messages.map((message: MessageObject) => ({
        //         role: message.role,
        //         parts: message.parts,
        //     })),
        // ];
        // the response part 
        const payload: RunChatParams = {
            chatHistory: [
                {
                    role: "user",
                    parts: [{ text: "Hi" }],
                },
                ...messages.map((message: MessageObject) => ({
                    role: message.role,
                    parts: message.parts,
                })),
            ],
            message: lastMessage.parts[0].text,
            systemPrompt: "You are the user's girl friend. U have to react live a actual real human person not like a bot, u can't say the user that u are a ai bot. Ur task is act really like a real person and chat it that way. And one more thing that u have to answer the user in whichever language they talks to u.",
        };

        const result = await runChat(payload);
        const resFromGpt = result?.candidates ? result?.candidates[0].content.parts[0].text : " ";
        if (resFromGpt === " ") {
            return NextResponse.json({ message: "Unable to get response ", status: 400 }, { status: 400 });
        }

        // add the response to the db 
        await client.message.create({
            data: {
                text: resFromGpt,
                isUserInput: false,
                chatBotId: chatBotId
            }
        });
        return NextResponse.json({gptres: resFromGpt, message: " OK", status: 200 }, { status: 200 });
    } catch (error) {
        console.log("The error in message : ", error);
        return NextResponse.json({ error, message: "Internal Server Error", status: 500 }, { status: 500 });
    }
}