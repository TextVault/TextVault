import { NextResponse } from 'next/server';
import { createPaste, deletePaste } from '@/actions/paste.action';

export async function POST(request: Request) {
    const { title, language, paste } = await request.json();

    try {
        const result = await createPaste(title, language, paste);
        
        return NextResponse.json({ success: true, result: result.id }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const pasteId = searchParams.get('id');
    
    try {
        await deletePaste((pasteId as string));

        return NextResponse.json({success: true}, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: (error as Error).message }, { status: 400 });
    }
}