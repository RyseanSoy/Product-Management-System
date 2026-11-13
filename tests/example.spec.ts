import { expect, Page, test } from "@playwright/test";

async function loginAs(page: Page, role = "User") {
  await page.route("**/auth-with-password**", async (route) => {
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.test`;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token, record: { id: "test-user", email: "test@example.com", name: "Test User", role, avatar: "" } }),
    });
  });

  await page.goto("/login");
  await page.getByPlaceholder("Email").fill("test@example.com");
  await page.getByPlaceholder("Password").fill("password123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/products$/);
}

test.describe("Authentication pages", () => {
  test("login page exists and contains the required fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByPlaceholder("Email")).toBeVisible();
    await expect(page.getByPlaceholder("Password")).toBeVisible();
    await expect(page.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/register");
  });

  test("registration page accepts valid data and redirects to login", async ({ page }) => {
    await page.route("**/registerUser**", async (route) => {
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "user-1" }) });
    });
    await page.goto("/register");
    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("password123");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("registration displays an API validation error", async ({ page }) => {
    await page.route("**/registerUser**", async (route) => {
      await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "Password must be at least 8 characters" }) });
    });
    await page.goto("/register");
    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("Password", { exact: true }).fill("short");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
  });
});

test.describe("Products", () => {
  test("add product page accepts all product fields and submits them", async ({ page }) => {
    await page.route("**/getAllProducts**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    });
    await page.route("**/addProduct**", async (route) => {
      expect(route.request().method()).toBe("POST");
      expect(JSON.parse(route.request().postData() ?? "{}")).toMatchObject({ brand: "Dell", model: "XPS 13", description: "Test laptop", quantityStock: 4, price: 999 });
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ id: "product-1" }) });
    });
    await loginAs(page);
    await page.goto("/add");
    await page.getByLabel("Brand").fill("Dell");
    await page.getByLabel("Model").fill("XPS 13");
    await page.getByLabel("Description").fill("Test laptop");
    await page.getByLabel("Quantity").fill("4");
    await page.getByLabel("Price").fill("999");
    await page.getByRole("button", { name: "Add Product" }).click();
    await expect(page.getByText("Product added successfully")).toBeVisible();
  });

  test("products page links to a product viewer", async ({ page }) => {
    await page.route("**/getAllProducts**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([{ id: "product-1", brand: "Dell", model: "XPS 13", description: "Laptop", quantity_Stock: 2, price: 999 }]) });
    });
    await loginAs(page);
    await expect(page.getByRole("link", { name: "product-1" })).toHaveAttribute("href", "/productViewer/product-1");
  });

  test("product viewer displays product details", async ({ page }) => {
    await page.route("**/getSingleProduct**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ brand: "Dell", model: "XPS 13", description: "Laptop", quantity_Stock: 2, price: 999 }) });
    });
    await page.goto("/productViewer/product-1");
    await expect(page.getByRole("heading", { name: "Dell" })).toBeVisible();
    await expect(page.getByText("XPS 13")).toBeVisible();
    await expect(page.getByText("Laptop")).toBeVisible();
  });
});

test.describe("Navigation permissions", () => {
  test("regular users do not see the Admin link", async ({ page }) => {
    await page.route("**/getAllProducts**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    });
    await loginAs(page, "User");
    await expect(page.getByRole("link", { name: "Admin" })).not.toBeVisible();
  });

  test("Admin users see the Admin link", async ({ page }) => {
    await page.route("**/getAllProducts**", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    });
    await loginAs(page, "Admin");
    await expect(page.getByRole("link", { name: "Admin" })).toHaveAttribute("href", "/Admin");
  });
});
