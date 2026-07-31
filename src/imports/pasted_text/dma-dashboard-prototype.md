Create a polished desktop web application dashboard for DMA Inc., a wholesale distribution company. The application will eventually serve as a modern interface for an older ERP system called Oak Street, but this prototype should use sample data only and should not reference any live integration.

The dashboard should feel modern, professional, modular, and operationally focused. Use a visual style inspired by Stripe Dashboard, Shopify Admin, Salesforce, and modern inventory-management software, but keep the interface simpler and easier to scan.

## Primary Goal

Design a role-based dashboard that changes which information is shown first depending on who is logged in.

The interface should be built from reusable dashboard widgets that can be:

* Reordered
* Resized
* Hidden
* Filtered
* Refreshed
* Expanded into a detailed view
* Saved as a personal dashboard layout

Create multiple role views using the same design system and components.

## Application Layout

Use a desktop-first layout with a fixed left navigation sidebar, a top header, and a flexible 12-column dashboard grid.

### Left Sidebar

Include the DMA logo area at the top and the following navigation:

* Dashboard
* Customers
* Orders
* Products
* Inventory
* Purchasing
* Reports
* Activity
* Settings

Use simple line icons and clear active-state styling.

At the bottom of the sidebar, include:

* Help
* User profile
* Sign out

### Top Header

Include:

* Global search
* Current role or department
* Notifications
* Quick-create button
* User profile menu

The quick-create button should open options for:

* New Order
* New Customer
* Add Product
* Receive Inventory
* Create Task

## Dashboard Header

Display:

“Good morning, Obie”

Add a short supporting line:

“Here is what needs your attention today.”

Include:

* Date range selector
* Role-view selector
* Customize Dashboard button
* Create Order button

For prototype purposes, the role selector should include:

* Owner
* Sales
* Warehouse
* Marketing

## Modular Widget System

Design widgets using four standard sizes:

* Small: 3 columns
* Medium: 4 columns
* Large: 6 columns
* Full width: 12 columns

Each widget should include:

* Widget title
* Optional subtitle
* Filter or date control
* More-options menu
* View-details action
* Loading state
* Empty state
* Error state

Widgets should use rounded corners, light shadows, subtle borders, and clear spacing.

## Owner Dashboard

Create the primary screen as the Owner dashboard.

The Owner dashboard should answer:

“What is happening across the company, and what needs my attention?”

Include the following widgets:

### Today’s Priorities

Large priority widget showing:

* 3 dealer applications awaiting FFL documents
* 7 orders currently on hold
* 2 overdue invoices
* Inventory count needed for XTS Phase 1
* Follow up with Fun Guns

Use severity indicators and clear action buttons.

### KPI Cards

Create small cards for:

* Today’s Sales: $18,540
* Open Orders: 42
* Orders on Hold: 7
* Low Inventory Items: 12
* Dealer Applications: 5
* Shipments Today: 18

Include percentage changes or comparisons to the previous period where appropriate.

### Sales Overview

Create a medium or large chart showing:

* Daily sales for the past 30 days
* Current period compared with previous period
* Total sales
* Average order value
* Number of orders

Use a clean line or bar chart with restrained colors.

### Recent Orders

Create a large data-table widget with columns:

* Order Number
* Customer
* Sales Representative
* Status
* Total
* Date
* Priority

Use sample orders such as:

* DMA-10382, Backwoods Sports, $2,140, Processing
* DMA-10381, Fun Guns, $3,420, Awaiting Documents
* DMA-10380, Hart’s Gun & Optics, $1,895, Shipped
* DMA-10379, Creekside, $740, On Hold
* DMA-10378, Lone Star Sporting Goods, $4,260, Picking

Use status badges for:

* Processing
* Waiting
* Picking
* Packed
* Shipped
* On Hold

### Inventory Alerts

Create a medium widget showing:

* XTS ECR 15-inch Handguard, 8 remaining
* XTS Phase 1, backordered
* XTS 1913 Folding Adapter, 5 remaining
* XTS QD Endplate, out of stock

Include urgency indicators and a View Inventory button.

### Dealer Applications

Create a medium widget showing:

* Fun Guns, awaiting FFL
* 2A Outfitters, approved
* Lone Star Armory, needs EIN
* Red River Tactical, under review

