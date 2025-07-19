# Persian Accounting System - سیستم حسابداری فارسی

## Project Overview
Advanced Persian-language accounting and inventory management system designed specifically for box manufacturing businesses. The system provides comprehensive financial tracking, production monitoring, and business intelligence with full RTL (Right-to-Left) support.

## Key Features
- **Multi-language Support**: Full Persian (Farsi) interface with RTL layout
- **Customer Management**: Complete customer profiles with credit limits and balances
- **Product Management**: Box specifications with dimensions, materials, and inventory tracking
- **Order Management**: From order creation to completion with status tracking
- **Invoice Management**: Comprehensive billing system with payment tracking
- **Financial Reporting**: Sales reports, financial analysis, and business intelligence
- **Inventory Control**: Stock management with low-stock alerts
- **Persian Calendar**: Jalali date support throughout the system

## Technology Stack
- **Backend**: Flask 3.0+ with Python 3.11
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Frontend**: Bootstrap 5.1.3 RTL with Persian fonts
- **Authentication**: Flask-Login for user management
- **Date Handling**: jdatetime for Persian calendar support
- **UI Components**: Font Awesome icons, Chart.js for analytics

## Project Architecture

### Database Models
- **User**: System users with role-based access
- **Customer**: Client information with financial tracking
- **Supplier**: Vendor management for procurement
- **Product**: Box specifications and inventory
- **Order**: Sales order management with items
- **Invoice**: Billing and payment tracking
- **Payment**: Financial transaction records
- **StockMovement**: Inventory change tracking
- **FinancialAccount**: Chart of accounts
- **JournalEntry**: Double-entry bookkeeping
- **Transaction**: Financial transaction details

### Key Routes
- **Authentication**: `/login`, `/logout`
- **Dashboard**: `/dashboard` - Main overview with statistics
- **Customers**: `/customers` - Customer management CRUD
- **Products**: `/products` - Product and inventory management
- **Orders**: `/orders` - Order processing and tracking
- **Invoices**: `/invoices` - Billing and payment management
- **Reports**: `/reports` - Financial and operational reports

### UI Design
- **Persian Interface**: Complete RTL support with Persian typography
- **Responsive Design**: Bootstrap-based responsive layout
- **Modern Styling**: Gradient backgrounds, rounded corners, smooth animations
- **Professional Theme**: Blue/purple color scheme suitable for business use
- **Accessibility**: Clear navigation, proper contrast, readable fonts

## Current State
✅ **Completed Features:**
- Database models and relationships
- User authentication system
- Complete customer management (list, add, edit)
- Product management with box specifications
- Order creation and management
- Invoice listing and filtering
- Dashboard with key metrics and charts
- Sales reporting with date filtering
- Persian calendar integration
- Responsive RTL interface

🔄 **In Progress:**
- Full order processing workflow
- Invoice creation from orders
- Payment processing
- Advanced reporting features

📋 **Pending Features:**
- Supplier management
- Purchase order system
- Advanced inventory management
- Financial accounting modules
- Tax calculations and reports
- Production tracking
- Backup and restore functionality

## User Preferences
- **Language**: Persian (Farsi) interface
- **Design**: Professional business appearance with gradients
- **Functionality**: Focus on box manufacturing industry needs
- **Data**: Authentic business data with proper financial tracking

## Recent Changes
- **2025-01-18**: Initial system setup with comprehensive models
- **2025-01-18**: Created Persian UI templates with RTL support
- **2025-01-18**: Implemented customer and product management
- **2025-01-18**: Added order management with dynamic item creation
- **2025-01-18**: Built dashboard with real-time statistics
- **2025-01-18**: Integrated Persian calendar (jdatetime) support
- **2025-01-18**: ✅ MAJOR UPDATE: Removed credit limit restrictions, added complete view/delete functionality for customers and products, implemented dark mode, enhanced navigation with financial reports and payment modules, fixed all broken sections
- **2025-07-18**: ✅ CRITICAL FIX: Resolved CSRF token issue across all forms - login, customer management, product management, orders, and settings forms now work properly
- **2025-07-18**: ✅ MAJOR ENHANCEMENT: Implemented complete role-based access control (Admin vs Accountant), removed all Gregorian dates (Persian-only), fixed all broken sections (settings, reports, financial management, backup), added edit/delete functionality throughout, restructured navigation from dropdowns to direct links, created comprehensive admin panel, financial management modules, and all report sections
- **2025-07-18**: ✅ PERSIAN DATE PICKER ENHANCEMENT: Implemented modern MD Bootstrap Persian DateTime Picker with comprehensive Iranian holiday support, including Nowruz, national holidays, and religious observances. Added automatic Persian date display in headers, calendar icons, RTL support, and seamless Persian-to-Gregorian conversion for all date inputs throughout the system
- **2025-07-18**: ✅ CRITICAL JAVASCRIPT FIX: Resolved "Unexpected end of input" JavaScript errors across all website sections by removing duplicate script blocks in templates/customers/list.html. All website sections now function properly with correct JavaScript syntax and no console errors

## Setup and Installation
1. **Dependencies**: All required packages listed in pyproject.toml
2. **Database**: PostgreSQL with automatic table creation
3. **Initial Data**: Run `/init-data` route to create admin user and sample data
4. **Admin Access**: Username: `admin`, Password: `admin123`

## Next Steps
1. Complete order to invoice workflow
2. Implement payment processing
3. Add advanced reporting features
4. Enhance inventory management
5. Add production tracking modules

The system is designed to be a complete business management solution for box manufacturing companies, with emphasis on Persian language support and industry-specific features.