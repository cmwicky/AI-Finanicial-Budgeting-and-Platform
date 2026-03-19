# FinAI - AI Financial Budgeting Platform

A comprehensive financial management platform with AI-powered insights and budgeting tools.

## Features

- **Expense Tracking**: Log and categorize your expenses
- **Budget Management**: Create monthly budgets with category limits
- **AI Insights**: Get personalized financial recommendations
- **AI Financial Assistant**: Interactive chat-based financial guidance
- **Visual Analytics**: Charts and graphs for expense analysis
- **Savings Goals**: Track progress toward financial goals
- **Proactive Alerts**: AI-powered financial notifications and warnings

## Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy
- **Frontend**: HTML, CSS, JavaScript with Chart.js
- **AI**: OpenAI API integration

## Setup Instructions

### Prerequisites

- Python 3.11+
- PostgreSQL database
- OpenAI API key (for AI features)

### Backend Setup

1. **Clone and navigate to the project**:
   ```bash
   cd /path/to/gdg
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlalchemy alembic asyncpg redis celery bcrypt python-jose reportlab pydantic-settings python-multipart httpx hypothesis pytest pytest-asyncio
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/finai
   SECRET_KEY=your-secret-key-here
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **Run database migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

The frontend files are already created in the root directory:
- `index.html` - Main dashboard
- `portfolio.html` - Portfolio view
- `insights.html` - AI recommendations
- `analysis.html` - Visual analytics
- `transactions.html` - Transaction history
- `settings.html` - User settings
- `styles.css` - Styling
- `script.js` - Frontend logic

To serve the frontend, you can:
1. Open the HTML files directly in a browser (for local testing)
2. Use a simple HTTP server:
   ```bash
   python -m http.server 3000
   ```
3. Or deploy to a web server

## API Endpoints

### Expenses
- `GET /api/v1/expenses?user_id={id}` - List user expenses
- `POST /api/v1/expenses` - Create expense
- `GET /api/v1/expenses/{id}` - Get expense
- `PUT /api/v1/expenses/{id}` - Update expense
- `DELETE /api/v1/expenses/{id}` - Delete expense

### Budgets
- `GET /api/v1/budgets?user_id={id}` - List user budgets
- `POST /api/v1/budgets` - Create budget
- `GET /api/v1/budgets/{id}` - Get budget
- `GET /api/v1/budgets/{id}/category-limits` - Get budget category limits
- `PUT /api/v1/budgets/{id}` - Update budget
- `DELETE /api/v1/budgets/{id}` - Delete budget

### AI Advisor
- `GET /api/v1/ai-advisor/{user_id}/recommendations?budget_id={id}` - Get AI recommendations

### AI Agent
- `POST /api/v1/ai-agent/chat` - Send message to AI financial assistant
- `GET /api/v1/ai-agent/status` - Get AI agent status
- `POST /api/v1/ai-agent/{user_id}/analyze-portfolio` - Get portfolio analysis
- `POST /api/v1/ai-agent/{user_id}/financial-alerts` - Get financial alerts

### Categories
- `GET /api/v1/categories` - List all categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/{id}` - Get category
- `PUT /api/v1/categories/{id}` - Update category
- `DELETE /api/v1/categories/{id}` - Delete category

### Savings Goals
- `GET /api/v1/savings-goals?user_id={id}` - List user savings goals
- `POST /api/v1/savings-goals` - Create savings goal
- `GET /api/v1/savings-goals/{id}` - Get savings goal
- `PUT /api/v1/savings-goals/{id}` - Update savings goal
- `DELETE /api/v1/savings-goals/{id}` - Delete savings goal

### Reports
- `GET /api/v1/reports/{budget_id}` - Generate budget report

## Development

### Running Tests
```bash
pytest
```

### API Documentation
When the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Database Schema
The application uses the following main models:
- User: User accounts
- Budget: Monthly budgets
- BudgetCategory: Expense categories
- BudgetCategoryLimit: Spending limits per category
- Expense: Individual expenses
- SavingsGoal: Financial goals
- Notification: System notifications

## Deployment

1. Set up production database (PostgreSQL)
2. Configure environment variables
3. Run migrations: `alembic upgrade head`
4. Start server: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Serve frontend files via web server (nginx, Apache, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.