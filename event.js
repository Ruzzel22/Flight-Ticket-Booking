/* Event Class - Represents an individual event */
class Event {
    constructor(id, name, venue, date, seats) {
        this.id = id;
        this.name = name;
        this.venue = venue;
        this.date = date;
        this.seats = seats; // Total available seats
        this.bookedSeats = []; // Stores booked seat numbers
    }

    // Method to book a seat for an event
    bookSeat(seatNumber, user) {
        if (this.bookedSeats.includes(seatNumber)) {
            alert('Seat already booked!');
            return false;
        }
        this.bookedSeats.push({ seat: seatNumber, user: user });
        this.saveToLocalStorage();
        return true;
    }

    // Save updated event data to localStorage
    saveToLocalStorage() {
        let events = JSON.parse(localStorage.getItem('events')) || [];
        let updatedEvents = events.map(event => event.id === this.id ? this : event);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
}

/* EventManager Class - Manages all events */
class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('events')) || [];
    }

    // Add a new event
    addEvent(name, venue, date, seats) {
        let id = Date.now().toString(); // Unique ID based on timestamp
        let newEvent = new Event(id, name, venue, date, seats);
        this.events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.renderEvents();
    }

    // Delete an event
    deleteEvent(eventId) {
        this.events = this.events.filter(event => event.id !== eventId);
        localStorage.setItem('events', JSON.stringify(this.events));
        this.renderEvents();
    }

    // Render the list of events in the UI
    renderEvents() {
        let eventContainer = document.getElementById('events');
        
        // Clear content
        while (eventContainer.firstChild) {
            eventContainer.removeChild(eventContainer.firstChild);
        }

        this.events.forEach(event => {
            let eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            let h3 = document.createElement('h3');
            h3.textContent = event.name;

            let venueP = document.createElement('p');
            let venueStrong = document.createElement('strong');
            venueStrong.textContent = "Venue: ";
            venueP.appendChild(venueStrong);
            venueP.appendChild(document.createTextNode(event.venue));

            let dateP = document.createElement('p');
            let dateStrong = document.createElement('strong');
            dateStrong.textContent = "Date: ";
            dateP.appendChild(dateStrong);
            dateP.appendChild(document.createTextNode(event.date));

            let seatsP = document.createElement('p');
            let seatsStrong = document.createElement('strong');
            seatsStrong.textContent = "Seats: ";
            seatsP.appendChild(seatsStrong);
            let availableSeats = event.seats - event.bookedSeats.length;
            seatsP.appendChild(document.createTextNode(`${availableSeats} / ${event.seats} available`));

            let bookBtn = document.createElement('button');
            bookBtn.classList.add('book-btn');
            bookBtn.setAttribute('data-id', event.id);
            bookBtn.textContent = 'Book Seat';

            let deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('data-id', event.id);
            deleteBtn.textContent = 'Delete';

            eventElement.appendChild(h3);
            eventElement.appendChild(venueP);
            eventElement.appendChild(dateP);
            eventElement.appendChild(seatsP);
            eventElement.appendChild(bookBtn);
            eventElement.appendChild(deleteBtn);
            eventContainer.appendChild(eventElement);
        });
        this.attachEventListeners();
    }

    // Attach event listeners to buttons
    attachEventListeners() {
        document.querySelectorAll('.book-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                let eventId = e.target.getAttribute('data-id');
                let seatNumber = prompt('Enter seat number:');
                let loginUser = JSON.parse(localStorage.getItem('loginUser'));
                let event = this.events.find(ev => ev.id === eventId);
                if (event && loginUser) {
                    event.bookSeat(seatNumber, loginUser.user);
                    this.renderEvents();
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                let eventId = e.target.getAttribute('data-id');
                this.deleteEvent(eventId);
            });
        });
    }
}

// Initialize EventManager instance and render existing events
const eventManager = new EventManager();
eventManager.renderEvents();

// Add Event Button
document.addEventListener('DOMContentLoaded', () => {
    let addEventBtn = document.createElement('button');
    addEventBtn.textContent = 'Add Event';
    addEventBtn.addEventListener('click', () => {
        let name = prompt('Enter event name:');
        let venue = prompt('Enter venue:');
        let date = prompt('Enter event date:');
        let seats = parseInt(prompt('Enter total seats:'), 10);
        eventManager.addEvent(name, venue, date, seats);
    });
    document.getElementById('events').appendChild(addEventBtn);
});
