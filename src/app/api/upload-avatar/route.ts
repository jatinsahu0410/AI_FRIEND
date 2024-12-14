// 
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Cloudinary SDK setup
import { client } from '@/lib/prisma'; // Prisma client setup

export const config = {
    api: {
        bodyParser: false, // Disable default body parser
    },
};

// Helper to extract file and category from form-data
const getFileAndCategoryFromRequest = async (request: Request) => {
    const formData = await request.formData(); // Parse form-data
    const file = formData.get('file') as Blob; // Get the 'file' field
    const category = formData.get('category') as string; // Get the 'category' field

    if (!file || !category) {
        throw new Error('File or category is missing in the request');
    }

    return {
        buffer: Buffer.from(await file.arrayBuffer()), // Convert Blob to Buffer
        mimeType: file.type, // Get MIME type of the file
        category, // Category
    };
};

export async function POST(request: Request) {
    try {
        // Extract file and category from the form-data
        const { buffer, mimeType, category } = await getFileAndCategoryFromRequest(request);

        // Cloudinary requires a base64 string for direct upload
        const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(base64Image, {
            upload_preset: 'aifriend', 
        });

        // Save the Cloudinary secure URL and category to the database
        const newAvatar = await client.avatars.create({
            data: {
                imageUrl: cloudinaryResponse.secure_url,
                category, // Save the category to the database
            },
        });

        return NextResponse.json(newAvatar, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file or category' },
            { status: 500 }
        );
    }
}
