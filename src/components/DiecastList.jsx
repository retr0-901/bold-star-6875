import { useEffect, useState } from "react";
import DiecastCard from "./DiecastCard";

export default function DiecastList({ filter, onSelectDiecast }) {
  const [diecasts, setDiecasts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDiecasts = async () => {
      setLoading(true);
      try {
        // Simulate API call with mock data
        const mockDiecasts = [
          { id: 1, title: "Classic Muscle Car", category: "Cars", price: 49.99 },
          { id: 2, title: "Vintage Airplane", category: "Aircraft", price: 59.99 },
          { id: 3, title: "Military Tank", category: "Military", price: 39.99 }
        ];
        
        const filtered = filter 
          ? mockDiecasts.filter(d => d.category === filter)
          : mockDiecasts;
          
        setDiecasts(filtered);
      } catch (error) {
        console.error("Error loading diecasts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDiecasts();
  }, [filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-10 w-10 border-2 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {diecasts.map((diecast) => (
        <DiecastCard 
          key={diecast.id} 
          diecast={diecast}
          onClick={() => onSelectDiecast(diecast.id)}
        />
      ))}
    </div>
  );
}
