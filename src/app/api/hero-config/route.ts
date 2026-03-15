import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    let config = await prisma.heroConfig.findFirst();
    if (!config) {
      config = await prisma.heroConfig.create({
        data: { 
          articleSlug: 'the-girls-we-forgot-a-reckoning-with-selective-empathy',
          secondarySlug: 'twenty-five-held-breaths',
        } as any,
      });
    }
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    let config = await prisma.heroConfig.findFirst();
    
    // Strictly pick the fields we want to save to avoid Prisma errors
    const validData = {
      articleSlug: (body.articleSlug || '').replace(/^\//, ''),
      secondarySlug: (body.secondarySlug || '').replace(/^\//, ''),
      customTitle: body.customTitle || '',
      customExcerpt: body.customExcerpt || '',
    };
    
    // Validate if slug exist
    if (validData.articleSlug) {
      let art = await prisma.article.findUnique({ where: { slug: validData.articleSlug } });
      
      // Fallback: Check if they pasted the Title instead of the Slug
      if (!art) {
        art = await prisma.article.findFirst({ 
          where: { title: { equals: body.articleSlug, mode: 'insensitive' } } 
        });
        if (art) {
          validData.articleSlug = art.slug; // Auto-correct to actual slug
        }
      }

      if (!art) {
        return NextResponse.json({ success: false, error: `Primary Article "${validData.articleSlug}" not found in database.` }, { status: 404 });
      }
    }

    if (validData.secondarySlug) {
      let art = await prisma.article.findUnique({ where: { slug: validData.secondarySlug } });
      
      // Fallback: Check if they pasted the Title instead of the Slug
      if (!art) {
        art = await prisma.article.findFirst({ 
          where: { title: { equals: body.secondarySlug, mode: 'insensitive' } } 
        });
        if (art) {
          validData.secondarySlug = art.slug; // Auto-correct to actual slug
        }
      }

      if (!art) {
        return NextResponse.json({ success: false, error: `Secondary Article "${validData.secondarySlug}" not found in database.` }, { status: 404 });
      }
    }
    
    if (config) {
      config = await prisma.heroConfig.update({
        where: { id: config.id },
        data: validData,
      });
    } else {
      config = await prisma.heroConfig.create({
        data: validData,
      });
    }
    // Clear caches for the entire site (layout) or just home ('/')
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
