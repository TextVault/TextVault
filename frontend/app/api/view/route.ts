import { NextResponse } from 'next/server';
import { fetchPasteData } from '@/actions/paste.action';

export async function POST(request: Request) {
    const { id } = await request.json();

    try {
        const result = await fetchPasteData(id);

        return NextResponse.json({ success: true, result: result }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}