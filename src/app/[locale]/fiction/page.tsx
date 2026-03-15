import type { Metadata } from 'next';
import { getArticlesByCategory } from '@/lib/api';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import FictionClient from './FictionClient';

export const metadata: Metadata = {
  title: 'Fiction | THE HISTORIA',
  description: 'Explore our curated collection of contemporary narratives, short stories, and experimental prose.',
};

export default async function FictionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const fictionArticles = await getArticlesByCategory('Fiction', locale);

  return (
    <main className="px-6 md:px-20 py-20 max-w-[1400px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-12 mb-16">
        <div className="max-w-3xl">
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-bold tracking-tight serif-font leading-none capitalize mb-6">
            {t('nav.fiction')}
          </h1>
          <div className="h-1 w-24 bg-black dark:bg-white mb-8"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-serif italic leading-relaxed font-light">
            &ldquo;Fiction is the lie through which we tell the truth.&rdquo; Explore our curated collection of contemporary narratives, short stories, and experimental prose.
          </p>
        </div>
      </div>

      <FictionClient initialArticles={fictionArticles} />
    </main>
  );
}
