import { redirect } from 'next/navigation';

export default async function LegendaryRedirectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/mythos`);
}
