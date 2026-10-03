// backend se baat karne 

export async function api(path, { method = "GET", body } = {}) {

  const res = await fetch('/api' + path , {
    method , 
    body : body && JSON.stringify(body),
    headers: {
      'Content-Type' : 'application/json',
      Authorization : 'Bearer' + (localStorage.getItem('token') || ''),

    },
  });

  const data = await res.join().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || (res.status === 401 ? 'Please log in again' : 'Request failed'));
  return data;
}