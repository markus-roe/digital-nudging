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

## Experiment Tasks

### Task 1: Delivery Details Validation
In this task, participants must review and validate delivery details before orders are processed. Each order represents a task case that needs validation, with participants identifying and correcting errors in the order data.

**The task measures (per task case and aggregated):**
- Error rate
- Validation completion time

**The nudged interface (Version B) includes:**
- Highlighting of incorrect order data

### Task 2: Order-Driver Assignment
In this task, participants must assign orders to delivery drivers based on priority level (High, Medium, Low).

**The task measures (per task case and aggregated):**
- Time to complete assignments
- Sequence errors (assigning lower priority task cases before higher priority ones)
- Zone matching errors (order was assigned to the wrong delivery zone)

**The nudged interface (Version B) includes:**
- Color-coding for priority levels (the primary digital nudge being tested)

### Task 3: Delivery Scheduling
In this task, participants must schedule delivery time slots for orders, with each scheduling decision representing a task case.

**The task measures (per task case and aggregated):**
- Time to complete scheduling decisions
- Optimization efficiency

**Version A (Control – No Nudge):**
- Time slots availability is displayed in the text format "X/5 slots available"
- No visual guidance or support is provided

**Version B (Nudged – Progress Indicator Nudge):**
- Time slot availability is displayed using a progress bar
- The progress bar gives immediate visual feedback on how full each time slot is



### Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other configuration
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Data Collection

The experiment collects data through:
- Action logging (user interactions)
- Error logging (validation and assignment errors)
- Questionnaire responses (NASA-TLX, SUS, confidence ratings)

All data is stored in the database and can be exported for analysis.