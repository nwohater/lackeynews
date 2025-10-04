import { NextRequest, NextResponse } from 'next/server';
import { aggregateNews } from '@/lib/aggregator';

export const dynamic = 'force-dynamic'; // Disable static generation
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicsParam = searchParams.get('topics');
    const limitParam = searchParams.get('limit');

    const topics = topicsParam ? topicsParam.split(',') : undefined;
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const news = await aggregateNews({ topics, limit });

    return NextResponse.json({
      success: true,
      data: {
        articles: news.articles.map((article) => ({
          ...article,
          publishedAt: article.publishedAt.toISOString(),
        })),
        sources: news.sources,
        fetchedAt: news.fetchedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /api/news:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}
