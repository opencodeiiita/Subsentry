export default function Dashboard() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="rounded-xl bg-white shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Protected Dashboard
        </h1>

        <p className="text-gray-600">
          Welcome to the Protected Rotue of Subsentry.
        </p>

        <div className="mt-6 text-sm text-gray-500">
          Access to this page is restricted to signed-in users onnly.
        </div>
      </div>
    </main>
  );
}
