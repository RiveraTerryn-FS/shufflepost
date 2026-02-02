require("dotenv").config();
describe("Users Operators, Pagination, Sorting", () => {
	let usersService;
	// Run once before all tests
	// Decides whether to use the real service or the mocked service
	beforeAll(async () => {
		jest.resetModules();
		if (process.env.MOCK) {
			// Use mocked service when MOCK env variable is set
			console.log("MOCK");
			jest.doMock("./usersService");
		} else {
			// Use real service when MOCK is not set
			console.log("REAL");
		}
		// Import the service after deciding mock vs real
		({ usersService } = require("./usersService"));
	});
	// Test pagination limit
	test("Should have pagination limit", async () => {
		const result = await usersService("page=1&limit=5");
		const data = result.data.data;
		// Should not return more users than the limit
		expect(data.length).toBeLessThanOrEqual(5);
	});
	// Test field selection
	test("Should only return selected fields", async () => {
		const result = await usersService("select=username");
		const user = result.data.data[0];
		// Fields that should exist
		expect(user).toHaveProperty("_id");
		expect(user).toHaveProperty("username");
		expect(user).toHaveProperty("posts");
		// Fields that should not be returned
		expect(user).not.toHaveProperty("role");
		expect(user).not.toHaveProperty("createdAt");
	});
	// Test sorting users by username (ascending)
	test("Should sort users by username asc", async () => {
		const result = await usersService("sort=username");
		const users = result.data.data;

		// First username should come before or same as the second
		expect(
			users[0].username.localeCompare(users[1].username)
		).toBeLessThanOrEqual(0);
	});
	// Test sorting users by username (descending)
	test("Should sort users by username desc", async () => {
		const result = await usersService("sort=-username");
		const users = result.data.data;

		// First username should come after or same as the second
		expect(
			users[0].username.localeCompare(users[1].username)
		).toBeGreaterThanOrEqual(0);
	});
});
