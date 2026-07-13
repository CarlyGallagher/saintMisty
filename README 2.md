# Playwright Test Suite

Welcome to the Playwright test automation project! This document will guide you through setting up your development environment and getting started with running tests.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Writing Tests](#writing-tests)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### 1. Homebrew (macOS/Linux)

If you don't have Homebrew installed, run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify installation:
```bash
brew --version
```

### 2. Bun

Install Bun using Homebrew:

```bash
brew install oven-sh/bun/bun
```

Verify installation:
```bash
bun --version
```

### 3. Node.js

Install Node.js using Homebrew:

```bash
brew install node
```

Verify installation:
```bash
node --version
npm --version
```

## Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone git@github.com:Sim2FundedSolutions/topstepx-qa.git
   cd topstepx-qa
   ```

2. Install dependencies:
   ```bash
   npm install --global yarn
   ```
   then
   ```bash
   yarn install
   ```

   This will install:
   - Playwright and @playwright/test
   - Required browsers for testing
   - Additional dependencies (dotenv, zod)

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Environment Setup

1. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the `.env.local` file with your configuration values.

> **Note:** The `.env.local` file is gitignored and should never be committed to version control as it may contain sensitive information.

## Running Tests

### UI Mode (Recommended for Development)

Run tests in interactive UI mode:

```bash
npm run pw:ui
```

This will open the Playwright Test UI where you can:
- Browse and run individual tests
- See test results in real-time
- Debug tests with time-travel debugging
- View traces and screenshots

### Command Line

Run all tests:
```bash
npx playwright test
```

Run specific test file:
```bash
npx playwright test tests/functional/login.spec.ts
```

Run tests in headed mode (see the browser):
```bash
npx playwright test --headed
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

### View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Project Structure

```
topstepx-qa/
├── .env                    # Environment variables (gitignored)
├── api/                    # API endpoint tests
├── e2e/                    # End-to-end UI tests
├── functional/             # Functional test suites
├── performance/            # K6 performance tests
├── refactor/              # Tests pending environment/implementation support
├── utils/                  # Utility functions and helpers
│   ├── api/               # API client factories
│   ├── config/            # Configuration utilities
│   ├── data/              # Test data builders and fixtures
│   ├── email/             # Email testing (mailosaur)
│   ├── pages/             # Page object models
│   ├── qase/              # Qase test management integration
│   ├── services/          # Test service layer (setup helpers)
│   ├── setup/             # Global test setup and hooks
│   └── zod/               # Zod validation schemas
│       └── api/           # API endpoint schemas (PascalCase)
│           ├── AccountTemplate/   # request.ts, response.ts, index.ts
│           ├── Order/
│           ├── Session/
│           ├── Trade/
│           ├── TradingAccount/
│           └── User/
├── research/              # Test documentation and guides
├── prompts/               # AI prompts for test generation
├── test-results/          # Test execution results (gitignored)
├── playwright.config.ts   # Playwright configuration
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

### Key Directories

- **api/** - API endpoint tests organized by endpoint name
- **utils/zod/api/** - Zod schemas for runtime validation (see [Zod README](utils/zod/README.md))
- **utils/services/** - Reusable test setup services (see [Services README](utils/services/README.md))
- **utils/data/** - Test data builders for consistent test data generation
- **docs/** - Guides for test creation, migration, and patterns
- **prompts/** - AI prompts for spec-driven test generation
- **refactor/** - Tests excluded from CI pending environment/implementation support

### TypeScript Path Aliases

This project uses TypeScript path aliases for cleaner imports. See [tsconfig.json](tsconfig.json) for full configuration.

**Available aliases:**
- `@/utils/*` - Backward compatibility catch-all (existing tests use this)
- `@/api/*` - API client utilities
- `@/config/*` - Configuration helpers
- `@/data/*` - Test data builders
- `@/email/*` - Email testing (abstracts provider - currently mailosaur)
- `@/pages/*` - Page object models
- `@/qase/*` - Qase test management
- `@/services/*` - Test setup services
- `@/setup/*` - Global setup hooks
- `@/zod/*` - Zod validation schemas

**Usage example:**
```typescript
// Old pattern (still works for backward compatibility)
import { authenticateAsUser } from '@/utils/services/auth';

// New pattern (recommended for new code - better readability)
import { authenticateAsUser } from '@/services/auth';
import { orderResponseSchema } from '@/zod/api/Order';
import { generateUser } from '@/data/user/user';
```

**Design decision:** Aliases are named by **capability** not **implementation**. For example, `@/email` abstracts the email testing provider (currently mailosaur) to allow easy provider swaps without changing test imports.

## Writing Tests

### Test Organization

- Tests are located in the `tests/` directory
- Use the Page Object Model pattern (see `pages/` directory)
- Follow the naming convention: `*.spec.ts`

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test logic here
  });
});
```

### Using Zod for API Response Validation

Tests should validate API responses using Zod schemas for type safety and comprehensive validation:

```typescript
import { validateWithZod } from '@/utils/api';
import { orderResponseSchema, type OrderResponse } from '@/utils/zod/api/Order';

// Validate response structure, types, and constraints
const response = await orderClient.getOrders(accountId);
await validateWithZod(orderResponseSchema, response, 'order response');
```

**Zod Import Pattern:**
- Import from: `@/utils/zod/api/[EndpointName]` (PascalCase)
- Available: schemas, types, and enums
- Documentation: [Zod README](utils/zod/README.md)

### Best Practices

- Use Page Object Models for better maintainability
- Keep tests independent and isolated
- Use descriptive test names
- Leverage fixtures for common setup
- Validate API responses with Zod schemas
- Use workflow services for consistent test setup
- Add appropriate assertions using `expect`

## Configuration

The project is configured in [playwright.config.ts](playwright.config.ts):

- **Test timeout:** 3 minutes
- **Expect timeout:** 15 seconds
- **Browsers:** Google Chrome (Desktop)
- **Retries:** 2 retries in CI, 0 in local
- **Screenshots:** Captured on failure
- **Traces:** Captured on first retry

## Troubleshooting

### Browsers not installed
If tests fail with browser-related errors:
```bash
npx playwright install
```

### Port conflicts
Ensure the APP_URL in `.env.local` points to the correct application URL.

### Test failures
Check test-results/ directory for screenshots and traces of failed tests.

## k6 Performance Testing

This repository also includes a complete k6 performance testing framework for API load testing.

### Performance Testing Features

- **Dynamic Test Data**: Syncs real symbols and contracts from API to PostgreSQL
- **Multiple Scenarios**: Burst placement, sustained trading, position management, peak load, stress endurance
- **Test Orchestration**: Automated workflow (sync → test → cleanup → report → notify)
- **Docker & Kubernetes**: Production-ready containerization and deployment
- **CI/CD Integration**: GitHub Actions workflows for automated testing
- **HTML Reports**: Beautiful, responsive performance reports
- **Notifications**: Slack and email notifications with test results

### Quick Start (Local)

```bash
# Sync test data from API
tsx scripts/sync-test-data.ts --environment staging

# Run single scenario
k6 run -e ENVIRONMENT=staging performance/scenarios/burst-placement.ts

# Run complete orchestration
tsx scripts/orchestrate-tests.ts --environment staging
```

### Quick Start (Docker)

```bash
# Start all services (PostgreSQL, MinIO, k6)
docker-compose up

# View logs
docker-compose logs -f k6-runner

# Stop services
docker-compose down
```

### Performance Testing Documentation

- [Stage 1: Setup](docs/STAGE-1-SETUP.md) - Database and initial setup
- [Symbols & Contracts Sync](docs/SYMBOLS-CONTRACTS-SYNC.md) - Dynamic test data
- [Stage 3: Orchestration](docs/STAGE-3-ORCHESTRATION.md) - Test workflow
- [Stage 4: Docker & Kubernetes](docs/STAGE-4-DOCKER-K8S.md) - Container deployment
- [Stage 5: CI/CD](docs/STAGE-5-CICD.md) - GitHub Actions workflows
- [Stage 6: Reporting](docs/STAGE-6-REPORTING.md) - Reports and notifications
- [DevOps Handoff](docs/DEVOPS-HANDOFF.md) - AWS infrastructure requirements

### Current Status

**Performance Testing System**:
- ✅ All code complete and ready to deploy
- 🛑 Blocked on AWS infrastructure (EKS, RDS, S3, ECR)
- See [DevOps Handoff](docs/DEVOPS-HANDOFF.md) for requirements

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [k6 Documentation](https://k6.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

If you encounter any issues or have questions, please:
1. Check this README
2. Review existing tests for examples
3. Check the docs/ directory for detailed guides
4. Reach out to the team

---

Happy Testing! <3
