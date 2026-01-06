# SubSentry Server

A robust Node.js/Express backend API for subscription management with MongoDB integration.

## Features

### 🔧 Core API Features
- **RESTful Architecture**: Clean, predictable API endpoints
- **Advanced Filtering**: Multi-field filtering with query builders
- **Pagination**: Efficient data loading with metadata
- **Sorting**: Flexible sorting by multiple fields
- **Search**: Text search across subscription names
- **Data Validation**: Comprehensive input validation with Mongoose
- **Error Handling**: Structured error responses with proper HTTP status codes

### 📊 Data Management
- **MongoDB Integration**: Mongoose ODM with optimized schemas
- **Indexing**: Performance-optimized database indexes
- **Aggregation**: Complex data processing with MongoDB pipelines
- **Statistics**: Real-time analytics and summary calculations
- **Data Integrity**: Validation rules and constraints

### 🛡️ Security & Performance
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Secure configuration management
- **Input Sanitization**: Protection against injection attacks
- **Response Optimization**: Efficient data serialization
- **Connection Pooling**: Optimized database connections

## API Endpoints

### Subscriptions

#### GET /api/subscriptions
Retrieve user subscriptions with advanced filtering and pagination.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (renewalDate, amount, name, createdAt, status)
- `sortOrder` (string): Sort direction (asc, desc)
- `status` (string): Filter by status (active, paused, cancelled)
- `category` (string): Filter by category
- `isTrial` (boolean): Filter by trial status
- `renewalFrom` (date): Filter renewals from date
- `renewalTo` (date): Filter renewals to date
- `search` (string): Text search in subscription names
- `includeSummary` (boolean): Include statistics summary

**Response:**
```json
{
  "success": true,
  "message": "Subscriptions retrieved successfully.",
  "data": {
    "subscriptions": [...],
    "summary": {
      "totalSubscriptions": 6,
      "activeCount": 4,
      "pausedCount": 1,
      "cancelledCount": 0,
      "trialCount": 1,
      "totalMonthlySpend": 90.97,
      "totalYearlySpend": 1091.64
    }
  },
  "meta": {
    "pagination": {
      "currentPage": 1,
      "itemsPerPage": 10,
      "totalItems": 6,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "status": null,
      "category": null,
      "search": null
    }
  }
}
```

#### GET /api/subscriptions/:id
Retrieve a specific subscription by ID.

#### GET /api/test/subscriptions
Demo endpoint with mock data for testing and development.

### Health Check

#### GET /health
Server health status endpoint.

#### GET /
API information and status.

## Data Models

### Subscription Schema
```javascript
{
  userId: String,           // User identifier
  name: String,            // Subscription name
  amount: Number,          // Cost amount
  currency: String,        // Currency code (default: USD)
  billingCycle: String,    // weekly, monthly, yearly, custom
  category: String,        // entertainment, music, education, etc.
  renewalDate: Date,       // Next renewal date
  isTrial: Boolean,        // Trial subscription flag
  trialEndsAt: Date,       // Trial end date
  source: String,          // manual, gmail, imported
  status: String,          // active, paused, cancelled
  description: String,     // Optional description
  createdAt: Date,         // Creation timestamp
  updatedAt: Date          // Last update timestamp
}
```

### Validation Rules
- **Name**: Required, max 100 characters
- **Amount**: Required, non-negative number
- **Currency**: 3-character code, uppercase
- **Billing Cycle**: Enum validation
- **Category**: Enum validation with default
- **Renewal Date**: Required, valid date
- **Description**: Optional, max 500 characters

## Database Indexes

Performance-optimized indexes for common queries:
- `{ userId: 1, status: 1 }` - User subscriptions by status
- `{ userId: 1, renewalDate: 1 }` - Renewal date queries
- `{ userId: 1, category: 1 }` - Category filtering

## Environment Configuration

### Required Variables
```env
MONGO_URI=mongodb://localhost:27017/subsentry
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Optional Variables
```env
DB_NAME=subsentry
MAX_POOL_SIZE=10
```

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start production server**
   ```bash
   npm start
   ```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

### Code Structure
```
src/
├── controllers/        # Request handlers
│   └── subscription.controller.js
├── models/            # Mongoose schemas
│   └── Subscription.js
├── routes/            # Express routes
│   └── subscription.routes.js
├── middleware/        # Custom middleware
│   └── requireAuth.js
├── utils/             # Helper functions
│   ├── responseBuilder.js
│   └── queryBuilder.js
├── constants/         # Application constants
│   ├── http.constants.js
│   └── subscription.constants.js
├── config/            # Configuration
│   └── db.js
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details (development only)"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Performance Considerations

### Database Optimization
- Proper indexing for common queries
- Aggregation pipelines for complex operations
- Connection pooling for concurrent requests
- Lean queries for better performance

### Response Optimization
- Pagination to limit data transfer
- Field selection to reduce payload size
- Compression for large responses
- Caching for frequently accessed data

## Security Features

### Input Validation
- Mongoose schema validation
- Custom validation rules
- Sanitization of user inputs
- Type checking and constraints

### CORS Configuration
- Configurable allowed origins
- Credential support
- Preflight request handling

### Error Sanitization
- Safe error messages in production
- Detailed errors in development
- No sensitive data exposure

## Testing

### Test Categories
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- Database tests for model operations
- Error handling tests

### Running Tests
```bash
npm test                # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch     # Watch mode
```

## Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set secure CORS origins
- [ ] Enable request logging
- [ ] Configure error monitoring
- [ ] Set up health checks
- [ ] Configure SSL/TLS

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGO_URI=mongodb+srv://...
PORT=5000
CLIENT_URL=https://your-domain.com
```

## Monitoring & Logging

### Health Monitoring
- `/health` endpoint for load balancer checks
- Database connection status
- Memory and CPU usage tracking
- Response time monitoring

### Error Logging
- Structured error logging
- Request/response logging
- Database query logging
- Performance metrics

## Contributing

1. Follow existing code patterns and conventions
2. Add comprehensive error handling
3. Include input validation for new endpoints
4. Update documentation for API changes
5. Add tests for new functionality
6. Follow RESTful API principles

## License

This project is part of the SubSentry application suite.