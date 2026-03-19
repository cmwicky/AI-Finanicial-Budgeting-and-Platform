#!/usr/bin/env python3
"""
Sample data creation script for FinAI.
Adds sample users, budgets, expenses, and savings goals for testing.
"""

import asyncio
from datetime import date, datetime, timedelta
from app.core.database import get_db
from app.services.expense_service import ExpenseService
from app.services.budget_service import BudgetService
from app.services.savings_goal_service import SavingsGoalService
from app.services.category_service import CategoryService
from app.models.user import User
from sqlalchemy import select


async def create_sample_data():
    """Create sample data for testing the application."""
    print("🔄 Creating sample data...")

    async for db in get_db():
        try:
            # Create sample user
            user_id = 1

            # Check if user already exists
            result = await db.execute(select(User).where(User.id == user_id))
            existing_user = result.scalar_one_or_none()

            if existing_user:
                print(f"✅ User {user_id} already exists")
                user = existing_user
            else:
                # Create new user
                user = User(
                    id=user_id,
                    email="demo@finai.com",
                    hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU2jG",  # "password"
                    is_verified=True,
                    salary=3000.0  # Monthly salary for budget creation
                )
                db.add(user)
                await db.flush()
                print(f"✅ Created user: {user.email} with salary ${user.salary}")

            # Get categories
            category_service = CategoryService()
            categories = await category_service.list_categories(db)
            category_map = {cat.name: cat.id for cat in categories}

            # Create a sample budget
            budget_service = BudgetService()
            budget = await budget_service.create_monthly_budget(
                user_id=user_id,
                month="2024-03",
                db=db
            )
            print(f"✅ Created budget: {budget.month} with salary ${budget.salary_snapshot}")

            # Set category limits for the budget
            await budget_service.assign_category_limit(budget.id, category_map["Housing"], 1200.0, db)
            await budget_service.assign_category_limit(budget.id, category_map["Food"], 400.0, db)
            await budget_service.assign_category_limit(budget.id, category_map["Transport"], 300.0, db)
            await budget_service.assign_category_limit(budget.id, category_map["Entertainment"], 200.0, db)
            await budget_service.assign_category_limit(budget.id, category_map["Savings"], 500.0, db)
            print("✅ Set category limits for budget")

            # Create sample expenses
            expense_service = ExpenseService()
            today = date.today()

            # Housing expenses
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Housing"],
                amount=1200.0,
                expense_date=today.replace(day=1),
                description="Monthly rent",
                db=db
            )

            # Food expenses
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Food"],
                amount=85.50,
                expense_date=today - timedelta(days=2),
                description="Grocery shopping",
                db=db
            )
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Food"],
                amount=45.20,
                expense_date=today - timedelta(days=7),
                description="Restaurant dinner",
                db=db
            )

            # Transport expenses
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Transport"],
                amount=120.0,
                expense_date=today - timedelta(days=3),
                description="Gas fill-up",
                db=db
            )
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Transport"],
                amount=25.0,
                expense_date=today - timedelta(days=10),
                description="Uber ride",
                db=db
            )

            # Entertainment expenses
            await expense_service.add(
                user_id=user_id,
                category_id=category_map["Entertainment"],
                amount=75.0,
                expense_date=today - timedelta(days=5),
                description="Movie tickets",
                db=db
            )

            print("✅ Created sample expenses")

            # Create savings goals
            savings_service = SavingsGoalService()
            await savings_service.create(
                user_id=user_id,
                name="Emergency Fund",
                target_amount=5000.0,
                target_date=date.today() + timedelta(days=365),
                db=db
            )
            await savings_service.create(
                user_id=user_id,
                name="Vacation",
                target_amount=3000.0,
                target_date=date.today() + timedelta(days=180),
                db=db
            )

            print("✅ Created savings goals")

            # Create expenses for previous months to show trends
            for months_back in range(1, 4):
                expense_date = today - timedelta(days=30 * months_back)
                # Housing
                await expense_service.add(
                    user_id=user_id,
                    category_id=category_map["Housing"],
                    amount=1200.0,
                    expense_date=expense_date.replace(day=1),
                    description=f"Rent - {expense_date.strftime('%B %Y')}",
                    db=db
                )
                # Food (varying amounts)
                food_amount = 120.0 + (months_back * 10)  # Increasing trend
                await expense_service.add(
                    user_id=user_id,
                    category_id=category_map["Food"],
                    amount=food_amount,
                    expense_date=expense_date - timedelta(days=5),
                    description=f"Groceries - {expense_date.strftime('%B %Y')}",
                    db=db
                )

            print("✅ Created historical expense data")

            await db.commit()
            print("🎉 Sample data creation complete!")
            print("\n📊 Sample Data Summary:")
            print(f"   - Budget: March 2024 with $3,000 monthly salary")
            print(f"   - Expenses: ~$2,500 across categories")
            print(f"   - Savings Goals: Emergency Fund ($1,200/$5,000) and Vacation ($800/$3,000)")
            print(f"   - Historical Data: 3 months of expense trends")

        except Exception as e:
            print(f"❌ Error creating sample data: {e}")
            await db.rollback()
            raise
        finally:
            await db.close()


if __name__ == "__main__":
    asyncio.run(create_sample_data())