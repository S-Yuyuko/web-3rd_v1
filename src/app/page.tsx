import SlideShow from '../components/home/SlideShow';
import HomeWords from '@/components/home/HomeWords';
import BubbleEffect from '@/components/effect/BubbleEffect'; // Adjust the path as needed

type HomeProps = {
  title: string;
  description: string;
  pictures: { name: string; path: string }[];
};

const fetchData = async (): Promise<HomeProps> => {
  try {
    const [wordsResponse, slidesResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homewords`, { next: { revalidate: 60 } }), // Use process.env.NEXT_PUBLIC_API_URL
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, { next: { revalidate: 60 } }),      // Use process.env.NEXT_PUBLIC_API_URL
    ]);

    const [wordsData, slidesData] = await Promise.all([wordsResponse.json(), slidesResponse.json()]);

    const title = wordsData.words?.title || 'Default Title';
    const description = wordsData.words?.description || 'Default description';
    const pictures = slidesData.pictures.map((picture: { name: string; path: string }) => ({
      name: picture.name,
      path: picture.path,
    }));

    return { title, description, pictures };
  } catch (error) {
    console.error('Failed to fetch title, description, or slide pictures:', error);
    return { title: 'Default Title', description: 'Default description', pictures: [] };
  }
};

export default async function Home() {
  const { title, description, pictures } = await fetchData();

  return (
    <main className="relative min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
      <BubbleEffect />
      <SlideShow pictures={pictures} />

      <section className="relative z-10 flex flex-col items-center justify-center h-screen">
        <HomeWords title={title} description={description} />
      </section>
    </main>
  );
}
