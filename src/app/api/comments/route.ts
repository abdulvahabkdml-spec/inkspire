import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const article = searchParams.get('article');
    const comments = await prisma.comment.findMany({
      where: article ? { article, status: 'Approved' } : { status: 'Pending' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: comments });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const comment = await prisma.comment.create({
      data: {
        author: body.author || 'Anonymous',
        content: body.content,
        article: body.article || '',
        date: new Date().toLocaleDateString(),
        status: 'Approved', // Auto-approve to remove the need for moderation as requested
      },
    });
    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
