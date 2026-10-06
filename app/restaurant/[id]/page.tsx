import RestaurantDetail from '@/components/RestaurantDetail';

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto w-full max-w-[560px] px-5 py-10">
      <RestaurantDetail restaurantId={id} />
    </main>
  );
}
