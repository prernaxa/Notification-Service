# Notification Service

A backend service to send notifications via **Email**, **SMS**, and **In-App** messages using a queue for reliable processing with retries.

---

## Features

- REST API to send notifications and fetch user notifications
- Supports **Email**, **SMS**, and **In-App** notification types
- Queue-based processing using **Redis**
- Retry mechanism for failed notifications (up to 3 retries)
- MongoDB for notification persistence

---

## Setup Instructions

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd Notification-Service
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file inside the `src` folder with the following variables:

    ```env
    MONGODB_URI=<your-mongodb-connection-string>
    REDIS_URL=<your-redis-url>
    PORT=3000
    EMAIL_USER=<your-email-address>
    EMAIL_PASS=<your-email-password>
    ```

4. **Run the API server**

    ```bash
    node src/app.js
    ```

5. **Run the notification worker**

    In a separate terminal window:

    ```bash
    node src/workers/notificationWorker.js
    ```

---

## API Endpoints

| Method | Endpoint                    | Description                   |
|--------|-----------------------------|-------------------------------|
| POST   | `/notifications`            | Send a notification            |
| GET    | `/users/:id/notifications` | Get notifications for a user   |

---

## Assumptions & Notes

- Email sending is done via Gmail SMTP using [Nodemailer](https://nodemailer.com/).
- SMS sending logic is not implemented but can be added similarly.
- Redis is used as a queue for managing notification jobs.
- Notifications are retried up to 3 times on failure.
- MongoDB stores notification records for persistence.

---

## Deployment

- The service can be deployed on platforms like **Render**, **Heroku**, or any Node.js hosting provider.
- Use managed MongoDB (e.g., MongoDB Atlas) and Redis services for production for reliability and scalability.

---

Feel free to contribute or raise issues if you encounter any bugs or want to request features!

---

**Happy notifying! 🚀**
