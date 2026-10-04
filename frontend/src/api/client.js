const DATABASE_KEY = "storerate_demo_database";
const SESSION_KEY = "storerate_session";

const initialDatabase = {
  users: [
    { id: "user-admin", name: "StoreRate Admin", email: "admin@storerate.com", password: "Admin@123", address: "StoreRate HQ", role: "admin" },
    { id: "user-owner", name: "Demo Store Owner", email: "owner@storerate.com", password: "Owner@123", address: "12 Market Road", role: "owner" },
    { id: "user-customer", name: "Demo Customer", email: "user@storerate.com", password: "User@123", address: "8 Garden Street", role: "user" },
  ],
  stores: [
    { id: "store-1", name: "Sunrise Market", email: "hello@sunrisemarket.com", address: "12 Market Road", ownerId: "user-owner" },
    { id: "store-2", name: "Lotus Cafe", email: "hello@lotuscafe.com", address: "8 Garden Street", ownerId: null },
  ],
  ratings: [
    { id: "rating-1", userId: "user-customer", storeId: "store-1", rating: 5 },
  ],
};

function readDatabase() {
  const saved = localStorage.getItem(DATABASE_KEY);
  if (!saved) {
    writeDatabase(initialDatabase);
    return initialDatabase;
  }

  try {
    const database = JSON.parse(saved);
    if (Array.isArray(database.users) && Array.isArray(database.stores) && Array.isArray(database.ratings)) return database;
  } catch {
    // Replace invalid demo data with a usable initial database.
  }

  writeDatabase(initialDatabase);
  return initialDatabase;
}

function writeDatabase(database) {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(database));
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function requireRole(...roles) {
  const user = currentUser();
  if (!user || !roles.includes(user.role)) throw new Error("You are not authorized to perform this action.");
  return user;
}

function averageRating(database, storeId) {
  const ratings = database.ratings.filter((rating) => rating.storeId === storeId);
  if (!ratings.length) return 0;
  return Math.round((ratings.reduce((total, rating) => total + rating.rating, 0) / ratings.length) * 10) / 10;
}

function publicUser(user, database) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    rating: user.role === "owner"
      ? averageRating(database, database.stores.find((store) => store.ownerId === user.id)?.id)
      : undefined,
  };
}

function filterAndSort(rows, params) {
  const filtered = rows.filter((row) =>
    ["name", "email", "address", "role"].every((key) =>
      !params.get(key) || String(row[key] ?? "").toLowerCase().includes(params.get(key).toLowerCase()),
    ),
  );
  const key = params.get("sort");
  if (!key) return filtered;
  const direction = params.get("order") === "desc" ? -1 : 1;
  return filtered.sort((a, b) => String(a[key] ?? "").localeCompare(String(b[key] ?? ""), undefined, { numeric: true }) * direction);
}

export async function api(path, { method = "GET", body } = {}) {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  const database = readDatabase();

  if (pathname === "/auth/login" && method === "POST") {
    const email = body?.email?.trim().toLowerCase();
    const user = database.users.find((candidate) => candidate.email.toLowerCase() === email && candidate.password === body?.password);
    if (!user) throw new Error("Email or password is incorrect.");
    return { user: publicUser(user, database) };
  }

  if (pathname === "/auth/signup" && method === "POST") {
    const email = body?.email?.trim().toLowerCase();
    if (database.users.some((user) => user.email.toLowerCase() === email)) throw new Error("An account with this email already exists.");
    const user = {
      id: `user-${Date.now()}`,
      name: body.name.trim(),
      email,
      address: body.address.trim(),
      password: body.password,
      role: "user",
    };
    database.users.push(user);
    writeDatabase(database);
    return { user: publicUser(user, database) };
  }

  if (pathname === "/admin/stats" && method === "GET") {
    requireRole("admin");
    return { users: database.users.length, stores: database.stores.length, ratings: database.ratings.length };
  }

  if (pathname === "/admin/owners" && method === "GET") {
    requireRole("admin");
    return database.users.filter((user) => user.role === "owner").map((user) => publicUser(user, database));
  }

  if ((pathname === "/admin/stores" || pathname === "/owner/stores") && method === "GET") {
    requireRole(pathname.startsWith("/admin") ? "admin" : "owner");
    const stores = database.stores.map((store) => ({
      ...store,
      owner: database.users.find((user) => user.id === store.ownerId)?.name || "Unassigned",
      rating: averageRating(database, store.id),
    }));
    return filterAndSort(stores, params);
  }

  if (pathname === "/admin/stores" && method === "POST") {
    requireRole("admin");
    const store = {
      id: `store-${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      address: body.address.trim(),
      ownerId: body.ownerId || null,
    };
    database.stores.push(store);
    writeDatabase(database);
    return store;
  }

  if (pathname === "/owner/users" && method === "GET") {
    requireRole("owner");
    return filterAndSort(database.users.map((user) => publicUser(user, database)), params);
  }

  if (pathname === "/stores" && method === "GET") {
    const user = requireRole("user");
    const search = (params.get("search") || "").toLowerCase();
    const stores = database.stores
      .filter((store) => `${store.name} ${store.address}`.toLowerCase().includes(search))
      .map((store) => ({
        ...store,
        rating: averageRating(database, store.id),
        my_rating: database.ratings.find((rating) => rating.storeId === store.id && rating.userId === user.id)?.rating || 0,
      }));
    return stores;
  }

  const ratingMatch = pathname.match(/^\/stores\/([^/]+)\/rating$/);
  if (ratingMatch && method === "POST") {
    const user = requireRole("user");
    const store = database.stores.find((candidate) => candidate.id === ratingMatch[1]);
    if (!store) throw new Error("Store not found.");
    if (!Number.isInteger(body?.rating) || body.rating < 1 || body.rating > 5) throw new Error("Rating must be between 1 and 5.");
    const existing = database.ratings.find((rating) => rating.storeId === store.id && rating.userId === user.id);
    if (existing) existing.rating = body.rating;
    else database.ratings.push({ id: `rating-${Date.now()}`, userId: user.id, storeId: store.id, rating: body.rating });
    writeDatabase(database);
    return { success: true };
  }

  throw new Error("This action is not available in the local demo.");
}
