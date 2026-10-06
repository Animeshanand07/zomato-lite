import ReviewForm from '@/components/ReviewForm';

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 py-10">
      <ReviewForm restaurantId={restaurantId} />
    </main>
  );
}
