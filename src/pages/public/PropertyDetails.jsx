import { useParams } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900">
          Property Details
        </h1>

        <p className="mt-3 text-slate-600">
          Property ID: {id}
        </p>
      </div>
    </div>
  );
}

export default PropertyDetails;