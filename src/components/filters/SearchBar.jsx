import useFilter from "../../zustand/filterSlice";

export default function SearchBar() {
  const { search, setSearch } = useFilter();

  return (
    <div className="mb-6">
      
      <label className="text-sm text-gray-600 mb-1 block">
        Search Products
      </label>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for cakes, Engagement, weddings..."
        className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}