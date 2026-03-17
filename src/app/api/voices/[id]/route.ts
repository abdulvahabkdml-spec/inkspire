import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const voice = await prisma.voice.update({
      where: { id },
      data: {
        contributor: body.contributor,
        role: body.role,
        quote: body.quote,
        imageUrl: body.imageUrl,
      },
    });
    return NextResponse.json({ success: true, data: voice });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    await prisma.voice.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Voice deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
