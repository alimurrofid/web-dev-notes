---
title: "Docker"
description: "Jalur belajar containerization Docker: arsitektur container & image, Dockerfile best practice, hingga orkestrasi multi-service Docker Compose."
order: 2
tags:
  - devops
  - docker
  - containers
---

# Docker

> Docker menyederhanakan siklus pengiriman aplikasi dengan membungkus aplikasi beserta seluruh dependensinya ke dalam unit ringan (*container*) yang dapat berjalan konsisten di komputer lokal maupun server cloud.

---

## Jalur Pembelajaran Terstruktur

1. 🟢 [[docker-dasar|Docker Dasar]] (Modul 1)
   → Mental model container vs VM, lifecycle container, manajemen image dari Docker Hub, port mapping, dan Docker Volumes.
2. 🟡 [[dockerfile-dasar|Dockerfile Dasar]] (Modul 2)
   → Sintaks instruksi Dockerfile (FROM, RUN, COPY, CMD), layer caching optimization, dan Multi-stage Builds untuk image berukuran minimal.
3. 🔴 [[docker-compose-dasar|Docker Compose Dasar]] (Modul 3)
   → Orkestrasi multi-kontainer (App + Database + Cache), konfigurasi `docker-compose.yml`, internal networking, dan environment secrets management.
