import { create } from "zustand";

const useFilter = create((set) => ({
  search: "",
  minPrice: 0,
  maxPrice: 10000,
  sort: "default",
  page: 1,
  limit: 8,

  setSearch: (val) => set({ search: val, page: 1 }),
  setSort: (val) => set({ sort: val }),
  setPriceRange: (min, max) =>
    set({ minPrice: min, maxPrice: max, page: 1 }),
  setPage: (val) => set({ page: val }),
}));

export default useFilter;