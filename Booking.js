async function saveBooking(event) {
    event.preventDefault();

    const guestName = document.getElementById("guestName").value.trim();
    const guestAge = Number(document.getElementById("guestAge").value);
    const mobile = document.getElementById("mobile").value.trim();
    const aadhaar = document.getElementById("aadhaar").value.trim();

    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const roomType = document.getElementById("roomType").value;
    const rooms = Number(document.getElementById("rooms").value);
    const persons = Number(document.getElementById("persons").value);

    if (
        !guestName || !guestAge || !mobile || !aadhaar ||
        !checkIn || !checkOut || !roomType || !rooms || !persons
    ) {
        alert("Please fill in all booking details!");
        return;
    }

    if (guestAge < 1 || guestAge > 120) {
        alert("Please enter a valid age.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Enter a valid 10-digit mobile number.");
        return;
    }

    if (!/^[0-9]{12}$/.test(aadhaar)) {
        alert("Enter a valid 12-digit Aadhaar number.");
        return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
        alert("Check-out must be after check-in.");
        return;
    }

    const booking = {
        guestName,
        guestAge,
        mobile,
        aadhaar,
        checkIn,
        checkOut,
        roomType,
        rooms,
        persons,
        bookingDate: new Date().toISOString()
    };

   try {
        const response = await fetch("http://localhost:3000/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Booking failed.");
        }

        alert("Booking saved successfully!");
        document.getElementById("bookingForm").reset();

    }  
     catch (error) {
        alert("Booking not saved . Please try again.");
        console.error(error);
    }
}