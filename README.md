<div align="center">

# 🛒 ShopEase
### E-Commerce Microservices Platform

A production-ready full-stack e-commerce platform built with
Spring Boot Microservices, Spring Cloud, and React.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green?style=flat-square&logo=springboot)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.0.0-green?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=flat-square&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=flat-square&logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

[Live Demo](https://shopease.vercel.app) •
[GitHub](https://github.com/Suraaj8424/shopease) •
[API Docs](#-api-endpoints)

</div>

---

## 🏗️ Architecture

```
React Frontend (Vite — Port 5173)
          ↓
  API Gateway (Port 8080)  ←→  Eureka Server (Port 8761)
          ↓
┌─────────────────────────────────────┐
│  User        Product      Order     │
│  Service     Service      Service   │
│  :8081       :8082        :8083     │
└─────────────────────────────────────┘
          ↓
┌─────────────────────────────────────┐
│  users_db   products_db  orders_db  │
│           (PostgreSQL)              │
└─────────────────────────────────────┘
```

**Request Flow:**
1. React frontend sends all requests to API Gateway (port 8080)
2. API Gateway validates JWT token and routes to correct service
3. Services are discovered via Eureka (no hardcoded URLs)
4. Order Service communicates with Product Service via OpenFeign

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Programming Language |
| Spring Boot | 3.5.0 | Microservices Framework |
| Spring Security | 6.x | Security & Authorization |
| JWT (jjwt) | 0.11.5 | Token-based Authentication |
| Spring Data JPA | 3.5.0 | ORM & Database Access |
| Hibernate | 6.x | JPA Implementation |
| PostgreSQL | 14+ | Relational Database |
| Netflix Eureka | 2025.0.0 | Service Discovery |
| Spring Cloud Gateway | 2025.0.0 | API Gateway |
| OpenFeign | 2025.0.0 | Inter-Service Communication |
| Lombok | Latest | Boilerplate Reduction |
| Maven | 3.8+ | Build Tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI Library |
| Vite | 5.x | Build Tool & Dev Server |
| React Router | v6 | Client-side Routing |
| Axios | Latest | HTTP Client |
| Bootstrap | 5 | UI Styling |
| React Toastify | Latest | Toast Notifications |
| Context API | Built-in | Global State Management |

---

## 📦 Microservices

| Service | Port | Responsibility |
|---|---|---|
| Eureka Server | 8761 | Service Registry & Discovery |
| API Gateway | 8080 | Routing, JWT Validation, CORS |
| User Service | 8081 | Register, Login, JWT Generation |
| Product Service | 8082 | Product CRUD, Search, Pagination |
| Order Service | 8083 | Cart, Orders, Payment Processing |

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT authentication
- ✅ Browse products with search and pagination
- ✅ Product detail page with quantity selector
- ✅ Add to cart / update quantity / remove items
- ✅ Place orders directly from cart
- ✅ View complete order history
- ✅ Dummy payment processing with transaction ID

### ⚙️ Admin Features
- ✅ Secure admin-only dashboard
- ✅ Create / Edit / Delete products
- ✅ Manage product stock and categories
- ✅ Product stats (total, in stock, out of stock)
- ✅ Live product filter by name or category

### 🔧 Technical Features
- ✅ JWT-based stateless authentication
- ✅ Role-based access control (USER / ADMIN)
- ✅ API Gateway as single entry point
- ✅ Service discovery via Netflix Eureka
- ✅ Inter-service calls via OpenFeign
- ✅ Global exception handling across all services
- ✅ Bean validation with proper error responses
- ✅ CORS configured for React frontend
- ✅ BCrypt password hashing
- ✅ Database-per-service pattern (3 separate DBs)

---

## 🗄️ Database Schema

### users_db
- `users` — id, name, email, password (BCrypt), role, created_at

### products_db
- `products` — id, name, description, price, stock, image_url, category

### orders_db
- `cart_items` — id, user_id, product_id, quantity
- `orders` — id, user_id, total_amount, status, created_at
- `order_items` — id, order_id, product_id, product_name, quantity, price
- `payments` — id, order_id, amount, status, transaction_id, paid_at

---

## 🌐 API Endpoints

All requests go through **API Gateway** at `http://localhost:8080`

### 🔐 User Service (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT token |
| GET | `/api/auth/profile` | USER | Get current user profile |

### 🛍️ Product Service (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Get all products (paginated) |
| GET | `/api/products/{id}` | Public | Get product by ID |
| GET | `/api/products/search?keyword=` | Public | Search products |
| POST | `/api/products` | ADMIN | Create new product |
| PUT | `/api/products/{id}` | ADMIN | Update product |
| DELETE | `/api/products/{id}` | ADMIN | Delete product |

### 🛒 Order Service (`/api/cart`, `/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/cart` | USER | View cart |
| POST | `/api/cart/add` | USER | Add item to cart |
| PUT | `/api/cart/{id}` | USER | Update cart item quantity |
| DELETE | `/api/cart/{id}` | USER | Remove item from cart |
| POST | `/api/orders/place` | USER | Place order from cart |
| GET | `/api/orders/my-orders` | USER | Get order history |
| GET | `/api/orders/{id}` | USER | Get order by ID |
| POST | `/api/orders/payment` | USER | Process payment |

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have these installed:
- ☕ Java 17+
- 📦 Node.js 18+
- 🐘 PostgreSQL 14+
- 🔧 Maven 3.8+
- 🐙 Git

### 1. Clone the Repository
```bash
git clone https://github.com/Suraaj8424/shopease.git
cd shopease
```

### 2. Create PostgreSQL Databases
Open pgAdmin or psql and run:
```sql
CREATE DATABASE users_db;
CREATE DATABASE products_db;
CREATE DATABASE orders_db;
```

### 3. Configure Database Credentials
In each Spring Boot service, open `src/main/resources/application.yml`
and update:
```yaml
spring:
  datasource:
    username: YOUR_POSTGRESQL_USERNAME
    password: YOUR_POSTGRESQL_PASSWORD
```

Services to update:
- `user-service/src/main/resources/application.yml`
- `product-service/src/main/resources/application.yml`
- `order-service/src/main/resources/application.yml`

### 4. Start Backend Services (in this exact order)

```bash
# Terminal 1 — Start Eureka Server FIRST
cd eureka-server
./mvnw spring-boot:run

# Terminal 2 — User Service
cd user-service
./mvnw spring-boot:run

# Terminal 3 — Product Service
cd product-service
./mvnw spring-boot:run

# Terminal 4 — Order Service
cd order-service
./mvnw spring-boot:run

# Terminal 5 — API Gateway LAST
cd api-gateway
./mvnw spring-boot:run
```

### 5. Start Frontend

```bash
# Terminal 6
cd ecommerce-frontend
npm install
npm run dev
```

### 6. Access the Application

| URL | Description |
|---|---|
| http://localhost:5173 | 🌐 React Frontend |
| http://localhost:8080 | 🚦 API Gateway |
| http://localhost:8761 | 📋 Eureka Dashboard |

### 7. Create Admin User
Register normally, then run this SQL in pgAdmin:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```
Login again to get a fresh token with ADMIN role.

---

## 📸 Screenshots

### 🏠 Home Page
*(Add screenshot)*

### 🛒 Cart Page
*(Add screenshot)*

### 📦 Order History
*(Add screenshot)*

### ⚙️ Admin Dashboard
*(Add screenshot)*

### 📋 Eureka Dashboard
*(Add screenshot)*

---

## 🔐 Security

- Passwords are hashed using **BCrypt** (never stored as plain text)
- JWT tokens expire after **24 hours**
- All write operations on products require **ADMIN role**
- All order/cart operations require **USER authentication**
- API Gateway validates JWT before forwarding any secured request
- CORS is configured to allow only the frontend origin

---

## 🛣️ Future Improvements

- [ ] Docker + Docker Compose setup
- [ ] Swagger / OpenAPI documentation
- [ ] Redis caching for product catalog
- [ ] Email notifications on order placement
- [ ] Unit tests with JUnit 5 + Mockito
- [ ] GitHub Actions CI/CD pipeline
- [ ] Spring Cloud Config Server
- [ ] Circuit Breaker with Resilience4j

---

## 👤 Author

**Suraaj Navdekar**

[![GitHub](https://img.shields.io/badge/GitHub-Suraaj8424-black?style=flat-square&logo=github)](https://github.com/Suraaj8424)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-suraaj--navdekar-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/suraaj-navdekar)

---

## 📄 License

This project is open source and available under the
[MIT License](LICENSE).

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ☕ Java and ⚛️ React by **Suraaj Navdekar**

</div>