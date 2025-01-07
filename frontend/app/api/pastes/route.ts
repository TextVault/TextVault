import { NextResponse } from 'next/server';
import { createPaste } from '@/actions/paste.action';

export async function POST(request: Request) {
    const { title, language, paste } = await request.json();

    try {
        const result = await createPaste(title, language, paste);
        
        return NextResponse.json({ success: true, result: result.id }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}