import useFilter from "../../zustand/filterSlice";

export default function Pagination({ totalPages }) {
  const { page, setPage } = useFilter();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-10">

      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-4 py-2 border rounded ${
            page === i + 1
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          {i + 1}
        </button>
      ))}

    </div>
  );
}