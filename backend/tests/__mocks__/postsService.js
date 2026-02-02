const postsService = async (query = "") => {
    let data = [
        {
            _id: "001",
            title: "Support",
            likes: 120,
            user: {
                _id: "user1",
                username: "support",
            },
            createdAt: "2026-01-25",
            updatedAt: "2026-01-25",
        },
        {
            _id: "002",
            title: "Admin",
            likes: 0,
            user: {
                _id: "user2",
                username: "admin",
            },
            createdAt: "2026-01-25",
            updatedAt: "2026-01-25",
        },
        {
            _id: "003",
            title: "Test",
            likes: 99,
            user: {
                _id: "user3",
                username: "test",
            },
            createdAt: "2026-01-25",
            updatedAt: "2026-01-25",
        },
    ];
    if (query.includes("sort=likes")) {
        data = data.sort((a, b) => a.likes - b.likes);
    }
    if (query.includes("sort=-likes")) {
        data = data.sort((a, b) => b.likes - a.likes);
    }
    if (query.includes("limit=")) {
        const limit = query.split("limit=")[1];
        data = data.slice(0, Number(limit));
    }
    if (query.includes("select=")) {
        const fields = query.split("select=")[1].split(",");
        data = data.map(post => {
            const select = { _id: post._id, user: post.user };
            fields.forEach(field => {
                select[field] = post[field];
            });
            return select;
        });
    }
    return Promise.resolve({
        data: {
        success: true,
        count: data.length,
        data,
        },
    });
};
module.exports = { postsService };