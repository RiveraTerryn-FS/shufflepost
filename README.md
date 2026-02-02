# WDV353 Module Two –  ShufflePost


---

## Technologies Used

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication (access + refresh tokens)
- Morgan
- Postman

### Frontend
- React
- React Router v6
- Styled-Components
- React Icons
- Vite
---

## Project Structure
```
backend/
  app/
    controllers/
      authController.js
      postController.js
    middleware/
      authenticate.js
    models/
      post.js
      user.js
    routes/
      authRouter.js
      postRouter.js
    db/
      config.js
    utils/
      authToken.js
    index.js
  tests/
client/
  public/
  src/
    assets/
    components/
    context/
    pages/
    utils/
    App.jsx
    main.jsx
server.js
README.md
````

---

## Models

### User Model
- username (String, required)
- password (String, required)
- role (String, default: "user")
- active (Boolean)
- age (Number)
- posts (Array)
- createdAt / updatedAt

### Post Model
- title (String, required)
- content (String, required)
- likes (Number)
- hidden (Boolean)
- anonymous (Boolean)
- likedBy (Array)
- dislikedBy (Array)
- user (ObjectId reference)
- createdAt / updatedAt

---

## API Routes

### Auth
POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/refresh  
POST /api/auth/logout  

### Posts
GET    /api/posts/random  
POST   /api/posts  
GET    /api/posts/user  
PUT    /api/posts/:postId  
DELETE /api/posts/:postId  
POST   /api/posts/:postId/like  

---

## Environment Setup

.env (backend)
```
PORT=3000  
MONGO_URL=mongodb://127.0.0.1:27017/wdv353  
JWT_SECRET=SecretKey123  
REFRESH_SECRET=SecretKey321  
```
.env.local (client)
```
VITE_API_URL=http://localhost:3000/api/v1/
```
---

## Running the Project
```
npm install
cd client
npm install
cd ../
npm run dev  
```
Backend: http://localhost:3000  
Client: http://localhost:5173  