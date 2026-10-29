

   
        fetch("http://localhost:3000/bookings")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Could not load bookings");
                }
                return response.json();
            })
            .then(bookings => {
                const table = document.getElementById("bookingTable");
                table.innerHTML = "";

                if (!Array.isArray(bookings) || bookings.length === 0) {
                    table.innerHTML =
                        '<tr><td colspan="5">No bookings found.</td></tr>';
                    return;
                }

                bookings.forEach((booking,index) => {
                    const row = document.createElement("tr");

                    [
                        booking.guestName,
                        booking.mobile,
                        booking.roomType,
                        booking.checkIn,
                        booking.checkOut
                    ].forEach(value => {
                        const cell = document.createElement("td");
                        cell.textContent = value ?? "";
                        row.appendChild(cell);
                    });
                    const actionCell = document.createElement("td");

              const editButton = document.createElement("button");
                       editButton.textContent = "Edit";

                  editButton.onclick = async () => {
              const guestName = prompt("Enter guest name:", booking.guestName);
                 if (guestName === null) return;

             const mobile = prompt("Enter mobile:", booking.mobile);
                if (mobile === null) return;

            const roomType = prompt("Enter room type:", booking.roomType);
                    if (roomType === null) return;

              const checkIn = prompt("Enter check-in date:", booking.checkIn);
                      if (checkIn === null) return;

                   const checkOut = prompt("Enter check-out date:", booking.checkOut);
                if (checkOut === null) return;

        const updatedBooking = {
        ...booking,
        guestName,
        mobile,
        roomType,
        checkIn,
        checkOut
    };

    try {
        const response = await fetch(
            `http://localhost:3000/bookings/${index}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedBooking)
            }
        );

        if (!response.ok) throw new Error("Update failed");

        alert("Booking updated successfully!");
        location.reload();
    } catch (error) {
        alert("Could not update booking. Check the server.");
    }
};

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";

deleteButton.onclick = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/bookings/${index}`,
            { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Delete failed");

        alert("Booking deleted successfully!");
        location.reload();
    } catch (error) {
        alert("Could not delete booking. Check the server.");
    }
};

                actionCell.appendChild(editButton);
                actionCell.appendChild(deleteButton);
                   row.appendChild(actionCell);

                    table.appendChild(row);
                });
            })
            .catch(error => {
                document.getElementById("bookingTable").innerHTML =
                    '<tr><td colspan="5">Error loading bookings. Check the server.</td></tr>';
                console.error(error);
            });
  

