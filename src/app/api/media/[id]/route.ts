import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function DELETE(
  req: NextRequest,
  context: { params: any }
) {
  try {
    // The most compatible way to handle params in Next.js 13/14/15
    const params = await context.params;
    const id = params?.id;

    console.log(`[DELETE] Starting deletion for ID: "${id}"`);

    if (!id) {
      console.error('[DELETE] Missing ID in request');
      return NextResponse.json({ success: false, error: 'No ID provided' }, { status: 400 });
    }

    // Connect to prisma and find the item
    const media = await (prisma as any).media.findUnique({
      where: { id },
    });

    if (!media) {
      console.warn(`[DELETE] Media with ID "${id}" not found in database`);
      return NextResponse.json({ success: false, error: 'Media not found in database' }, { status: 404 });
    }

    // Cloudinary Cleanup
    if (media.publicId) {
      console.log(`[DELETE] Found Cloudinary publicId: ${media.publicId}. Deleting...`);
      try {
        await deleteFromCloudinary(media.publicId);
        console.log('[DELETE] Cloudinary asset deleted successfully');
      } catch (cloudinaryErr: any) {
        console.error('[DELETE] Cloudinary error (continuing with DB delete):', cloudinaryErr.message || cloudinaryErr);
      }
    }

    // Database Cleanup
    console.log(`[DELETE] Removing record from database...`);
    await (prisma as any).media.delete({
      where: { id },
    });

    console.log(`[DELETE] Successfully deleted: ${id}`);
    return NextResponse.json({ success: true, message: 'Media deleted successfully' });

  } catch (err: any) {
    console.error('[DELETE] Critical server error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'An internal server error occurred during deletion' 
    }, { status: 500 });
  }
}
