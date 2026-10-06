import { sql } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: 'Request body must be JSON' }, { status: 400 });
  }

  const { restaurantId, rating, comment } = body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json(
      { error: 'rating must be a whole number between 1 and 5' },
      { status: 400 },
    );
  }

  if (typeof comment !== 'string' || comment.trim().length === 0) {
    return Response.json(
      { error: 'comment must be a non-empty string' },
      { status: 400 },
    );
  }

  if (!Number.isInteger(restaurantId)) {
    return Response.json(
      { error: 'restaurantId must be a whole number' },
      { status: 400 },
    );
  }

  const existing = await sql('SELECT id FROM restaurants WHERE id = $1', [restaurantId]);
  if (existing.length === 0) {
    return Response.json(
      { error: 'That restaurant does not exist' },
      { status: 400 },
    );
  }

  const inserted = await sql(
    'INSERT INTO reviews (restaurant_id, rating, comment) VALUES ($1, $2, $3) RETURNING id',
    [restaurantId, rating, comment.trim()],
  );

  return Response.json({ success: true, reviewId: inserted[0].id }, { status: 201 });
}
