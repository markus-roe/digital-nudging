# Digital Nudging in ERP Order Delivery Management

## Project Purpose

This project is a bachelor thesis prototype exploring the impact of digital nudging in ERP (Enterprise Resource Planning) order delivery management interfaces. Digital nudging refers to the use of subtle UI design elements that guide user behavior without restricting freedom of choice.

### Research Goals:
- Evaluate whether digital nudging techniques can reduce cognitive effort in ERP interfaces
- Measure improvements in decision-making efficiency and accuracy
- Quantify the impact of specific nudging elements on task performance
- Collect empirical data on user experience with and without nudging interventions

The experiment implements A/B testing methodology:
- **Version A (Control)**: Standard ERP interface without digital nudging
- **Version B (Treatment)**: Same interface with digital nudging techniques applied

Key metrics tracked include:
- Task completion time (efficiency)
- Error rates (accuracy)
- Decision hesitation time (cognitive effort)
- NASA-TLX scores (perceived workload)
- SUS scores (usability perception)
- Decision confidence ratings (user confidence)

## Project Structure

This project follows the Next.js 15 App Router architecture with Prisma ORM for database management.

📦 digital-nudging-erp
├── 📂 app/ → Next.js App Router (Server Components & Routes)
│ ├── 📂 [taskId]/ → Dynamic task routes
│ │ ├── 📂 [version]/ → Dynamic version routes (a or b)
│ │ │ ├── page.tsx → Handles all task/version combinations
│ ├── 📂 api/ → API Routes (Server actions)
│ │ ├── 📂 participants/ → Participant registration and management
│ │ │ ├── 📂 register/ → Handles participant registration and version assignment
│ │ ├── 📂 tracking/ → Logs task performance data
│ ├── 📂 register/ → Participant registration page
│ ├── 📂 components/ → Shared UI Components (Client Components)
│ │ ├── 📂 router/ → Routing components
│ │ │ ├── RouteValidator.tsx → Validates and handles errors for routes
│ │ │ ├── TaskRouter.tsx → Routes to specific task components
│ │ ├── 📂 experiment/ → Experiment-specific components
│ │ │ ├── 📂 shared/ → Shared experiment components
│ │ │ ├── 📂 tasks/ → Task-specific components
│ │ │ │ ├── 📂 order-assignment/ → Order Assignment Task components
│ │ │ │ ├── 📂 task-2/ → Task 2 components
│ │ │ │ ├── 📂 task-3/ → Task 3 components
│ │ ├── 📂 ui/ → Reusable UI elements
│ ├── globals.css → Global styles
│ ├── layout.tsx → Root layout (server component)
│ ├── page.tsx → Main landing page (server component)
│
├── 📂 lib/ → Utility functions and helpers
│ ├── 📂 hooks/ → Custom React Hooks
│ │ ├── useParticipantTracking.ts → Hook for tracking participant interactions
│ ├── 📂 types/ → TypeScript type definitions
│ ├── 📂 data/ → Data utilities
│ ├── 📂 utils/ → General utilities
│
├── 📂 prisma/ → Prisma Database Configuration
│ ├── schema.prisma → Database schema definition
│ ├── migrations/ → Migration files
│
├── 📂 public/ → Static assets
│
├── 📂 logs/ → Tracking data logs (JSON files)
│
├── tsconfig.json → TypeScript Configuration
├── README.md → Project Documentation

## Experiment Structure

The experiment is designed to test the impact of digital nudging on task performance. It includes:

- **Multiple Tasks**: Different tasks to test various nudging techniques
- **A/B Testing**: Each task has two versions:
  - **Version A**: Control interface (no digital nudging)
  - **Version B**: Nudged interface (includes nudging techniques)

## Tasks

### Task 1: Order-Driver Assignment

In this task, participants must assign delivery drivers to pending orders based on priority level (High, Medium, Low).

The task measures:
- Time to complete all assignments
- Sequence errors (assigning lower priority orders before higher priority ones)
- Zone matching efficiency (how often participants match drivers to their optimal zones)

The nudged interface (Version B) includes:
- Color-coding for priority levels (the primary digital nudge being tested)

### Task 2 & Task 3

These tasks are under development and will test additional nudging techniques.

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding New Tasks

To add a new task:

1. Create a new folder in `app/components/experiment/tasks/`
2. Add the task components
3. Update the `ExperimentTask` type in `lib/types/experiment.ts`
4. Add the task to the `ExperimentTaskRouter`
5. Update the task list in the experiment selection page

## URL Structure

The application uses a RESTful URL structure with dynamic routes:

- `/` - Main landing page
- `/register` - Participant registration form
- `/{taskId}/{version}` - Specific task and version
  - Example: `/order-assignment/a` - Order Assignment task, Version A
  - Example: `/task-2/b` - Task 2, Version B

### Routing Architecture

The project uses a layered routing approach:

1. **Dynamic Route Pages** (`app/[taskId]/[version]/page.tsx`)
   - Handles URL parameters and passes them to the RouteValidator
   - Uses React's `use()` function to unwrap Promise-based params (Next.js 15 pattern)

2. **RouteValidator** (`app/components/router/RouteValidator.tsx`)
   - Validates task IDs and versions
   - Handles 404 errors for invalid routes
   - Passes validated parameters to the TaskRouter

3. **TaskRouter** (`app/components/router/TaskRouter.tsx`)
   - Routes to the appropriate task component based on the task ID
   - Provides a central place to add new tasks

This separation of concerns makes the codebase more maintainable and easier to extend.

## Participant Flow

1. Participants visit the main landing page (`/`)
2. They click "Participate in Study" to begin
3. They complete the registration form with:
   - Email (for giveaway participation)
   - Demographic information
4. The system automatically assigns them to version A or B to maintain balanced groups
5. They are redirected to the appropriate task and version
6. After completing the task, they submit their results

## A/B Testing

The system automatically balances participants between versions A and B:

- Version A: Control interface (no digital nudging)
- Version B: Nudged interface (includes nudging techniques)

This ensures that:
- Each version receives an equal number of participants
- Participants cannot choose their version
- The study maintains statistical validity
