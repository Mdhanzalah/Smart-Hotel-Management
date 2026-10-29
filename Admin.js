const API_URL = "http://localhost:3000/bookings";

async function loadDashboard() {
    const recentBookings = document.getElementById("recentBookings");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load bookings");
        }

        const bookings = await response.json();

        document.getElementById("totalBookings").textContent =
            bookings.length;

        const totalGuests = bookings.reduce((total, booking) => {
            return total + (Number(booking.persons) || 0);
        }, 0);

        document.getElementById("totalGuests").textContent =
            totalGuests;

       
        const roomTypes = new Set(
            bookings
                .map(booking => booking.roomType)
                .filter(Boolean)
        );

        document.getElementById("roomTypes").textContent =
            roomTypes.size;

      
        const latestBookings = [...bookings].reverse().slice(0, 5);

        if (latestBookings.length === 0) {
            recentBookings.innerHTML = `
                <tr>
                    <td colspan="5">No bookings available yet.</td>
                </tr>
            `;
            return;
        }

        recentBookings.innerHTML = latestBookings.map(booking => `
            <tr>
                <td>${escapeHTML(booking.guestName)}</td>
                <td>${escapeHTML(booking.mobile)}</td>
                <td>${escapeHTML(booking.roomType)}</td>
                <td>${escapeHTML(booking.checkIn)}</td>
                <td>${escapeHTML(booking.checkOut)}</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Dashboard error:", error);

        recentBookings.innerHTML = `
            <tr>
                <td colspan="5">
                    Could not load bookings. Please start your server.
                </td>
            </tr>
        `;
    }
}

// Safely display booking values in the table
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

loadDashboard();