import { getArticlesByCategory } from '@/lib/api';
import { setRequestLocale } from 'next-intl/server';
import ArchivesClient from '../archives/ArchivesClient';

export default async function MythosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Pull both 'Mythos' and legacy 'Legendary' entries so old articles still appear
  const mythosArticles = await getArticlesByCategory('Mythos', locale);
  const legacyArticles = await getArticlesByCategory('Legendary', locale);
  const articles = [...mythosArticles, ...legacyArticles];

  const tags = Array.from(new Set(articles.flatMap(a => a.tags || [])));

  return (
    <main className="px-6 md:px-20 py-20 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-12 mb-20">
        <div className="max-w-3xl">
          <h1 className="text-black dark:text-white text-3xl md:text-4xl font-bold tracking-tight serif-font leading-none capitalize mb-6">
            Mythos
          </h1>
          <div className="h-1 w-24 bg-[#ec5b13] mb-8"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-serif italic leading-relaxed font-light">
            The greatest works by legendary poets, writers, and scholars — myths, epics, and timeless tales preserved for eternity.
          </p>
        </div>
        
        <ArchivesClient initialArticles={articles} customTags={tags} />
      </div>
    </main>
  );
}
