import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center">
      <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Could not find requested resource
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
