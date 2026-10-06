import { sql } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId)) {
    return Response.json({ error: 'That restaurant does not exist' }, { status: 404 });
  }

  const restaurants = await sql(
    'SELECT name, cuisine, area FROM restaurants WHERE id = $1',
    [restaurantId],
  );
  if (restaurants.length === 0) {
    return Response.json({ error: 'That restaurant does not exist' }, { status: 404 });
  }

  const stats = await sql(
    'SELECT ROUND(AVG(rating), 1)::float8 AS average, COUNT(*)::int AS total FROM reviews WHERE restaurant_id = $1',
    [restaurantId],
  );

  const reviews = await sql(
    'SELECT id, rating, comment, created_at AS "createdAt" FROM reviews WHERE restaurant_id = $1 ORDER BY created_at DESC, id DESC',
    [restaurantId],
  );

  const latestReview = reviews.length > 0 ? reviews[0] : null;
  const olderReviews = reviews.slice(1);

  // Decision: when a restaurant has no reviews, averageRating is null (not 0)
  // because "no reviews" is not the same as "rated zero", totalReviews is 0,
  // latestReview is null, and reviews is an empty array.
  return Response.json({
    name: restaurants[0].name,
    cuisine: restaurants[0].cuisine,
    area: restaurants[0].area,
    averageRating: stats[0].total === 0 ? null : stats[0].average,
    totalReviews: stats[0].total,
    latestReview,
    reviews: olderReviews,
  });
}
