import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { toQueryString } from "../utils/helpers.js";

export default function DataTable({ url, cols, filters = [], reload, onRow, extraParams = {} }) {
  const [rows, setRows] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [sort, setSort] = useState({ key: cols[0]?.k, order: "asc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const extraParamsKey = JSON.stringify(extraParams);

  useEffect(() => {
    let active = true;
    const params = toQueryString({ ...filterValues, ...extraParams, sort: sort.key, order: sort.order });
    setLoading(true);
    api(`${url}?${params}`)
      .then((data) => {
        if (!active) return;
        setRows(Array.isArray(data) ? data : data.raters || []);
        setError("");
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [url, filterValues, sort, reload, extraParamsKey]);

  const setFilter = (key, value) => setFilterValues((current) => ({ ...current, [key]: value }));
  const clickHeader = (key) => setSort((current) => ({
    key,
    order: current.key === key && current.order === "asc" ? "desc" : "asc",
  }));

  return (
    <>
      {filters.length > 0 && (
        <div className="filters">
          {filters.map((filter) => filter.options ? (
            <select key={filter.k} value={filterValues[filter.k] || ""} onChange={(event) => setFilter(filter.k, event.target.value)}>
              <option value="">{filter.label}</option>
              {filter.options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : (
            <input key={filter.k} placeholder={filter.label} value={filterValues[filter.k] || ""}
              onChange={(event) => setFilter(filter.k, event.target.value)} />
          ))}
        </div>
      )}
      {error && <div className="err" role="alert">{error}</div>}
      <div className="wrap">
        <table>
          <thead>
            <tr>{cols.map((column) => (
              <th key={column.k} onClick={() => clickHeader(column.k)}>
                {column.label}{sort.key === column.k ? (sort.order === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index} onClick={() => onRow?.(row)} style={onRow ? { cursor: "pointer" } : undefined}>
                {cols.map((column) => <td key={column.k}>{column.render ? column.render(row) : row[column.k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="empty">Loading…</div>}
        {!loading && !error && !rows.length && <div className="empty">Nothing matches yet.</div>}
      </div>
    </>
  );
}
