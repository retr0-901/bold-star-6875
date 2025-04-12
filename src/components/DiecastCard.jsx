export default function DiecastCard({ diecast, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{diecast.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{diecast.category}</p>
        <p className="text-blue-600 font-medium mt-2">${diecast.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
