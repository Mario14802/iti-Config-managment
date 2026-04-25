# Mobile Store — Simple & Powerful E-Commerce

A modern, fast, and easy-to-understand online store built using only the basics: **HTML, CSS, and JavaScript**. No complex setups or installations are required.

---

## What does this project do?
This is a complete online shop where three different types of people can work:
1.  **The Buyer (Client)**: Browses phones, adds them to a cart, and "buys" them. They can also see their past orders.
2.  **The Seller (Supplier)**: Adds new products to the store, sets prices, and sees how much profit they've made.
3.  **The Manager (Admin)**: Oversees everyone and manages the lists of buyers and sellers.

---

## How it Works (Simply Explained)

### 1. The "Memory" (LocalStorage)
Instead of using a complicated database, the website uses your browser's own memory (**LocalStorage**) to save everything. 
-   When you add a product or register, it's saved right there. 
-   Each user has their own private "folder" for their cart and history, so they don't mix up.

### 2. The "Security Guard" (Auth-Guard)
Every page has a small script that acts like a security guard. 
-   If you try to go to a dashboard without logging in, the guard kicks you back to the login page.
-   When you log out, the guard locks the door so you can't go back using the browser's "back" button.

### 3. The "Store Logic" (JavaScript)
-   **Adding Items**: When a seller adds a phone, the code converts the image into text so it can be saved in the browser memory.
-   **Buying Items**: When a buyer clicks "Pay," the code moves items from the **Cart** to the **History** and tells the seller "You made money!"
-   **Stock Tracking**: If a phone's quantity hits 0, the code automatically puts an "OUT OF STOCK" label on it and stops anyone from buying it.

---

## How it Looks (The Styling)
We used a **Modular System**, which is like building with LEGO blocks:
-   **Colors & Fonts**: All defined in one place (`base.css`). If you change the primary color there, the whole website updates.
-   **Reusable Parts**: Buttons, inputs, and cards are designed once (`components.css`) and used everywhere for a consistent, premium feel.
-   **Smart Layouts**: The website uses "Grids" to make sure everything stays perfectly aligned, whether you are on a big monitor or a small phone.

---

## The File Map
-   **`login.html`**: The front door.
-   **`register.html`**: Where new buyers join.
-   **`home.html`**: The main shop window.
-   **`product-detail.html`**: Full info about a specific phone.
-   **`cart.html` & `payment.html`**: The checkout process.
-   **`admin-dashboard.html`**: The manager's office.
-   **`supplier-dashboard.html`**: The seller's workbench.
-   **`JS/`**: The "Brain" of the store.
-   **`CSS/`**: The "Clothes" of the store.
