class SeatBooking {
    constructor(seatPrices, initialSeats, selectedSeats, bookings, reservedSeats, bookedSeats, initSeats, loadBookings, setupEventListeners) {
        // Initialize properties with parameters
        this.seatPrices = seatPrices || { "VIP": 1000, "Standard": 500 };
        this.initialSeats = initialSeats || 20;
        
        // Initialize other properties
        this.selectedSeats = [];
        this.bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        this.reservedSeats = new Set(JSON.parse(localStorage.getItem("reservedSeats")) || []);
        this.bookedSeats = new Set(JSON.parse(localStorage.getItem("bookedSeats")) || []);
        
        // Initialize seat layout and event listeners
        this.initSeats();
        this.loadBookings();
        this.setupEventListeners();
    }

    // Renders the seat layout
    initSeats() {
        const seatContainer = $("#seatContainer");
        seatContainer.empty();

        // Calculate VIP and Standard seats (40% VIP, 60% Standard)
        const vipSeats = Math.floor(this.initialSeats * 0.4);
        const standardSeats = this.initialSeats - vipSeats;

        // Create array representing seat types
        const seatLayout = [
            ...Array(vipSeats).fill("VIP"),
            ...Array(standardSeats).fill("Standard")
        ];

        // Create Seats
        seatLayout.forEach((type, index) => {
            const seatID = index + 1;
            const seatBtn = $("<div>")
                .text(seatID)
                .addClass(`seat ${type.toLowerCase()}`)
                .data({"type": type, "id": seatID});

                // Mark booked/reserved seat
            if (this.reservedSeats.has(seatID.toString()) || this.bookedSeats.has(seatID.toString())) {
                seatBtn.addClass("booked").css("pointer-events", "none");
            } else {
                seatBtn.on("click", () => this.toggleSeat(seatBtn));
            }

            seatContainer.append(seatBtn);
        });
    }

    // Toggles seat selection
    toggleSeat(seatBtn) {
        const seatID = seatBtn.data("id");
        const seatType = seatBtn.data("type");
        const index = this.selectedSeats.findIndex(seat => seat.id === seatID);
        
        // Add or remove seat from selection
        if (index !== -1) {
            this.selectedSeats.splice(index, 1);
            seatBtn.removeClass("selected");
            this.reservedSeats.delete(seatID.toString());
        } else {
            this.selectedSeats.push({ id: seatID, type: seatType });
            seatBtn.addClass("selected");
            this.reservedSeats.add(seatID.toString());
        }
        
        // Update local storage
        localStorage.setItem("reservedSeats", JSON.stringify([...this.reservedSeats]));
    }

    // Confirms and stores booking information
    confirmBooking() {
        const eventName = $("#eventName").val().trim();
        const customerName = $("#customerName").val().trim();

        // Validate User
        if (!eventName || !customerName) {
            alert("Please fill all fields");
            return;
        }
        if (this.selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }

        // Generate booking details
        const seatList = this.selectedSeats.map(seat => `Seat ${seat.id} (${seat.type})`).join(", ");
        const totalPrice = this.selectedSeats.reduce((sum, seat) => sum + this.seatPrices[seat.type], 0);
        const bookingData = {
            id: Date.now(),
            event: eventName,
            customer: customerName,
            seats: seatList,
            price: totalPrice,
            seatIds: this.selectedSeats.map(seat => seat.id),
            status: "confirming"
        };

        // Store booking
        this.bookings.push(bookingData);
        localStorage.setItem("bookings", JSON.stringify(this.bookings));
        this.addBookingToTable(bookingData);
        this.selectedSeats = [];
        this.initSeats();
        alert("Booking added successfully! Please click 'Book Seats' to confirm.");

        $("#eventName, #customerName").val("");
    }

    // Displays existing bookings
    loadBookings() {
        $("#bookingTable").empty();
        this.bookings.forEach((booking) => this.addBookingToTable(booking));
    }

    // Add booking to the table
    addBookingToTable(booking) {
        const row = $("<tr>").data("booking-id", booking.id);
        
        $("<td>").text(booking.event).appendTo(row);
        $("<td>").text(booking.customer).appendTo(row);
        $("<td>").text(booking.seats).appendTo(row);
        $("<td>").text(`₱${booking.price}`).appendTo(row);
        
        // Booking status
        const statusCol = $("<td>");
        const statusSpan = $("<span>")
            .text(booking.status)
            .addClass(booking.status === "confirming" ? "status-confirming" : "status-booked");
        statusCol.append(statusSpan).appendTo(row);
        
        // Action Events
        const actionsCol = $("<td>");
        if (booking.status === "confirming") {
            $("<button>")
                .addClass("btn-book")
                .text("Book Seats")
                .on("click", () => this.confirmSeatBooking(booking.id))
                .appendTo(actionsCol);
        }
        $("<button>")
            .addClass("btn-delete")
            .text("Delete")
            .on("click", () => this.deleteBooking(booking.id))
            .appendTo(actionsCol);
        
        row.append(actionsCol);
        $("#bookingTable").append(row);
    }

    // Confirms seat booking
    confirmSeatBooking(bookingId) {
        // Find the index of the booking with the given ID
        const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex === -1) {
            alert("Booking not found");
            return;
        }

        // Update booking status and seat allocation
        this.bookings[bookingIndex].status = "booked";
        
        this.bookings[bookingIndex].seatIds.forEach(seatId => {
            this.reservedSeats.delete(seatId.toString());
            this.bookedSeats.add(seatId.toString());
        });
        
        // Update localStorage
        localStorage.setItem("bookings", JSON.stringify(this.bookings));
        localStorage.setItem("reservedSeats", JSON.stringify([...this.reservedSeats]));
        localStorage.setItem("bookedSeats", JSON.stringify([...this.bookedSeats]));
        
        // Refresh Data
        this.loadBookings();
        this.initSeats();
        alert("Seats booked successfully!");
    }

    // Remove reservation from seat lists
    deleteBooking(bookingId) {
        // Find the index of the booking with the given ID
        const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
        if (bookingIndex === -1) return;

        const booking = this.bookings[bookingIndex];
        
        // Remove seat based on booking status
        booking.seatIds.forEach(seatId => {
            if (booking.status === "confirming") {
                this.reservedSeats.delete(seatId.toString());
            } else {
                this.bookedSeats.delete(seatId.toString());
            }
        });

        // Remove from array
        this.bookings.splice(bookingIndex, 1);
        
        localStorage.setItem("bookings", JSON.stringify(this.bookings));
        localStorage.setItem("reservedSeats", JSON.stringify([...this.reservedSeats]));
        localStorage.setItem("bookedSeats", JSON.stringify([...this.bookedSeats]));
        
        this.loadBookings();
        this.initSeats();
        alert("Booking deleted successfully");
    }

    // Event listeners confirmation
    setupEventListeners() {
        $("#confirmSelection").on("click", () => this.confirmBooking());
    }
}

// Initialize with default parameters
$(document).ready(() => {
    const seatPrices = { "VIP": 1000, "Standard": 500 };
    const initialSeats = 20;
    new SeatBooking(seatPrices, initialSeats);
});