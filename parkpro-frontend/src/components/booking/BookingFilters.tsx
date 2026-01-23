interface BookingFiltersProps {
  dateFilter: { start: string; end: string };
  onDateFilterChange: (filter: { start: string; end: string }) => void;
  onReset: () => void;
}

export function BookingFilters({ dateFilter, onDateFilterChange, onReset }: BookingFiltersProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Range */}
        <div>
          <label className="label mb-1">Start Date</label>
          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) => onDateFilterChange({ ...dateFilter, start: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="label mb-1">End Date</label>
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => onDateFilterChange({ ...dateFilter, end: e.target.value })}
            className="input"
          />
        </div>

        {/* Tenant Filter */}
        <div>
          <label className="label mb-1">Tenant</label>
          <select className="input">
            <option value="">All Tenants</option>
            <option value="tenant-001">TechCorp Inc.</option>
            <option value="tenant-002">FinanceHub Ltd.</option>
            <option value="tenant-003">DesignStudio</option>
          </select>
        </div>

        {/* Pool Filter */}
        <div>
          <label className="label mb-1">Pool</label>
          <select className="input">
            <option value="">All Pools</option>
            <option value="reserved">Reserved</option>
            <option value="fcfs">First Come First Served</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-3">
        <button onClick={onReset} className="btn-secondary text-sm">
          Reset Filters
        </button>
        <button className="btn-primary text-sm">Apply Filters</button>
      </div>
    </div>
  );
}
