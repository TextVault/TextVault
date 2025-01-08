import { NextResponse } from 'next/server';
import { fetchUserPastes } from '@/actions/account.action';

export async function GET() {
    try {
        const result = await fetchUserPastes();

        return NextResponse.json({ success: true, result: result }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}