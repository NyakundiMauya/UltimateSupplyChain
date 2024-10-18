## **ERP and POS System (MERN Stack)**  
**Version:** 1.0.0  
**Last Updated:** October 18, 2024  

### **Project Overview**  
This project is a **Supply Chain ERP with Integrated POS System** built using the **MERN stack (MongoDB, Express, React, Node.js)**. The system aims to provide **multi-branch management, inventory tracking, financial reporting, MPESA payment integration**, and a **POS system** for efficient checkout and customer management. The ERP and POS systems share a centralized MongoDB database to ensure data synchronization and consistency across operations.

---

## **Table of Contents**  
1. [Features](#features)  
2. [Project Structure](#project-structure)  
3. [Technology Stack](#technology-stack)  
4. [Installation & Setup](#installation--setup)  
5. [Environment Variables](#environment-variables)  
6. [Usage](#usage)  
7. [API Endpoints](#api-endpoints)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## **Features**  
- **Admin ERP:**  
  - Multi-branch management  
  - Inventory tracking and stock transfers  
  - Sales management and financial reporting  
  - MPESA payment integration for secure transactions  

- **POS System:**  
  - Customer checkout and transaction management  
  - Inventory synchronization with ERP  
  - MPESA payment handling in-store  
  - Role-based access control for cashiers and managers  

---

## **Project Structure**  
```
root  
├── admin  
│   ├── client               # React frontend for Admin ERP  
│   └── server               # Express backend for Admin ERP  
├── pos  
│   ├── frontend             # React frontend for POS system  
│   └── backend              # Express backend for POS system  
└── README.md                # Project documentation  
```

---

## **Technology Stack**  
- **Frontend**: React.js (for both ERP and POS interfaces)  
- **Backend**: Express.js with Node.js  
- **Database**: MongoDB (via MongoDB Atlas or local instance)  
- **Authentication**: JSON Web Tokens (JWT) for secure login and access control  
- **Payments**: MPESA integration for online and in-store transactions  
- **Hosting**: AWS, Heroku, or Azure for deployment  

---

## **Installation & Setup**  
Follow these steps to get the project up and running locally:  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/erp-pos-mern.git
   cd UltimatesupplyChain
   ```

2. **Install Dependencies for ERP and POS Systems**  
   Navigate to each folder and install dependencies:
   ```bash
   cd admin/client && npm install
   cd ../server && npm install
   cd ../../pos/frontend && npm install
   cd ../backend && npm install
   ```

3. **Configure MongoDB Database**  
   - Create a **MongoDB Atlas cluster** or set up a local MongoDB instance.  
   - Add your **MongoDB URI** to the environment variables (see below).

4. **Set Up Environment Variables**  
   Create a `.env` file in each backend folder with the following:  
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   ```

5. **Run the Development Servers**  
   Open multiple terminals and start both ERP and POS systems:
   ```bash
   # Admin ERP (Frontend & Backend)
   cd admin/server && npm start
   cd ../client && npm start

   # POS System (Frontend & Backend)
   cd ../../pos/backend && npm start
   cd ../frontend && npm start
   ```

6. **Access the Applications**  
   - Admin ERP: `http://localhost:3000`  
   - POS System: `http://localhost:3001`  

---

## **Environment Variables**  
The following environment variables must be configured in your `.env` files:  
- **PORT**: Port number for the backend server  
- **MONGODB_URI**: URI for the MongoDB database  
- **JWT_SECRET**: Secret key for JWT authentication  


---

## **Usage**  
- **Admin ERP:**  
  - Login as an admin to access **branch management, inventory tracking, and financial reporting**.  
  - Use the dashboard to **monitor sales trends and inventory levels** across all branches.

- **POS System:**  
  - Cashiers can log in to **process customer checkouts** and handle MPESA payments.  
  - Inventory is automatically synchronized with the ERP system after each sale.

---

## **API Endpoints**  
Below is a summary of key API endpoints used in this project:  

- **Admin ERP:**  
  - `GET /api/branches` – Get all branches  
  - `POST /api/inventory` – Add new product  
  - `GET /api/reports/sales` – Get sales report  

- **POS System:**  
  - `POST /api/transactions` – Process customer transaction  
  - `GET /api/products` – Retrieve product list for checkout  
  - `POST /api/auth/login` – User login for POS  

---

## **Contributing**  
We welcome contributions to this project. Please follow these steps to contribute:  
1. **Fork the repository** on GitHub.  
2. Create a **new branch** for your feature or bug fix:  
   ```bash
   git checkout -b feature-name
   ```  
3. **Commit your changes** and push to your branch:  
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature-name
   ```  
4. Open a **pull request** on the original repository.

---

## **License**  
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

---

## **Contact**  
For any questions or issues, feel free to reach out:  
- **Email:**  n.mauya.nm@gmail.com ezrakaba@gmail.com
- **GitHub:** (https://github.com/NyakundiMauya and https://github.com/ezraarisi)  
