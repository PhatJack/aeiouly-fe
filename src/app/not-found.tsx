import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-4">Page not found</p>
        <Link href="/vi" className="mt-4 inline-block text-blue-500">
          Go to Home (Vietnamese)
        </Link>
        {' | '}
        <Link href="/en" className="inline-block text-blue-500">
          Go to Home (English)
        </Link>
      </div>
    </div>
  );
}
