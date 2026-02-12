# OKR Backend — NestJS API
 
This is the backend service for the **OKR (Objectives and Key Results)** application.  

It is built using **NestJS**, **Prisma ORM**, and **PostgreSQL**.
 
The API provides endpoints to manage objectives and key results following a modular and scalable architecture.
 
---
 
## 🧠 Tech Stack
 
- **Backend Framework:** NestJS (TypeScript)

- **ORM:** Prisma

- **Database:** PostgreSQL

- **Validation-pipes:** Controller validation

- **Testing:** Jest
 
---
 
 
## 🚀 Getting Started
 
### 1️⃣ Clone the Repository
 
```bash

git https://github.com/Aditya-kumar-sah/Okr_Backend_GoalZilla


```
 
---
 
### 2️⃣ Install Dependencies
 
```bash

pnpm install

```
 
---
 
### 3️⃣ Configure Environment Variables
 
Create a `.env` file in the root directory:
 
```bash

cp .env.example .env

```
 
Update the `DATABASE_URL` inside `.env`:
 
```

DATABASE_URL="postgresql://username:password@localhost:5432/okr_db?schema=public"

```
 
 
---
 
### 4️⃣ Setup Database
 
There is no need to install PostgreSQL as is we are using docker.
 
 
---
 
### 5️⃣ Run Prisma Migrations
 
Generate Prisma Client:
 
```bash

npx prisma generate

```
 
Run migrations:
 
```bash

npx prisma migrate dev

```
 
If migrations are not present, push schema:
 
```bash

npx prisma db push

```
 
---
 
### 6️⃣ Run the Application
 
Development mode:
 
```bash

pnpm run start:dev

```
 
Production mode:
 
```bash

pnpm run build

pnpm run start:prod

```
 
The server will start at:
 
```
http://localhost:3002

```
 
---
 
## 🧪 Running Tests
 
Run unit tests:
 
```bash

pnpm test

```
 
Run tests in watch mode:
 
```bash

pnpm run test:watch

```
 
Run E2E tests:
 
```bash

pnpm run test:e2e

```
 
---
 
## 📜 Available Scripts
 
- `pnpm run start` — Start application

- `pnpm run start:dev` — Start in development mode

- `pnpm run build` — Compile TypeScript

- `pnpm run format` — Format code

- `pnpm test` — Run tests
 
---
 
## 📌 Environment Variables
 
Required:
 
```

DATABASE_URL=<PostgreSQL connection string>

```
 
---
 
## 🤝 Contributing
 
1. Fork the repository

2. Create a feature branch  

   ```bash

   git checkout -b feature/your-feature-name

   ```

3. Commit changes  

   ```bash

   git commit -m "Add feature"

   ```

4. Push to branch  

   ```bash

   git push origin feature/your-feature-name

   ```

5. Open a Pull Request
 
---
 
## 📄 License
 
This project is for educational purposes.

 