Include status badges and quick actions.

### Top Customers

Show:

* Customer name
* Sales total
* Number of orders
* Trend
* Last order date

### Product Performance

Show top-selling products with:

* Product name
* SKU
* Units sold
* Revenue
* Stock status

### Recent Activity

Create an audit-feed widget using examples such as:

* Elissa created Order DMA-10382
* Michael updated XTS-501 product information
* Matt approved a dealer application
* Inventory quantity changed for XTS Phase 1
* Product pricing was imported

Include timestamps and user avatars.

## Sales Dashboard Variant

Create a second dashboard using the same components but reorganized for a Sales role.

Prioritize:

* Create Order
* Assigned Customers
* Recent Orders
* Customers Requiring Follow-Up
* Dealer Applications
* Missing FFL or EIN Documents
* Overdue Customer Balances
* Draft Orders
* Recent Customer Activity
* Personal Sales Performance

The main question this dashboard should answer is:

“Which customers and orders need action today?”

## Warehouse Dashboard Variant

Create a third dashboard optimized for warehouse and shipping staff.

Prioritize:

* Orders Ready to Pick
* Orders Ready to Pack
* Shipments Due Today
* Backorders
* Inventory Shortages
* Incoming Inventory
* Recently Printed Labels
* Priority Orders
* Inventory Discrepancies
* Order Fulfillment Activity

The main question this dashboard should answer is:

“What needs to leave the building next?”

Do not show financial information such as customer balances, company revenue, or account-level financial totals on the warehouse dashboard.

## Marketing Dashboard Variant

Create a fourth dashboard optimized for product, website, and marketing work.

Prioritize:

* New Product Records
* Missing Product Images
* Missing Product Descriptions
* Recently Updated Products
* Product Performance
* Dealer Signups
* Low-Stock Products Currently Being Advertised
* Website Order Activity
* Content Tasks
* Product Data Quality Issues

The main question this dashboard should answer is:

“What product, website, or marketing information needs attention?”

## Customize Dashboard Mode

Create a separate edit mode where users can personalize their dashboard.

Include:

* Drag-and-drop widgets
* Resize handles
* Add Widget panel
* Hide Widget option
* Reset to Role Default
* Save Layout button
* Cancel button

The Add Widget panel should group widgets into:

* Performance
* Orders
* Customers
* Inventory
* Tasks
* Activity

Clearly communicate that users may only add widgets permitted for their role.

## Permissions Concept

The design should visually distinguish between:

* Role-based permissions
* Default role layout
* Personal widget arrangement

Do not imply that hiding a widget removes access permissions. Include a small informational note in dashboard settings explaining that dashboard customization only changes layout and does not change account permissions.

## Visual Style

Use a light theme with:

* White and soft-gray content areas
* Dark navy or charcoal sidebar
* DMA red as the primary accent
* Green for completed or healthy
* Amber for warnings
* Red for blocked, overdue, or urgent
* Blue for active or processing
* Purple for packed or staged orders

Use Inter as the main typeface.

Use:

* Rounded 10 to 12 pixel cards
* Soft shadows
* Subtle gray borders
* Generous spacing
* Dense but readable tables
* Clear hover and selected states
* Accessible contrast
* Responsive behavior for smaller desktop and tablet widths

Avoid oversized typography, excessive gradients, glassmorphism, or decorative effects that reduce readability.

## Components to Create

Build reusable components for:

* Sidebar navigation items
* Header controls
* Buttons
* Icon buttons
* Search field
* Dropdowns
* Date filters
* KPI cards
* Dashboard widgets
* Data tables
* Status badges
* User avatars
* Tabs
* Modals
* Toast notifications
* Empty states
* Loading skeletons
* Error messages
* Pagination
* Charts
* Activity feed items
* Priority list items

## Prototype Interactions

Add prototype interactions for:

* Switching between Owner, Sales, Warehouse, and Marketing dashboards
* Opening Customize Dashboard mode
* Moving or resizing widgets
* Opening a widget detail view
* Opening the New Order menu
* Expanding recent orders
* Viewing inventory alerts
* Opening dealer application details
* Saving and resetting a dashboard layout

The final result should feel like a realistic internal operations platform that DMA employees could eventually use as a modern layer over Oak Street.
