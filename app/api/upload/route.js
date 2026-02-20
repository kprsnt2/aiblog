import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await verifyToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Create user specific upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', user.username);
        await fs.mkdir(uploadDir, { recursive: true });

        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${user.username}/${fileName}`
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
