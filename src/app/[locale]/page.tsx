import HeroSection from '@/components/home/HeroSection';
import ArticlesGrid from '@/components/home/ArticlesGrid';
import FictionSection from '@/components/home/FictionSection';
import VoicesSection from '@/components/home/VoicesSection';
import MythosSection from '@/components/home/MythosSection';
import RecentPerspectives from '@/components/article/RecentPerspectives';
import { getAllArticles, getHeroConfig } from '@/lib/api';
import { setRequestLocale } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heroConfig = await getHeroConfig();
  const articles = await getAllArticles(locale);
  
  // Filter out the hero article and items not intended for the homepage
  const recentArticles = articles.filter(a => a.slug !== heroConfig.articleSlug && a.showOnHomepage !== false).slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <HeroSection locale={locale} />
      <RecentPerspectives articles={recentArticles} locale={locale} />
      <ArticlesGrid locale={locale} />
      <FictionSection locale={locale} />
      <VoicesSection locale={locale} />
      <MythosSection locale={locale} />
    </main>
  );
}
