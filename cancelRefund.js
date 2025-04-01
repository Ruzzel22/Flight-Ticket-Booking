/* Cancellations & Refunds */
// Initialize flight bookings array
let cancelRefund = [
    {   bookingID: 1, customerName: "Eula", departure: "Tokyo", arrival: "Manila", departureTime: "2025-04-10 08:00 AM", price: 15000, status: "Booked"
    },
    {   bookingID: 2, customerName: "Kiana", departure: "USA", arrival: "Tokyo", departureTime: "2025-04-12 10:00 AM", price: 12000, status: "Booked"
    }
];

// Function to dynamically create the table rows
function loadBookings() {
    const tableBody = document.getElementById("cancelRefundTable");

    // Clear previous rows
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Loop through each booking and create a table row for it
    cancelRefund.forEach(booking => {
        const row = document.createElement("tr");
        const bookingIDCell = document.createElement("td");
        const customerCell = document.createElement("td");
        const flightCell = document.createElement("td");
        const departureCell = document.createElement("td");
        const priceCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        // Fill in the text for each column
        bookingIDCell.textContent = booking.bookingID;     
        customerCell.textContent = booking.customerName;
        flightCell.textContent = `(${booking.departure} → ${booking.arrival})`;
        departureCell.textContent = booking.departureTime;
        priceCell.textContent = `₱${booking.price}`;        

        // Create buttons and attach events
        const cancelButton = document.createElement("button");
        const refundButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.setAttribute("data-id", booking.bookingID);
        cancelButton.classList.add("cancel-button");
        cancelButton.addEventListener("click", function() {
            cancelBooking(booking.bookingID);
        });
        refundButton.textContent = "Refund";
        refundButton.setAttribute("data-id", booking.bookingID);
        refundButton.classList.add("refund-button");
        refundButton.addEventListener("click", function() {
            refundBooking(booking.bookingID);
        });

        // Append buttons
        actionsCell.appendChild(cancelButton);
        actionsCell.appendChild(refundButton);

        // Append each cell to the row
        row.appendChild(bookingIDCell);
        row.appendChild(customerCell);
        row.appendChild(flightCell);
        row.appendChild(departureCell);
        row.appendChild(priceCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// Function to handle cancellation
function cancelBooking(bookingId) {
    const booking = cancelRefund.find(b => b.bookingID === bookingId);
    const messageElement = document.getElementById("message");

    // Display a message confirming cancellation
    alert("Flight has been cancelled!")
    messageElement.textContent = `Flight from ${booking.departure} to ${booking.arrival} on ${booking.departureTime} has been canceled.`;
    messageElement.classList.remove("success");
    messageElement.classList.add("error");
}

// Function to handle refund
function refundBooking(bookingId) {
    const messageElement = document.getElementById("message");

    // Display a message confirming the refund
    alert("Flight has been successfully refund!")
    messageElement.textContent = `Refund of ₱${booking.price} issued for Flight (${booking.departure} → ${booking.arrival}) on ${booking.departureTime}.`;
    messageElement.classList.remove("error");
    messageElement.classList.add("success");
}

// Load bookings after the page is loaded
window.onload = loadBookings;