---
title: "ASP.NET Core (.NET 10 LTS)"
description: "Kurikulum backend modern enterprise menggunakan ASP.NET Core dan .NET 10 LTS: Kestrel web server, Dependency Injection, Middleware, Minimal APIs, Entity Framework Core 10, Keamanan JWT & Policy, hingga Automated Testing."
order: 3
tags:
  - web-development
  - backend
  - dotnet
  - csharp
  - aspnetcore
  - rest-api
---

# ASP.NET Core (.NET 10 LTS)

> ASP.NET Core adalah framework web open-source, cross-platform, dan berkinerja ekstrem dari Microsoft yang dirancang untuk membangun aplikasi cloud-native, microservices, dan RESTful API modern di atas runtime .NET 10 LTS (didukung penuh hingga akhir tahun 2028).

---

## Prasyarat Pembelajaran

Sebelum mempelajari ASP.NET Core, Anda sangat disarankan telah memahami konsep fundamental bahasa C# modern:
* [[csharp-dasar|C# Dasar]] (Sintaksis dasar, nullability, pattern matching)
* [[csharp-oop|C# OOP]] (Class, records, interfaces, dependency inversion)
* [[csharp-generic|C# Generic]] (Type-safety, generic constraints)
* [[csharp-collection|C# Collection Framework]] (List, Dictionary, Span)
* [[csharp-linq|C# LINQ]] (Pemfilteran data fungsional, IEnumerable vs IQueryable)
* [[csharp-async-threading|C# Asynchronous & Concurrency]] (TAP, async/await, Task, CancellationToken)

---

## Jalur Pembelajaran Terstruktur

1. 🟢 [[dotnet-dasar|ASP.NET Core Dasar]] (Modul 1)
   → Arsitektur runtime, Kestrel Web Server, WebApplicationBuilder, Dependency Injection Container (Transient, Scoped, Singleton, Captive Dependency), Middleware Pipeline, dan Options Pattern.
2. 🟢 [[dotnet-web-api|ASP.NET Core Web API & Minimal APIs]] (Modul 2)
   → Minimal APIs modern vs Controllers, Route Groups, Parameter Binding, Endpoint Filters, Validasi data FluentValidation, Standar Problem Details (RFC 7807), dan OpenAPI bawaan .NET 10.
3. 🟡 [[dotnet-efcore|Entity Framework Core 10]] (Modul 3)
   → DbContext lifecycle, Code-First Migrations, Fluent API mapping, Change Tracker, No-Tracking queries, pencegahan N+1 problem, dan Interceptors.
4. 🔴 [[dotnet-security|Keamanan & Autentikasi ASP.NET Core]] (Modul 4)
   → JWT Bearer authentication, Claims-based & Policy-based authorization, Password Hashing, CORS, Rate Limiting Middleware bawaan, dan Secret Management.
5. 🔴 [[dotnet-testing|Testing ASP.NET Core]] (Modul 5)
   → Unit Testing via xUnit & FluentAssertions, WebApplicationFactory integration testing, Testcontainers database integration, dan mocking dependencies.
