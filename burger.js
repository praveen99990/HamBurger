// ------------------ CART SYSTEM ------------------

let cart = [];

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Show or hide cart
function viewCart(toggle = false) {
    let cartBox = document.querySelector(".cart-box");

    if (toggle && cartBox && cartBox.style.display !== "none") {
        cartBox.style.display = "none";
        return;
    }

    if (!cartBox) {
        cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
        Object.assign(cartBox.style, {
            position: "fixed",
            bottom: "80px",
            right: "20px",
            backgroundColor: "lightgray",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(206, 223, 162, 0.2)",
            zIndex: "1000",
            minWidth: "250px"
        });
        document.body.appendChild(cartBox);
    }

    cartBox.style.display = "block";
    cartBox.innerHTML = "<h3>Your Cart 🛒</h3>";

    if (cart.length === 0) {
        cartBox.innerHTML += "<p>Cart is empty.</p>";
        return;
    }

    cart.forEach(item => {
        const itemRow = document.createElement("div");
        Object.assign(itemRow.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
        });

        const itemName = document.createElement("span");
        itemName.innerText = `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`;

        const buttonsDiv = document.createElement("div");

        const minusBtn = document.createElement("button");
        minusBtn.innerText = "–";
        Object.assign(minusBtn.style, { marginRight: "5px", padding: "2px 6px", cursor: "pointer", borderRadius: "10px" });
        minusBtn.addEventListener("click", () => {
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.name !== item.name);
                document.querySelectorAll(".cart-btn").forEach(btn => {
                    if (btn.innerText.includes(item.name)) {
                        btn.innerText = "Add to Cart";
                        btn.style.transform = "scale(1)";
                    }
                });
            }
            viewCart(false);
        });

        const plusBtn = document.createElement("button");
        plusBtn.innerText = "+";
        Object.assign(plusBtn.style, { padding: "2px 6px", cursor: "pointer", borderRadius: "10px" });
        plusBtn.addEventListener("click", () => {
            item.quantity++;
            viewCart(false);
        });

        buttonsDiv.appendChild(minusBtn);
        buttonsDiv.appendChild(plusBtn);

        itemRow.appendChild(itemName);
        itemRow.appendChild(buttonsDiv);
        cartBox.appendChild(itemRow);
    });

    const total = document.createElement("strong");
    total.innerText = `Total: ₹${calculateTotal()}`;
    cartBox.appendChild(total);
}

// Add item to cart
function addToCart(name, price, btn) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    const quantity = cart.find(item => item.name === name).quantity;
    btn.innerText = `Add to Cart (${quantity})`;
    btn.style.transform = `scale(${1 + quantity * 0.05})`;
}

// Setup cart buttons
function setupAddToCartButtons() {
    const menus = document.querySelectorAll('.menu1, .menu2, .menu3, .menu4, .menu5');
    menus.forEach(menu => {
        const menuText = menu.querySelector('.menu-text') || menu;
        const itemName = menuText.querySelector('h2').innerText;
        const priceText = menuText.querySelector('.price') ? menuText.querySelector('.price').innerText : menu.querySelector('b')?.innerText;
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

        const btn = document.createElement('button');
        btn.innerText = "Add to Cart";
        btn.classList.add("cart-btn");

        btn.addEventListener('click', () => addToCart(itemName, price, btn));
        menuText.appendChild(btn);
    });
}

// Create "View Cart" button
function createViewCartButton() {
    const btn = document.createElement('button');
    btn.innerText = "View Cart";
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "15px 20px",
        fontSize: "18px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: "1000"
    });
    btn.addEventListener('click', viewCart);
    document.body.appendChild(btn);
}

// ------------------ LOGIN / SIGNUP MODAL ------------------

function setupAuthModal() {
    const modal = document.getElementById("auth-modal");
    const closeBtn = document.querySelector(".close-btn");
    const loginBtn = document.querySelector(".login-btn");
    const signupBtn = document.querySelector(".signup-btn");
    const modalTitle = document.getElementById("modal-title");
    const switchText = document.getElementById("switch-text");
    const authForm = document.getElementById("auth-form");

    function openModal(type) {
        modal.style.display = "flex";
        modalTitle.innerText = type === "login" ? "Login" : "Sign Up";

        if (type === "login") {
            authForm.innerHTML = `
                <input type="email" id="email" name="email" placeholder="Email" required>
                <input type="password" id="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            `;
            switchText.innerHTML = `Don't have an account? <a href="#" id="switch-link">Sign Up</a>`;
        } else {
            authForm.innerHTML = `
                <input type="text" id="name" name="name" placeholder="Full Name" required>
                <input type="tel" id="phone" name="phone" placeholder="Phone Number" required>
                <input type="email" id="email" name="email" placeholder="Email" required>
                <input type="password" id="password" name="password" placeholder="Password" required>
                <button type="submit">Sign Up</button>
            `;
            switchText.innerHTML = `Already have an account? <a href="#" id="switch-link">Login</a>`;
        }

        // Re-bind switch link
        const switchLink = document.getElementById("switch-link");
        switchLink.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(type === "login" ? "signup" : "login");
        });

        // ✅ Submit listener inside openModal
        authForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(authForm);
            let url = type === "signup" ? "signup.php" : "login.php";

            fetch(url, {
                method: "POST",
                body: formData
            })
            .then(res => res.text())
            .then(data => {
                console.log("Server response:", data);
                if (data.includes("success")) {
                    alert(type === "signup" ? "Signup successful 🎉" : "Login successful 🎉");
                    modal.style.display = "none";
                    window.location.reload();
                } else {
                    alert("Error: " + data);
                }
            })
            .catch(err => alert("Error: " + err));
        };
    }

    loginBtn.addEventListener("click", () => openModal("login"));
    signupBtn.addEventListener("click", () => openModal("signup"));

    closeBtn.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
}

// ------------------ INIT ------------------

document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    createViewCartButton();
    setupAuthModal();
});
