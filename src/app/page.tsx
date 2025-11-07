import DriverOnboarding from '@/components/DriverOnBoarding';
import PostsFeed from '@/components/PostsFeed';

export default async function Home() {
  return (
    <>
      <DriverOnboarding />
      <div className="container mx-auto max-w-2xl">
        <PostsFeed />
      </div>
    </>
  );
}
