const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Protected Dashboard Route</h1>
        <p className="text-white">
          This page is protected and can only be accessed after logging in or signing up.
        </p>
      </div>
    </div>
  );
};

export default Page;
