import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Uncompiled Insanity</title>
        <meta name='description' content='Welcome to Uncompiled Insanity' />
      </Head>
      <main className='flex min-h-screen flex-col items-center justify-center bg-gray-100'>
        <h1 className='text-6xl font-bold text-blue-600'>
          Uncompiled Insanity
        </h1>
        <p className='mt-4 text-xl text-gray-700'>
          Your Next.js + TailwindCSS Starter
        </p>
      </main>
    </>
  );
}
