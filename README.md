# Order Management System

This project consists of two main components: `order-consumer` and `order-producer`. The `order-producer` handles the creation, updating, and deletion of orders, while the `order-consumer` processes these orders and manages their status.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.12.x or later)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/ErzhanT/order-app.git
    cd order-app
    ```

### Running the Application

1. **Build and start the Docker containers**:
    ```
    docker-compose up --build -d
    ```

2. **Access the Swagger API documentation**:
    - For `order-producer`, open your browser and navigate to: [http://localhost:3000/api](http://localhost:3000/api)

### API Endpoints

You can use the Swagger interface to interact with the available endpoints for managing orders. Below is a summary of the main endpoints available in the `order-producer` service:

- **Create Order**: `POST /orders`
    - Payload:
      ```json
      {
        "count": 5,
        "userId": "string",
        "productId": "string"
      }
      ```

- **Get All Orders**: `GET /orders`

- **Get Orders by User ID**: `GET /orders/user/:userId`

- **Get Order by ID**: `GET /orders/:id`

- **Update Order**: `PUT /orders/:id`
    - Payload (only `status` and `count` can be updated):
      ```json
      {
        "count": 10,
        "status": "success"
      }
      ```

- **Delete Order**: `DELETE /orders/:id?reason=some_reason`


### DATABASES

You can connect to DBs to view orders and orders event, for this you need to connect to the order and order-event databases in the .env file you can see the credentials to connect!

### License

This project is licensed under the MIT License.

### Contact

For any inquiries, please contact [t.me/turdumambetov](t.me/turdumambetov) 
or [turdumambetov.erzhan@gmail.com](turdumambetov.erzhan@gmail.com).

---

Enjoy building and managing orders with the Order Management System!
