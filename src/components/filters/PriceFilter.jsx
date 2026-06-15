import useFilter from "../../zustand/filterSlice";

export default function PriceFilter() {
  const { minPrice, maxPrice, setPriceRange } = useFilter();

  return (
    <div className="w-full md:w-1/2">

      <label className="text-sm text-gray-600 mb-1 block">
        Price Range
      </label>

      <div className="flex gap-3">

        <input
          type="number"
          value={minPrice}
          onChange={(e) =>
            setPriceRange(Number(e.target.value), maxPrice)
          }
          placeholder="Min price"
          className="w-1/2 p-3 border rounded-lg"
        />

        <input
          type="number"
          value={maxPrice}
          onChange={(e) =>
            setPriceRange(minPrice, Number(e.target.value))
          }
          placeholder="Max price"
          className="w-1/2 p-3 border rounded-lg"
        />

      </div>

    </div>
  );
}