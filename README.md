# Bill Splitting Application

This is a full-stack web application that allows users to create orders, add friends to each order, and split the bill equally among the friends.

## Features

- User authentication and authorization
- Create, manage, and delete orders
- Send and accept friend requests
- Add friends to orders for bill splitting
- Real-time notifications for bill splitting requests
- Calculate and display the bill split among friends

## Technologies Used

- **Frontend**: React.js, Axios, Socket.IO-Client
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO
- **Version Control**: Git, GitHub

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your machine
- MongoDB installed and running locally

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bill-splitting-app.git
```

2. Navigate to the project directory:

```bash
cd bill-splitting-app
```

3. Install the frontend dependencies:

```bash
npm install
```

4. Navigate to the server directory:

```bash
cd server
```

5. Install the backend dependencies:

```bash
npm install
```
Running the Application

1. Start the MongoDB server:

```bash
mongod
```

2. In a new terminal window, navigate to the server directory and start the Express server:

```bash
cd server
node server.js
```

3. In another terminal window, navigate to the bill-splitting-app directory and start the React development server:
bash


```bash
cd ..
npm start
```

The application should now be running at http://localhost:3000.

Deployment
The application is deployed on [Netlify/Vercel/Heroku]. You can access the live application at [Live Application URL].

Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

License
This project is licensed under the MIT License.