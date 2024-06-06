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
