# Smart Collar Backend

Backend API untuk sistem **Smart Collar**, sebuah platform IoT yang digunakan untuk monitoring kesehatan dan aktivitas ternak secara real-time menggunakan perangkat Smart Collar berbasis ESP32.

## Features

* Firebase Authentication
* Cow Management
* Smart Collar Management
* Assignment Management
* Real-time Monitoring
* WhatsApp Notification (Fonte)
* REST API
* Firebase Realtime Database

## Tech Stack

* Node.js
* Express.js
* Firebase Admin SDK
* Firebase Realtime Database
* Firebase Authentication
* Zod
* JWT
* Fonte API
* ES Modules

## Project Structure

```text
src
├── config
├── core
├── middlewares
├── modules
│   ├── auth
│   ├── cow
│   ├── collar
│   ├── assignment
│   ├── monitoring
│   ├── notification
│   └── settings
├── routes
├── shared
├── app.js
└── server.js
```

## Installation

Clone repository.

```bash
git clone <repository-url>
```

Install dependencies.

```bash
npm install
```

Copy environment file.

```bash
cp .env.example .env
```

Run development server.

```bash
npm run dev
```

Run production server.

```bash
npm start
```

## Environment Variables

See `.env.example`.

## API Version

Current Version:

```
v1
```

## Development Workflow

* Create feature branch from `develop`
* Implement feature
* Test locally
* Commit using Conventional Commits
* Open Pull Request into `develop`
* Merge into `main` only after testing

## Roadmap

* Authentication
* Cow Management
* Smart Collar Management
* Assignment Module
* Monitoring Module
* WhatsApp Notification
* Dashboard & Analytics
* OTA Firmware Support

## License

This project is licensed under the MIT License.
