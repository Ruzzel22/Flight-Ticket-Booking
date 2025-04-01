// Payment class to store transaction details
class Payment {
    constructor(cardNumber, cardHolder, expiryDate, cvv, amount) {
        this.cardNumber = cardNumber; // Stores the card number
        this.cardHolder = cardHolder; // Stores the cardholder's name
        this.expiryDate = expiryDate; // Stores the expiry date (MM/YY)
        this.cvv = cvv; // Stores the CVV security code
        this.amount = amount; // Stores the payment amount
        this.timestamp = new Date().toLocaleString(); // Stores the transaction timestamp
    }
}

// PaymentModule class to handle payment processing and transaction management
class PaymentModule {
    constructor() {
        // Retrieve stored transaction history or initialize an empty array
        this.transactionHistory = JSON.parse(localStorage.getItem("transactions")) || [];
        
        // Initialize event listeners and dropdowns
        this.init();
        this.populateYearDropdown();
        this.populateMonthDropdown();
    }

    // Initialize event listeners and load existing transactions
    init() {
        document.getElementById("paymentForm").addEventListener("submit", (event) => this.processPayment(event));
        this.loadTransactionHistory();
    }

    // Populate the expiry year dropdown dynamically
    populateYearDropdown() {
        let currentYear = new Date().getFullYear();
        let yearDropdown = document.getElementById("expiryYear");
        
        for (let i = 0; i < 10; i++) { // Add next 10 years
            let year = (currentYear + i).toString().slice(-2); // Get last two digits of year
            let option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        }
    }

    // Populate the expiry month dropdown dynamically
    populateMonthDropdown() {
        let monthDropdown = document.getElementById("expiryMonth");
        
        for (let i = 1; i <= 12; i++) { // Add months from 01 to 12
            let month = i.toString().padStart(2, '0'); // Ensure two-digit format
            let option = document.createElement("option");
            option.value = month;
            option.textContent = month;
            monthDropdown.appendChild(option);
        }
    }

    // Handle form submission and process payment
    processPayment(event) {
        event.preventDefault(); // Prevent page reload

        // Get form input values
        let cardNumber = document.getElementById("cardNumber").value.trim();
        let cardHolder = document.getElementById("cardHolder").value.trim();
        let expiryMonth = document.getElementById("expiryMonth").value;
        let expiryYear = document.getElementById("expiryYear").value;
        let cvv = document.getElementById("cvv").value.trim();
        let amount = document.getElementById("amount").value.trim();

        // Validate amount input
        if (!amount) {
            alert("Please enter a valid amount.");
            return;
        }

        amount = parseFloat(amount).toFixed(2); // Format amount to two decimal places
        let expiryDate = expiryMonth + "/" + expiryYear; // Combine expiry month and year

        // Validate input fields
        if (!this.validateInput(cardNumber, expiryDate, cvv, amount)) return;

        // Create a new Payment object and store it
        let payment = new Payment(cardNumber, cardHolder, expiryDate, cvv, amount);
        this.transactionHistory.push(payment);
        localStorage.setItem("transactions", JSON.stringify(this.transactionHistory)); // Save to localStorage

        // Update UI with new transaction
        this.addTransactionToUI(payment);

        // Reset form fields
        document.getElementById("paymentForm").reset();

        // Show success animation
        this.animateSuccess();
    }

    // Validate user input fields
    validateInput(cardNumber, expiryDate, cvv, amount) {
        let cardRegex = /^\d{16}$/; // Card number must be 16 digits
        let cvvRegex = /^\d{3}$/; // CVV must be 3 digits

        if (!cardRegex.test(cardNumber)) {
            alert("Invalid card number. It should be 16 digits.");
            return false;
        }
        if (!expiryDate.includes("/")) {
            alert("Please select a valid expiry date.");
            return false;
        }
        if (!cvvRegex.test(cvv)) {
            alert("Invalid CVV. It should be 3 digits.");
            return false;
        }
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount. Please enter a valid number.");
            return false;
        }
        return true;
    }

    // Load and display saved transaction history
    loadTransactionHistory() {
        this.transactionHistory.forEach(transaction => this.addTransactionToUI(transaction));
    }

    // Add a transaction entry to the UI
    addTransactionToUI(transaction) {
        let listItem = document.createElement("li");
        listItem.textContent = `${transaction.timestamp}: Paid $${transaction.amount} with card ending in ${transaction.cardNumber.slice(-4)} (Exp: ${transaction.expiryDate})`;
        document.getElementById("transactionHistory").appendChild(listItem);
    }

    // Show success animation after payment
    animateSuccess() {
        let container = document.querySelector(".container");
        container.classList.add("success-animation");
        setTimeout(() => {
            container.classList.remove("success-animation");
        }, 1000);
    }
}

// Initialize PaymentModule when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => new PaymentModule());
