// script.js

document.addEventListener("DOMContentLoaded", () => {
  const balanceElement = document.getElementById("total-balance");
  const incomeElement = document.getElementById("income-amount");
  const expenseElement = document.getElementById("expense-amount");
  const transactionList = document.getElementById("transaction-list");
  const form = document.getElementById("transaction-form");
  const textInput = document.getElementById("transaction-text");
  const amountInput = document.getElementById("transaction-amount");
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

  let transactions = [];

  // Event listener for form submission
  form.addEventListener("submit", e => {
    e.preventDefault();
    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    if (text === "" || isNaN(amount)) {
      alert("Please enter valid text and amount");
      return;
    }

    addTransaction(text, amount);
    textInput.value = "";
    amountInput.value = "";
  });

  // !dark mode start

  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
  var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

  // Change the icons inside the button based on previous settings

  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    themeToggleLightIcon.classList.remove("hidden");
  } else {
    themeToggleDarkIcon.classList.remove("hidden");
  }

  var themeToggleBtn = document.getElementById("theme-toggle");

  themeToggleBtn.addEventListener("click", function () {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle("hidden");
    themeToggleLightIcon.classList.toggle("hidden");

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  });

  // !dark mode end

  // add a transaction

  function addTransaction(text, amount) {
    const transaction = { id: Date.now(), text, amount };
    if (Math.abs(amount) == 0) {
      alert("Why adding 0?");
      return;
    }

    const totalBalance = calculateTotalBalance() + amount;

    if (totalBalance < 0) {
      alert(
        "Total balance is less than expenses. Cannot add this transaction."
      );
      return;
    }

    transactions.push(transaction);
    updateUI();
  }

  // calculate total balance

  function calculateTotalBalance() {
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  }

  // calculate total income

  function calculateTotalIncome() {
    return transactions.reduce(
      (acc, transaction) =>
        transaction.amount > 0 ? acc + transaction.amount : acc,
      0
    );
  }

  // calculate total expenses

  function calculateTotalExpenses() {
    return transactions.reduce(
      (acc, transaction) =>
        transaction.amount < 0 ? acc + transaction.amount : acc,
      0
    );
  }

  // update the UI

  function updateUI() {
    const totalBalance = calculateTotalBalance();
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpenses();

    if (totalBalance < totalExpenses) {
      alert(
        "Total balance is less than expenses. Cannot add this transaction."
      );
      // Remove the last added transaction

      transactions.pop();
      return;
    }

    balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
    incomeElement.textContent = `$${totalIncome.toFixed(2)}`;
    expenseElement.textContent = `$${Math.abs(totalExpenses).toFixed(2)}`;

    transactionList.innerHTML = transactions
      .map(transaction => {
        return `<li class="bg-white dark:bg-gray-900 py-2 px-4 mb-2 rounded flex justify-between border-r-4 border-solid  shadow-md ${
          transaction.amount < 0 ? "border-red-500" : "border-green-500"
        }">
                      ${transaction.text}
                      <span class="">${
                        transaction.amount < 0 ? "-" : "+"
                      }$${Math.abs(transaction.amount).toFixed(2)}</span>
                  </li>`;
      })
      .join("");
  }
});
