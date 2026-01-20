# WDV353 Module Two - Assignment

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- Morgan
- Postman

---

## Project Structure
```
app/
  controllers/
    postController.js
    userController.js
  models/
    post.js
    user.js
  routes/
    index.js
    postRouter.js
    userRouter.js
  db/
    config.js
  index.js
server.js
README.md
```

---

## Models

### User Model
The User model stores basic user information.
- username (String, required)
- password (String, required)
- age (Number)
- isActive (Boolean)

---

### Post Model
The Post model represents posts created by users.
- title (String, required)
- content (String, required)
- likes (Number)
- user (ObjectId reference to User)

Each post stores the `_id` of a user to create a relationship between the two collections.

---

## API Routes

### Users
- GET /api/v1/users – Get all users
- GET /api/v1/users/:userId – Get a user by ID
- POST /api/v1/users – Create a new user
- PUT /api/v1/users/:userId – Update a user
- DELETE /api/v1/users/:userId – Delete a user

---

### Posts
- GET /api/v1/posts – Get all posts
- GET /api/v1/posts/:postId – Get a post by ID
- POST /api/v1/posts – Create a new post (requires a valid user ID)
- PUT /api/v1/posts/:postId – Update a post
- DELETE /api/v1/posts/:postId – Delete a post

---

## Postman Testing
A Postman collection was created to test all endpoints.
Each request includes multiple tests to validate:
- Status codes
- Response payload structure
- Correct creation, updates, and deletions
- Error handling for invalid requests

Collection variables are used to store IDs between requests.