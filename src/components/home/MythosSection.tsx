import { Link } from '@/navigation';
import { getArticlesByCategory } from '@/lib/api';
import Image from 'next/image';

export default async function MythosSection({ locale }: { locale: string }) {
  const articles = await getArticlesByCategory('Mythos', locale);
  const displayArticles = articles.length > 0 ? articles.slice(0, 2) : [];

  if (displayArticles.length === 0) return null;

  return (
    <section className="mb-20 px-4 md:px-0">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-[0.1em] uppercase leading-none dark:text-white">Mythos</h2>
        <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {displayArticles.map((article) => (
          <Link 
            key={article.slug} 
            href={`/article/${article.slug}`}
            className="group block relative overflow-hidden rounded-3xl aspect-[16/10] bg-slate-100 dark:bg-slate-900 shadow-2xl shadow-black/5"
          >
            <Image 
              src={article.imageUrl} 
              alt={article.title}
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
               <span className="inline-block text-[9px] font-bold uppercase tracking-[0.3em] mb-4 text-[#ec5b13]">Mythos Selection</span>
               <h3 className="text-2xl md:text-3xl font-bold font-serif mb-4 group-hover:text-[#ec5b13] transition-colors leading-tight">
                 {article.title}
               </h3>
               <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="w-8 h-px bg-white/40"></div>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Entry of Legend</p>
               </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/mythos" className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-[#ec5b13] transition-colors border-b border-transparent hover:border-[#ec5b13] pb-1">
          Explore the Mythos Archive
        </Link>
      </div>
    </section>
  );
}
