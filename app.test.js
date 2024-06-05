// app.test.js

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.resolve(__dirname, "app.html"), "utf8");

let dom;
let document;
let window;

beforeEach(() => {
  dom = new JSDOM(html, { runScripts: "dangerously" });
  document = dom.window.document;
  window = dom.window;
  global.document = document;
  global.window = window;

  // Re-require the script after setting up the global document and window
  require("./script");
});

afterEach(() => {
  jest.resetModules();
});

test("Add income transaction", () => {
  const textInput = document.getElementById("transaction-text");
  const amountInput = document.getElementById("transaction-amount");
  const form = document.getElementById("transaction-form");

  textInput.value = "Salary";
  amountInput.value = 500;
  form.dispatchEvent(new window.Event("submit"));

  const totalBalance = document
    .getElementById("total-balance")
    .textContent.trim();
  const incomeAmount = document
    .getElementById("income-amount")
    .textContent.trim();
  const transactionList = document.getElementById("transaction-list").innerHTML;

  expect(totalBalance).toBe("$500.00");
  expect(incomeAmount).toBe("$500.00");
  expect(transactionList).toContain("Salary");
  expect(transactionList).toContain("$500.00");
});

test("Add expense transaction", () => {
  const textInput = document.getElementById("transaction-text");
  const amountInput = document.getElementById("transaction-amount");
  const form = document.getElementById("transaction-form");

  // First, add an income transaction to have a positive balance
  textInput.value = "Salary";
  amountInput.value = 500;
  form.dispatchEvent(new window.Event("submit"));

  // Then, add the expense transaction
  textInput.value = "Groceries";
  amountInput.value = -200;
  form.dispatchEvent(new window.Event("submit"));

  const totalBalance = document
    .getElementById("total-balance")
    .textContent.trim();
  const expenseAmount = document
    .getElementById("expense-amount")
    .textContent.trim();
  const transactionList = document.getElementById("transaction-list").innerHTML;

  expect(totalBalance).toBe("$300.00");
  expect(expenseAmount).toBe("$200.00");
  expect(transactionList).toContain("Groceries");
  expect(transactionList).toContain("-$200.00");
});
test("Toggle dark mode", () => {
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
  const body = document.body;

  toggleDarkModeBtn.click();
  expect(body.classList.contains("dark-mode")).toBe(true);

  toggleDarkModeBtn.click();
  expect(body.classList.contains("dark-mode")).toBe(false);
});
test("Prevent adding expense when balance is less than expenses", async () => {
  const textInput = document.getElementById("transaction-text");
  const amountInput = document.getElementById("transaction-amount");
  const form = document.getElementById("transaction-form");

  // First, add an income transaction to have a positive balance
  textInput.value = "Salary";
  amountInput.value = 500;
  form.dispatchEvent(new window.Event("submit"));

  // Use setTimeout to wait for UI updates
  await new Promise(resolve => setTimeout(resolve, 300));

  // Then, add an expense transaction that exceeds the balance
  textInput.value = "Rent";
  amountInput.value = -600;

  // Mock the window.alert function
  const mockAlert = jest.spyOn(window, "alert").mockImplementation(message => {
    console.log("Alert Box Content:", message); // Log the inner content of the alert box
  });

  // Call the function that triggers the alert box
//   yourFunctionThatTriggersAlert();

  form.dispatchEvent(new window.Event("submit"));

  const totalBalance = document
    .getElementById("total-balance")
    .textContent.trim();
  const expenseAmount = document
    .getElementById("expense-amount")
    .textContent.trim();
  const transactionList = document.getElementById("transaction-list").innerHTML;

  expect(mockAlert).toHaveBeenCalledWith(
    "Total balance is less than expenses. Cannot add this transaction."
  );
  expect(totalBalance).toBe("$500.00"); // Balance should remain unchanged
  expect(expenseAmount).toBe("$0.00"); // No expense should be added
  expect(transactionList).not.toContain("Rent");
  expect(transactionList).not.toContain("-$600.00");

  // Restore the original window.alert function
  mockAlert.mockRestore();
});

// test("Add multiple transactions", () => {
//   const textInput = document.getElementById("transaction-text");
//   const amountInput = document.getElementById("transaction-amount");
//   const form = document.getElementById("transaction-form");

//   // Mock the alert function
//   window.alert = jest.fn();

//   // Add an income transaction
//   textInput.value = "Salary";
//   amountInput.value = 500;
//   form.dispatchEvent(new window.Event("submit"));

//   // Use setTimeout to wait for UI updates
//   setTimeout(() => {
//     // Add another income transaction
//     textInput.value = "Bonus";
//     amountInput.value = 300;
//     form.dispatchEvent(new window.Event("submit"));

//     // Add an expense transaction
//     textInput.value = "Rent";
//     amountInput.value = -400;
//     form.dispatchEvent(new window.Event("submit"));

//     const totalBalance = document
//       .getElementById("total-balance")
//       .textContent.trim();
//     const incomeAmount = document
//       .getElementById("income-amount")
//       .textContent.trim();
//     const expenseAmount = document
//       .getElementById("expense-amount")
//       .textContent.trim();
//     const transactionList =
//       document.getElementById("transaction-list").innerHTML;

//     expect(totalBalance).toBe("$400.00"); // Balance should reflect total income and expenses
//     expect(incomeAmount).toBe("$800.00"); // Total income should include both transactions
//     expect(expenseAmount).toBe("$400.00"); // Total expenses should include only one transaction
//     expect(transactionList).toContain("Salary");
//     expect(transactionList).toContain("$500.00");
//     expect(transactionList).toContain("Bonus");
//     expect(transactionList).toContain("$300.00");
//     expect(transactionList).toContain("Rent");
//     expect(transactionList).toContain("-$400.00");

//     // Check if alert was not called
//     expect(window.alert).not.toHaveBeenCalled();
//   }, 100); // Adjust delay as needed
// });
