import { NextResponse } from 'next/server';
import { getUserByUsername, saveUser } from '@/lib/storage';
import { hashPassword, verifyPassword, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { action, username, email, password } = await request.json();

        if (action === 'register') {
            const existing = await getUserByUsername(username);
            if (existing) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
            }

            const pwdHash = await hashPassword(password);
            await saveUser({ username, email, password: pwdHash, createdAt: new Date().toISOString() });

            const token = await createToken({ username, email });
            (await cookies()).set('auth-token', token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60 });

            return NextResponse.json({ success: true, username });
        }

        if (action === 'login') {
            const user = await getUserByUsername(username);
            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const token = await createToken({ username: user.username, email: user.email });
            (await cookies()).set('auth-token', token, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60 });

            return NextResponse.json({ success: true, username: user.username });
        }

        if (action === 'logout') {
            (await cookies()).delete('auth-token');
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
