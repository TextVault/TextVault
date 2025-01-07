import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginUser } from '@/actions/auth.action';

export async function POST(request: Request) {
    const { username, password } = await request.json();

    try {
        const result = await loginUser(username, password);
        (await cookies()).set("token", result.token);
        (await cookies()).set("username", result.username);
        return NextResponse.json({ success: true }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}