
# Distributed URL Shortener

A highly scalable, production-ready distributed URL shortener designed to handle high-traffic workloads. The system leverages an **Nginx load balancer** to distribute traffic across a cluster of **three Node.js backend instances**, utilizing **Redis** for blazing-fast caching and **MongoDB** for persistent storage and analytics tracking.

---

## 🚀 Key Features

* **Distributed Layer:** 3 horizontally scaled Node.js application instances.
* **Load Balancing:** Nginx manages incoming traffic on port 80 using a round-robin routing algorithm.
* **No Duplication:** Smart MongoDB lookup layer that guarantees identical long URLs always resolve to the exact same short link.
* **Caching Layer:** Redis cache-first strategy for rapid HTTP `302` URL redirection.
* **Analytics Dashboard:** Tracks real-time traffic clicks, user agents, referrers, and creation history.
* **Modern Frontend:** Built with React, Vite, and managed locally with high-performance **Bun**.

---

## 🛠️ Architecture Overview

When a user interacts with the application, traffic flows seamlessly across the stack:

1. **Frontend (Local):** Runs outside Docker via Bun at `http://localhost:5173`.
2. **Proxy Layer (Docker):** Nginx intercepts backend requests on port `80`.
3. **Application Layer (Docker):** Nginx cycles traffic down to `url-backend-1`, `url-backend-2`, or `url-backend-3` running on internal port `5000`.
4. **Data Layer (Docker):** Backends check for existing URLs in MongoDB and cache lookups inside Redis for immediate subsequent access.

---

