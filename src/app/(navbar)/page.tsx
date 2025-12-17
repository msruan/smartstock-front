import HomePage from "@/components/pages/home-page";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { selected_inventory } = await searchParams;
  return <HomePage selectedInventory={selected_inventory ?? null} />;
};

export default Home;
