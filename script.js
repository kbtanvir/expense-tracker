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

  // Event listener for dark mode toggle
  toggleDarkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Function to add a transaction
  function addTransaction(text, amount) {
    const transaction = { id: Date.now(), text, amount };
    const totalBalance = calculateTotalBalance() + amount;
    const totalExpenses = calculateTotalExpenses() + (amount < 0 ? amount : 0);
    if (totalBalance < amount) {
      alert(
        "Total balance is less than expenses. Cannot add this transaction."
      );
      return;
    }

    transactions.push(transaction);
    updateUI();
  }

  // Function to calculate total balance
  function calculateTotalBalance() {
    return transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
  }

  // Function to calculate total income
  function calculateTotalIncome() {
    return transactions.reduce(
      (acc, transaction) =>
        transaction.amount > 0 ? acc + transaction.amount : acc,
      0
    );
  }

  // Function to calculate total expenses
  function calculateTotalExpenses() {
    return transactions.reduce(
      (acc, transaction) =>
        transaction.amount < 0 ? acc + transaction.amount : acc,
      0
    );
  }

  // Function to update the UI
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
        return `<li class="bg-gray-200 p-2 mb-2 rounded flex justify-between">
                      ${transaction.text}
                      <span class="${
                        transaction.amount < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }">${transaction.amount < 0 ? "-" : "+"}$${Math.abs(
          transaction.amount
        ).toFixed(2)}</span>
                  </li>`;
      })
      .join("");
  }
});
