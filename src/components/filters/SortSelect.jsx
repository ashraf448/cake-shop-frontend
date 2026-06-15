import useFilter from "../../zustand/filterSlice";

export default function SortSelect() {
  const { sort, setSort } = useFilter();

  return (
    <div className="w-full md:w-1/2">

      <label className="text-sm text-gray-600 mb-1 block">
        Sort By Price
      </label>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full p-3 border rounded-lg"
      >
        <option value="default">Default</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>
    </div>
  );
}