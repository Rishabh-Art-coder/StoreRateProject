import { useState } from "react";

export default function DataTable({
  url,
  cols,
  filters = [],
  reload,
  onRow,
  extraParams = {},
}) {
  const [rows, setRows] = useState();
  const [filterValues, setFilterValues] = useState({});
  const [sort, setSort] = useState({ key: cols[0].k, order: "asc" });

  // Filter ya sort badalte hi (250ms ruk kar) naya data mangwao.
  useEffect(() => {
    const params = toQueryString({
      ...filterValues,
      ...extraParams,
      sort: sort.key,
      order: sort.order,
    });
    const timer = setTimeout(() => {
      api(`${url}?${params}`)
        .then((data) => {
          setRows(data.raters || data);
          setError("");
        })
        .catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(timer);
  }, [url, filterValues, sort, reload, JSON.stringify(extraParams)]);

  const setFilter = (key, value) =>
    setFilterValues({ ...filterValues, [key]: value });
  const clickHeader = (key) =>
    setSort({
      key,
      order: sort.key === key && sort.order === "asc" ? "desc" : "asc",
    });

  return (
    <>
      {filters.length > 0 && (
        <div className="filters">
          {filters.map((x) =>
            x.options ? (
              <select
                key={x.k}
                value={filterValues[x.k] || ""}
                onChange={(e) => setFilter(x.k, e.target.value)}
              >
                <option value="">{x.label}</option>
                {x.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                key={x.k}
                placeholder={x.label}
                value={filterValues[x.k] || ""}
                onChange={(e) => setFilter(x.k, e.target.value)}
              />
            ),
          )}
        </div>
      )}
      {error && <div className="err">{error}</div>}
      <div className="wrap">
        <table>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.k} onClick={() => clickHeader(c.k)}>
                  {c.label}
                  {sort.key === c.k ? (sort.order === "asc" ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id || i}
                onClick={() => onRow && onRow(r)}
                style={onRow ? { cursor: "pointer" } : {}}
              >
                {cols.map((c) => (
                  <td key={c.k}>{c.render ? c.render(r) : r[c.k]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && !error && (
          <div className="empty">Nothing matches yet.</div>
        )}
      </div>
    </>
  );
}
