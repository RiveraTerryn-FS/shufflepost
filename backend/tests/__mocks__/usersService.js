const usersService = async (query = "") => {
    let data = [
        {
            _id: "001",
            username: "support",
            age: 30,
            role: "user",
            active: true,
            posts: [{ _id: "post1", title: "Support" }],
        },
        {
            _id: "002",
            username: "admin",
            age: 22,
            role: "user",
            active: true,
            posts: [],
        },
        {
            _id: "003",
            username: "user1",
            age: 28,
            role: "user",
            active: true,
            posts: [],
        },
        {
            _id: "004",
            username: "user2",
            age: 50,
            role: "user",
            active: true,
            posts: [],
        },
        {
            _id: "005",
            username: "user3",
            age: 60,
            role: "user",
            active: true,
            posts: [{ _id: "post2", title: "Test" }],
        },
    ];

    if (query.includes("sort=username")) {
        data.sort((a, b) => a.username.localeCompare(b.username));
    }
    if (query.includes("sort=-username")) {
        data.sort((a, b) => b.username.localeCompare(a.username));
    }
    if (query.includes("select=")) {
        const fields = query.split("select=")[1].split(",");
        data = data.map(user => {
            const select = { _id: user._id, posts: user.posts };
            fields.forEach(field => {
                select[field] = user[field];
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

module.exports = { usersService };