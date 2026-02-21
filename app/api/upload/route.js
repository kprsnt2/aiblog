import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';

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

        const { url } = await put(`uploads/${user.username}/${file.name}`, file, {
            access: 'public',
        });

        return NextResponse.json({
            success: true,
            url
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
