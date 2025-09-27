export default function FilterBar({ filter, setFilter, categories, priorities }) {
  return (
    <div className="nrt-filterbar">
      <input
        type="search"
        placeholder="Search tasks..."
        value={filter.search}
        onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        className="nrt-searchbox"
      />
      <select
        value={filter.status}
        onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
      >
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        value={filter.category}
        onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
      >
        <option value="all">All Categories</option>
        {categories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
      </select>
      <select
        value={filter.priority}
        onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
      >
        <option value="all">All Priorities</option>
        {priorities.map(p => <option value={p} key={p}>{p}</option>)}
      </select>
      <select
        value={filter.sort}
        onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}
      >
        <option value="date">Sort by Date</option>
        <option value="priority">Sort by Priority</option>
      </select>
    </div>
  );
}