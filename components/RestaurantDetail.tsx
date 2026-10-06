'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Review = { id: number; rating: number; comment: string; createdAt: string };
type Data = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function RestaurantDetail({ restaurantId }: { restaurantId: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(setData)
      .catch(() => setError('Restaurant not found.'));
  }, [restaurantId]);

  if (error) return <p className="text-neutral-700">{error}</p>;
  if (!data) return <p className="text-neutral-500">Loading…</p>;

  if (data.totalReviews === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">{data.name}</h1>
        <p className="mt-1 text-sm text-neutral-500">{data.cuisine} · {data.area}</p>
        <p className="mt-10 text-neutral-700">No reviews yet — be the first to write one.</p>
        <Link href={`/review/${restaurantId}`} className="mt-4 inline-block text-orange-700 underline">
          Write a review
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">{data.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">{data.cuisine} · {data.area}</p>

      <div className="mt-8 flex items-baseline gap-3">
        <span className="text-6xl font-semibold text-neutral-900">
          {data.averageRating}
        </span>
        <span className="text-sm text-neutral-500">
          {data.totalReviews} review{data.totalReviews === 1 ? '' : 's'}
        </span>
      </div>

      {data.latestReview && (
        <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm text-orange-800">Latest review</p>
          <p className="mt-1 font-medium text-neutral-900">
            {data.latestReview.rating} / 5 — {data.latestReview.comment}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{formatDate(data.latestReview.createdAt)}</p>
        </div>
      )}

      <ul className="mt-8 divide-y divide-neutral-200">
        {data.reviews.map((r) => (
          <li key={r.id} className="py-4">
            <p className="font-medium text-neutral-900">{r.rating} / 5 — {r.comment}</p>
            <p className="mt-1 text-xs text-neutral-500">{formatDate(r.createdAt)}</p>
          </li>
        ))}
      </ul>

      <Link href={`/review/${restaurantId}`} className="mt-6 inline-block text-orange-700 underline">
        Write a review
      </Link>
    </div>
  );
}
