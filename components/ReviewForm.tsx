'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ restaurantId }: { restaurantId: string }) {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${restaurantId}`)
      .then((r) => r.json())
      .then((data) => setRestaurantName(data.name ?? ''));
  }, [restaurantId]);

  const canSubmit = rating >= 1 && comment.trim().length > 0 && !submitting;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId: Number(restaurantId), rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setSubmitting(false);
      return;
    }
    router.push(`/restaurant/${restaurantId}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">
        {restaurantName || '…'}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">Write a review</p>

      <div className="mt-8 flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onClick={() => setRating(n)}
            className="p-1"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill={n <= rating ? '#c2410c' : 'none'} stroke={n <= rating ? '#c2410c' : '#d6d3d1'} strokeWidth="1.5">
              <path d="M12 2.5l2.95 6.3 6.55.7-4.9 4.4 1.4 6.6L12 17.2l-5.8 3.3 1.4-6.6-4.9-4.4 6.55-.7z" />
            </svg>
          </button>
        ))}
      </div>

      <textarea
        className="mt-6 w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-900 outline-none focus:border-orange-700"
        rows={4}
        placeholder="What did you think?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-5 rounded-lg bg-orange-700 px-5 py-2.5 text-white disabled:opacity-40"
      >
        Submit
      </button>
    </div>
  );
}
