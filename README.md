# Hono Clean Architecture Starter

A production-ready Hono.js project structured following Clean Architecture principles, inspired by Go-Zero's layered architecture pattern.

## 🏗️ Architecture

This project follows a **Clean Architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│                   Handler Layer                  │  ← HTTP/Transport
│            (Handles HTTP requests/responses)     │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                   Logic Layer                    │  ← Business Logic
│         (Core business rules and validation)     │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                   Model Layer                    │  ← Data Access
│              (Database operations)               │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│              Service Context (Svc)               │  ← DI Container
│         (Manages dependencies and config)        │
└─────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
hono-app/
├── src/
│   ├── config/              # Configuration management
│   │   └── config.ts        # App configuration and env variables
│   ├── handler/             # HTTP request handlers (Controllers)
│   │   ├── user.handler.ts  # User-related endpoints
│   │   └── health.handler.ts # Health check endpoint
│   ├── logic/               # Business logic layer
│   │   └── user.logic.ts    # User business logic
│   ├── model/               # Data access layer
│   │   └── user.model.ts    # User data operations
│   ├── svc/                 # Service context (DI container)
│   │   └── service-context.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── middleware/          # Express/Hono middleware
│   │   └── error.middleware.ts
│   ├── routes/              # Route definitions
│   │   └── index.ts
│   └── index.ts             # Application entry point
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hono-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:3000`

### Build for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production build
npm start
```

## 📚 Layer Responsibilities

### **Handler Layer** (`src/handler/`)
- Receives HTTP requests
- Validates request format
- Calls appropriate Logic methods
- Returns HTTP responses
- **Should NOT contain business logic**

### **Logic Layer** (`src/logic/`)
- Contains all business rules
- Validates business constraints
- Orchestrates operations across models
- Independent of HTTP/transport layer
- Easily testable without mocking HTTP

### **Model Layer** (`src/model/`)
- Direct database/data source access
- CRUD operations only
- No business logic
- Returns raw data

### **Service Context** (`src/svc/`)
- Dependency injection container
- Holds all service dependencies (models, config, external services)
- Makes testing easier by allowing dependency swapping

## 🔌 API Endpoints

### Health Check
```bash
GET /health
```

### User Management

**Create User**
```bash
POST /api/users
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Get All Users**
```bash
GET /api/users
```

**Get User by ID**
```bash
GET /api/users/:id
```

**Delete User**
```bash
DELETE /api/users/:id
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Add your test script
npm test
```

### Example: Testing Logic Layer

```typescript
import { UserLogic } from './logic/user.logic';
import { ServiceContext } from './svc/service-context';
import { config } from './config/config';

// Easy to test without HTTP mocking!
const svcCtx = new ServiceContext(config);
const userLogic = new UserLogic(svcCtx);

const result = await userLogic.createUser({
  username: 'test',
  email: 'test@test.com',
  password: 'pass'
});

console.assert(result.success === true);
```

## 🛠️ Development Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm start          # Run production build
npm run type-check # Check TypeScript types
```

## 🔧 Configuration

Configuration is managed through environment variables in `.env`:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp

JWT_SECRET=your-secret-key-change-this
```

## 📦 Adding New Features

### 1. Add a new entity (e.g., "Product")

**Model** (`src/model/product.model.ts`)
```typescript
export class ProductModel {
  async findById(id: string): Promise<Product | null> { }
  async create(data: CreateProductData): Promise<Product> { }
}
```

**Logic** (`src/logic/product.logic.ts`)
```typescript
export class ProductLogic {
  constructor(private ctx: ServiceContext) {}
  
  async createProduct(req: CreateProductRequest): Promise<ApiResponse<Product>> {
    // Business logic here
  }
}
```

**Handler** (`src/handler/product.handler.ts`)
```typescript
export class ProductHandler {
  private logic: ProductLogic;
  
  constructor(svcCtx: ServiceContext) {
    this.logic = new ProductLogic(svcCtx);
  }
  
  async create(c: Context) {
    const body = await c.req.json();
    const result = await this.logic.createProduct(body);
    return c.json(result);
  }
}
```

**Register Routes** (`src/routes/index.ts`)
```typescript
const productHandler = new ProductHandler(svcCtx);
app.post('/api/products', (c) => productHandler.create(c));
```

## 🎯 Design Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Dependency Inversion**: Logic depends on abstractions, not implementations
3. **Testability**: Business logic can be tested without HTTP mocking
4. **Maintainability**: Clear structure makes code easy to navigate and modify
5. **Scalability**: Easy to add new features without affecting existing code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT

## 🙏 Acknowledgments

- Inspired by [Go-Zero](https://go-zero.dev/) architecture
- Built with [Hono](https://hono.dev/) - Ultrafast web framework
- Follows [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) principles

---

**Happy Coding!** 🚀
