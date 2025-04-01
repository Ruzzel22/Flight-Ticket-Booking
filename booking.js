/* Manage Booking */
// This function handles booking operations: adding, editing, deleting, and displaying bookings
function manageTrackBookings() {
    // Retrieve stored bookings from localStorage or initialize an empty array
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    let bookingList = document.getElementById('bookingList');
    let inputName = document.getElementById('inputName');
    let inputEvent = document.getElementById('inputEvent');
    let inputSeats = document.getElementById('inputSeats');
    let addButton = document.getElementById('addBooking');

    // Display Bookings in the table
    function displayBookings() {
        while (bookingList.firstChild) {
            bookingList.removeChild(bookingList.firstChild);
        }

        // Iterate over bookings and create table rows dynamically
        bookings.forEach((booking, index) => {
            // Create table cells for booking details
            let row = document.createElement('tr');
            let nameCell = document.createElement('td');
            let eventCell = document.createElement('td');
            let seatsCell = document.createElement('td');
            let actionCell = document.createElement('td');

            nameCell.textContent = booking.name;
            eventCell.textContent = booking.event;
            seatsCell.textContent = booking.seats;

            // Create Edit button with event listener
            let editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editBooking(index));

            // Create Delete button with event listener
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteBooking(index));

            // Append
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            row.appendChild(nameCell);
            row.appendChild(eventCell);
            row.appendChild(seatsCell);
            row.appendChild(actionCell);
            bookingList.appendChild(row);
        });
    }

    // Add a new booking to the list
    function addBooking() {
        // Validate all input fields before proceeding
        if (inputName.value && inputEvent.value && inputSeats.value) {
            // Create a new booking object
            let newBooking = { name: inputName.value, event: inputEvent.value, seats: inputSeats.value };
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Refresh displayed bookings and clear input fields
            displayBookings();
            inputName.value = '';
            inputEvent.value = '';
            inputSeats.value = '';
        } else {
            alert('Please fill all details');
        }
    }

    // Populate input fields with selected booking data for editing
    function editBooking(index) {
        let booking = bookings[index];
        inputName.value = booking.name;
        inputEvent.value = booking.event;
        inputSeats.value = booking.seats;

        // Change button text to indicate update mode
        addButton.textContent = 'Update';
        addButton.removeEventListener('click', addBooking);
        addButton.addEventListener('click', () => updateBooking(index));
    }

    // Update an existing booking with new input values
    function updateBooking(index) {
        // Replace previous data with updated values
        bookings[index] = { name: inputName.value, event: inputEvent.value, seats: inputSeats.value };
        localStorage.setItem('bookings', JSON.stringify(bookings));
        addButton.textContent = 'Add Booking';

        // Reset event listener to handle new bookings again
        addButton.removeEventListener('click', updateBooking);
        addButton.addEventListener('click', addBooking);

        // Refresh displayed bookings and clear input fields
        displayBookings();
        inputName.value = '';
        inputEvent.value = '';
        inputSeats.value = '';
    }

    // Remove a booking from the list
    function deleteBooking(index) {
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookings();
    }

    // Attach event listener to Add Booking button & displaying the table
    addButton.addEventListener('click', addBooking);
    displayBookings();
}

// Ensure the function runs only after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', manageTrackBookings);