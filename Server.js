const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const bookingsFile = path.join(__dirname, "Booking.json");

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods","GET, POST,PUT,DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method === "GET" && req.url === "/bookings") {
        try {
            let bookings = [];

            if (fs.existsSync(bookingsFile)) {
                bookings = JSON.parse(
                    fs.readFileSync(bookingsFile, "utf8")
                );
            }

            if (!Array.isArray(bookings)) {
                throw new Error("Invalid bookings file");
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(bookings));
        } catch (error) {
            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Could not read bookings."
            }));
        }

        return;
    }

    if (req.method === "POST" && req.url === "/bookings") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const booking = JSON.parse(body);

                let bookings = [];

                if (fs.existsSync(bookingsFile)) {
                    bookings = JSON.parse(
                        fs.readFileSync(bookingsFile, "utf8")
                    );
                }

                if (!Array.isArray(bookings)) {
                    throw new Error("Invalid bookings file");
                }

                bookings.push({
                    ...booking,
                    bookingDate: new Date().toISOString()
                });

                fs.writeFileSync(
                    bookingsFile,
                    JSON.stringify(bookings, null, 2)
                );

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Booking saved successfully!"
                }));
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Could not save booking."
                }));
            }
        });

        return;
    }
  
   
    if (req.method === "PUT" && req.url.match(/^\/bookings\/\d+$/)) {
        const index = Number(req.url.split("/")[2]);
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            try {
                const bookings = JSON.parse(
                    fs.readFileSync(bookingsFile, "utf8")
                );

                if (!Array.isArray(bookings) || index >= bookings.length) {
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: "Booking not found" }));
                    return;
                }

                const updatedBooking = JSON.parse(body);
                bookings[index] = {
                    ...bookings[index],
                    ...updatedBooking
                };

                fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Booking updated!" }));
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Update failed" }));
            }
        });

        return;
    }

   
    if (req.method === "DELETE" && req.url.match(/^\/bookings\/\d+$/)) {
        const index = Number(req.url.split("/")[2]);

        try {
            const bookings = JSON.parse(
                fs.readFileSync(bookingsFile, "utf8")
            );

            if (!Array.isArray(bookings) || index >= bookings.length) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: "Booking not found" }));
                return;
            }

            bookings.splice(index, 1);

            fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Booking deleted!" }));
        } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Delete failed" }));
        }

        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`Booking server running on port ${PORT}`);
});