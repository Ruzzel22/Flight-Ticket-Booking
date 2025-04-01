/* QR Code */
// Initialize when DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateTicket");
    const ticketContainer = document.getElementById("ticketContainer");
    const qrForm = document.getElementById("qr_form");

    // Prevent form submission
    qrForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Clear Previous Ticket
        document.getElementById("qr_form").reset();
    });

    // Generate Ticket Button Click Handler
    generateBtn.addEventListener("click", function () {
        const name = document.getElementById("name").value.trim();
        const movie = document.getElementById("event").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const seat = document.getElementById("seat").value.trim();

        // Ticket Validation
        if (!name || !movie || !date || !time || !seat) {
            alert("Please fill in all fields.");
            return;
        }

        // Generate Unique Ticket ID
        const ticketID = "MOVTCKT-" + Math.floor(Math.random() * 1000000);

        // Create Ticket Structure
        const ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");

        // Create Heading
        const h2 = document.createElement("h2");
        h2.textContent = `${movie} Movie Ticket`;
        ticketDiv.appendChild(h2);

        // Field elements
        const fields = [
            { label: "Name", value: name },
            { label: "Date", value: date },
            { label: "Time", value: time },
            { label: "Seat", value: seat },
            { label: "Ticket ID", value: ticketID }
        ];

        // Create element for the fields
        fields.forEach(field => {
            const paragraph = document.createElement("p");            
            const strong = document.createElement("strong");
            strong.textContent = `${field.label}: `;
            
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(field.value));
            ticketDiv.appendChild(paragraph);
        });

        // QR Code Container Creation
        const qrDiv = document.createElement("div");
        qrDiv.id = "qrcode";
        
        // Add QR Code to Ticket
        ticketDiv.appendChild(qrDiv);
        ticketContainer.appendChild(ticketDiv);

        // Generate QR Code with Ticket Details as String
        new QRCode(qrDiv, {
            text: `Name: ${name}, Movie: ${movie}, Date: ${date}, Time: ${time}, Seat: ${seat}, ID: ${ticketID}`,
            width: 128,
            height: 128
        });
    });
});