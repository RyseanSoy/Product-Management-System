# Application Test Plan

## Purpose

The tests verify the main user journeys and invalid-input handling. Playwright is used because it is already installed in the project and can test pages, forms, navigation, API requests, and rendered results.

## Test coverage

| Area | Coverage |
|---|---|
| Login | Page exists, required fields exist, registration link works |
| Registration | Valid submission redirects to Login; API validation errors are displayed |
| Add Product | All fields accept values and the page sends the expected POST payload |
| Product list | Product data creates a link to the Product Viewer |
| Product Viewer | Selected product details are displayed |
| Navigation security | Regular users do not see Admin; Admin users see the Admin link |
| Input variation | Text, numeric, short-password, and invalid-response cases are tested |

## Approach

- Tests are stored in the `tests` folder.
- Browser interactions are tested with Playwright assertions.
- API responses are mocked where database state is not required, making tests repeatable.
- Authentication state is seeded in browser storage for protected-page tests.
- Product submission requests are inspected to verify the payload sent by the page.
- Run the suite with `npm run test:e2e`.

## Expected result

All tests should pass before delivery. A failing test identifies a broken page flow, incorrect form payload, missing validation, or incorrect access-control presentation.
