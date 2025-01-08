import { NextResponse } from 'next/server';
import { fetchPasteData } from '@/actions/paste.action';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pasteId = searchParams.get('id');
    
    try {
        const result = await fetchPasteData((pasteId as string));

        return NextResponse.json({ success: true, result: result }, {status: 200});
    } catch (error) {
        return NextResponse.json({ success: false, message: "Paste not found" }, { status: 400 });
    }
}