export async function apiFetch(
	url,
	options = {},
	{ token, setToken }
) {
	const res = await fetch(url, { ...options,
		headers: {
			...(options.headers || {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		credentials: "include",
	});
	// Return 401 if not expired
	if (res.status !== 401) return res;
	// Attempt refresh
	const refreshRes = await fetch(
		import.meta.env.VITE_API_URL + "auth/refresh", {
			method: "POST",
			credentials: "include",
		}
	);
	if (!refreshRes.ok) {
		throw new Error("Session expired");
	}
	const refreshData = await refreshRes.json();
	setToken(refreshData.token);
	// Retry request
	return fetch(url, { ...options,
		headers: { ...(options.headers || {}),
			Authorization: `Bearer ${refreshData.token}`,
		},
		credentials: "include",
	});
}