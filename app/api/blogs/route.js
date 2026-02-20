import { NextResponse } from 'next/server';
import { getBlogs } from '@/lib/storage';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const token = (await cookies()).get('auth-token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await verifyToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const blogs = await getBlogs(user.username);
        return NextResponse.json({ success: true, blogs });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
