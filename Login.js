
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");


const ADMIN_USERNAME = "Rahil";
const ADMIN_PASSWORD = "Rahil@547";

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {
        message.style.color = "green";
        message.textContent = "Login successful!";

        setTimeout(() => {
            window.location.href = "Admin.html";
        }, 500);
    } else {
        message.style.color = "red";
        message.textContent = "Invalid username or password.";
    }
});