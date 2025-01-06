import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { registerUser } from '@/actions/auth.action';

export async function POST(request: Request) {
    const { username, mail, password } = await request.json();

    try {
        const result = await registerUser(username, mail, password);
        (await cookies()).set("token", result.token);
        (await cookies()).set("username", result.username);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}