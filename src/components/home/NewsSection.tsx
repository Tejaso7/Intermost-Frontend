'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { newsApi } from '@/lib/services';
import type { News } from '@/lib/api';

// Fallback news data
const fallbackNews: News[] = [
  {
    _id: '1',
    title: 'Intermost Education Fair 2025',
    content: 'Join us at our upcoming education fair to learn about MBBS opportunities abroad.',
    media_type: 'image',
    media_url: '/images/news/fair.jpg',
    thumbnail: '/images/news/fair.jpg',
    location: 'New Delhi',
    badge: 'Upcoming',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Student Success Stories',
    content: 'Our students share their experiences studying MBBS abroad.',
    media_type: 'image',
    media_url: '/images/countries/georgia.jpg',
    thumbnail: '/images/countries/georgia.jpg',
    location: 'Russia',
    badge: 'Featured',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Admissions Open for 2026',
    content: 'Apply now for MBBS admissions in Russia, Georgia, and Uzbekistan.',
    media_type: 'marquee',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
  },
];

export default function NewsSection() {
  const [news, setNews] = useState<News[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll({ active: true });
        if (data && data.length > 0) {
          setNews(data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Get marquee news
  const marqueeNews = news.filter((n) => n.media_type === 'marquee');
  const gridNews = news.filter((n) => n.media_type !== 'marquee').slice(0, 6);

  return (
    <section id="news-section" className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="section-title mt-2">News & Updates</h2>
          <p className="section-subtitle mt-4">
            Stay informed about our latest events, student achievements, and admission updates
          </p>
        </motion.div>

        {/* Marquee Banner */}
        {marqueeNews.length > 0 && (
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-3 rounded-xl mb-10 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {marqueeNews.map((item, index) => (
                <span key={item._id} className="mx-8 inline-flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3" />
                  {item.title}
                  {index < marqueeNews.length - 1 && <span className="mx-8">|</span>}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {marqueeNews.map((item, index) => (
                <span key={`dup-${item._id}`} className="mx-8 inline-flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3" />
                  {item.title}
                  {index < marqueeNews.length - 1 && <span className="mx-8">|</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridNews.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card card-hover overflow-hidden group"
            >
              {/* Media */}
              <div className="relative h-48 overflow-hidden">
                {item.media_type === 'video' ? (
                  <>
                    <video
                      src={item.media_url}
                      poster={item.thumbnail}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-primary-600 ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.media_url || item.thumbnail || '/images/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                
                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  {item.location && (
                    <span className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </span>
                  )}
                  {item.link && (
                    <Link
                      href={item.link}
                      className="text-primary-600 text-sm font-medium flex items-center hover:text-primary-700"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/news" className="btn-outline">
            View All News
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
