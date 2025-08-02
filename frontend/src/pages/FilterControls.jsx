export default function FilterControls({ filters, setFilters }) {
  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const clearFilters = () =>
    setFilters({ status: "", category: "", date: "" });

  return (
    <div className="mb-6 flex flex-wrap gap-4 items-end">
      {/* Status Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="e.g., Work"
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Date Filter */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Due Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Clear Button */}
      <button
        onClick={clearFilters}
        className="ml-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow-sm transition"
      >
        Clear Filters
      </button>
    </div>
  );
}
