import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: media });
  } catch (err: any) {
    console.error('MEDIA_GET_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const media = await prisma.media.create({
      data: {
        url: body.url,
        name: body.name || body.url.split('/').pop()?.split('?')[0] || 'unnamed-asset',
        size: body.size || '0 MB',
        publicId: body.publicId || null,
      },
    });
    return NextResponse.json({ success: true, data: media }, { status: 201 });
  } catch (err: any) {
    console.error('MEDIA_POST_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    // Find the media item first to get the publicId
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
    }

    // Cloudinary Cleanup
    if (media.publicId) {
      try {
        await deleteFromCloudinary(media.publicId);
      } catch (cloudinaryErr: any) {
        console.error('Cloudinary delete error (falling back to DB only):', cloudinaryErr);
      }
    }

    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Media deleted' });
  } catch (err: any) {
    console.error('MEDIA_DELETE_FALLBACK_ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
