require("dotenv").config();
describe("Posts Operators, Pagination, Sorting", () => {
	let postsService;
	// Run once before all tests
	// Chooses between real service and mock service
	beforeAll(async () => {
		jest.resetModules();
		if (process.env.MOCK) {
			// Use mocked posts service
			console.log("MOCK");
			jest.doMock("./postsService");
		} else {
			// Use real posts service
			console.log("REAL");
		}
		// Import service after mock decision
		({ postsService } = require("./postsService"));
	});

	// Test pagination limit
	test("Should have pagination limit", async () => {
		const result = await postsService("page=1&limit=5");
		const data = result.data.data;
		// Should not return more posts than the limit
		expect(data.length).toBeLessThanOrEqual(5);
	});
	// Test field selection
	test("Should only return selected fields", async () => {
		const result = await postsService("select=title");
		const post = result.data.data[0];
		// Fields that should exist
		expect(post).toHaveProperty("_id");
		expect(post).toHaveProperty("title");
		expect(post).toHaveProperty("user");
		// Fields that should not be returned
		expect(post).not.toHaveProperty("content");
		expect(post).not.toHaveProperty("likes");
		expect(post).not.toHaveProperty("createdAt");
	});
	// Test sorting posts by likes (ascending)
	test("Should sort posts by likes asc", async () => {
		const result = await postsService("sort=likes");
		const posts = result.data.data;

		// First post should have less or same amount of likes as the second
		expect(posts[0].likes).toBeLessThanOrEqual(posts[1].likes);
	});
	// Test sorting posts by likes (descending)
	test("Should sort posts by likes desc", async () => {
		const result = await postsService("sort=-likes");
		const posts = result.data.data;
		// First post should have more or same amount of likes as the second
		expect(posts[0].likes).toBeGreaterThanOrEqual(posts[1].likes);
	});
});
