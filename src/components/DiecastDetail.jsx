import { useEffect, useState } from "react";

export default function DiecastDetail({ diecastData }) {
  const [diecast, setDiecast] = useState(diecastData.diecast);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (diecastData) {
      setDiecast(diecastData.diecast);
    }
  }, [diecastData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{diecast.title}</h2>
      <p className="text-gray-600">{diecast.category}</p>
      <p className="text-blue-600 font-medium mt-2">${diecast.price.toFixed(2)}</p>
      <p className="mt-4">{diecast.description}</p>
    </div>
  );
}
