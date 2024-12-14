'use server'
import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 404, user: null };
        }

        const userExist = await client.user.findUnique({
            where: { clerkid: user.id },
            include: {
                bots: {
                    where: { user: { clerkid: user.id } },
                },
            },
        });

        if (userExist) {
            return { status: 200, user: userExist };
        }

        const newUser = await client.user.create({
            data: {
                clerkid: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0].emailAddress,
            },
            include: {
                bots: {
                    where: { user: { clerkid: user.id } },
                },
            },
        });

        return { status: 200, user: newUser };
    } catch (e) {
        console.error("User creation error:", e);
        return { status: 500, user: null };
    }
};
