document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    const cartTableBody = document.querySelector("#cart-table tbody");
    const subtotalEl = document.getElementById("subtotal");
    const serviceFeeEl = document.getElementById("service-fee");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    // Add item to cart
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));

            // Check for existing item in the cart
            const existingItem = cart.find((item) => item.name === name);

            if (existingItem) {
                existingItem.quantity++; // Increase quantity if item exists
            } else {
                cart.push({ name, price, quantity: 1, comment: "" }); // Add new item
            }
            updateCart(); // Refresh cart display
        });
    });

    // Update cart UI and calculations
function updateCart() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    // Create a new object to hold merged items
    const mergedCart = {};

    cart.forEach((item) => {
        if (mergedCart[item.name]) {
            mergedCart[item.name].quantity += item.quantity;
            mergedCart[item.name].comment = item.comment; // Keep the last comment
        } else {
            mergedCart[item.name] = { ...item };
        }
    });

    // Iterate through mergedCart to display items
    for (const itemName in mergedCart) {
        const item = mergedCart[itemName];
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td> <!-- Displays only "Chairs" or "Backdrops" -->
            <td><input type="number" value="${item.quantity}" min="1" data-name="${item.name}"></td>
            <td><input type="text" value="${item.comment}" data-name="${item.name}" class="comment-input" placeholder="Add a comment"></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;

        // Update quantity handler
        row.querySelector("input[type='number']").addEventListener("change", function () {
            const newQuantity = parseInt(this.value);
            const itemName = this.getAttribute("data-name");
            const item = cart.find((item) => item.name === itemName);
            item.quantity = newQuantity;
            updateCart();
        });

        // Update comment handler
        row.querySelector(".comment-input").addEventListener("input", function () {
            const comment = this.value;
            const itemName = this.getAttribute("data-name");
            const item = cart.find((item) => item.name === itemName);
            item.comment = comment;
        });

        cartTableBody.appendChild(row);
    }

    const serviceFee = subtotal * 0.15;
    const tax = subtotal * 0.07;
    const total = subtotal + serviceFee + tax;

    subtotalEl.textContent = subtotal.toFixed(2);
    serviceFeeEl.textContent = serviceFee.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}


    // Submit rental and check date selection
	document.getElementById("submit-rental").addEventListener("click", function (event) {
		event.preventDefault(); // Prevent default form submission

		const rentalDate = document.getElementById("rental-date").value;

		if (rentalDate && cart.length > 0) {
			populateSummary();
			showPrintPopup();
		} else {
			alert("Please select a rental date and add items to your cart.");
		}
	});

	// Prevent print dialog if no date is selected
	document.getElementById("printButton").addEventListener("click", function () {
		const rentalDateInput = document.getElementById("rental-date").value;

		if (!rentalDateInput) {
			alert("Please select a rental date before printing.");
			return; // Prevent the print dialog from opening
		}

		// If the date is selected, proceed to open the print dialog
		window.print();
	});

    // Populate summary section
    function populateSummary() {
        const requestedDate = document.getElementById("rental-date").value;
        document.getElementById("requested-date-summary").innerText = requestedDate;

        const summaryBody = document.getElementById("summary-body");
        summaryBody.innerHTML = ""; // Clear existing summary rows

        cart.forEach((item) => {
            if (item.quantity > 0) {
                const itemTotal = item.price * item.quantity; // Total for the item
                summaryBody.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.comment}</td>
                        <td>$${itemTotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        // Show the summary section
        document.getElementById("cart-summary").style.display = "block";
    }
});

function addToCart(itemName, itemPrice) {
    const quantity = parseInt(document.getElementById("quantity").value);
    const comment = document.getElementById("comment-box").value;

    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += quantity; // Increase quantity
        existingItem.comment = comment; // Update comment
    } else {
        cart.push({
            name: itemName, // Keep item type name
            price: itemPrice,
            quantity: quantity,
            comment: comment
        });
    }
    updateCart();
}

function updateCart() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    // Create a new object to hold merged items
    const mergedCart = {};

    cart.forEach((item) => {
        const itemType = item.name; // Item type (e.g., "Chairs")

        if (mergedCart[itemType]) {
            mergedCart[itemType].quantity += item.quantity; // Sum the quantities
            mergedCart[itemType].comment = item.comment; // Update comment
        } else {
            mergedCart[itemType] = {
                name: itemType, // Store just the type name
                price: item.price,
                quantity: item.quantity,
                comment: item.comment
            };
        }
    });

    // Display merged items
    for (const itemType in mergedCart) {
        const item = mergedCart[itemType];
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td> <!-- Displays only "Chairs" or "Backdrops" -->
            <td>${item.quantity}</td> <!-- Displays total quantity -->
            <td><input type="text" value="${item.comment}" data-name="${item.name}" class="comment-input" placeholder="Add a comment"></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
        `;

        // Update comment handler
        row.querySelector(".comment-input").addEventListener("input", function () {
            const comment = this.value;
            const itemName = this.getAttribute("data-name");
            const item = cart.find((item) => item.name === itemName);
            item.comment = comment;
        });

        cartTableBody.appendChild(row);
    }

    const serviceFee = subtotal * 0.15;
    const tax = subtotal * 0.07;
    const total = subtotal + serviceFee + tax;

    subtotalEl.textContent = subtotal.toFixed(2);
    serviceFeeEl.textContent = serviceFee.toFixed(2);
    taxEl.textContent = tax.toFixed(2);
    totalEl.textContent = total.toFixed(2);
}

// Optional: Pause the animation on mouse over
	for {
		const galleryContainer = document.querySelector('.gallery-container');
		const gallery = document.querySelector('.gallery');

		galleryContainer.addEventListener('mouseover', () => {
			gallery.style.animationPlayState = 'paused'; // Pause the animation
		});

		galleryContainer.addEventListener('mouseout', () => {
			gallery.style.animationPlayState = 'running'; // Resume the animation
		});
	}