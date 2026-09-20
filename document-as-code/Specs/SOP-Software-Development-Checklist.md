---
id: S05
title: SOP Software Development Process Checklist
status: APPROVED
type: QA
created_at: 2026-07-06
author: PMO Team
---

# ✅ Software Development Process Checklist — SOP Profesional

> Dokumen ini mengikuti standar industri profesional (IEEE, TOGAF, PMBOK) dan mencakup seluruh perspektif peran: **Business Analyst, System Analyst, System Architect, Developer, QA, DevOps, dan Project Manager**.  
> Dapat digunakan sebagai SOP untuk software house, tim internal, maupun tim konsultan IT.

---

## FASE 1 — Discovery & Business Analysis

> **PIC:** Business Analyst, System Analyst, Project Manager  
> **Tujuan:** Memahami kebutuhan bisnis secara menyeluruh sebelum masuk ke solusi teknis.

### 1.1 Problem & Opportunity Identification
- [ ] Identifikasi masalah / pain point bisnis
- [ ] Identifikasi peluang (opportunity) yang ingin dicapai
- [ ] Menentukan tujuan bisnis (business objective)
- [ ] Menentukan tujuan aplikasi (system objective)
- [ ] Identifikasi stakeholder (internal & eksternal)
- [ ] Stakeholder Analysis Matrix (pengaruh, kepentingan)
- [ ] Competitor / Market Analysis
- [ ] Persona / Target User Definition

### 1.2 Feasibility Study
- [ ] Technical Feasibility (apakah dapat dibangun secara teknis?)
- [ ] Financial Feasibility (ROI, estimasi biaya vs manfaat)
- [ ] Operational Feasibility (apakah tim/org siap mengoperasikan?)
- [ ] Schedule Feasibility (apakah timeline realistis?)
- [ ] Legal & Regulatory Feasibility
- [ ] Dokumen: **Feasibility Study Report**

### 1.3 Business Process Analysis
- [ ] Business Process Modeling AS-IS (kondisi/proses bisnis saat ini)
- [ ] Identifikasi bottleneck & inefficiency pada proses AS-IS
- [ ] Business Process Modeling TO-BE (kondisi bisnis yang diinginkan)
- [ ] Gap Analysis (AS-IS vs TO-BE)
- [ ] BPMN Diagram / Activity Diagram
- [ ] Business Rules Documentation
- [ ] Dokumen: **Business Process Document (BPD)**

### 1.4 Requirement Gathering
- [ ] Teknik elicitasi: Interview, Workshop, Observasi, Kuesioner
- [ ] Functional Requirement (FR)
- [ ] Non-Functional Requirement (NFR)
  - [ ] Performance (response time, throughput)
  - [ ] Scalability
  - [ ] Availability & Reliability (SLA target)
  - [ ] Security
  - [ ] Maintainability
  - [ ] Portability / Compatibility
- [ ] Constraint & Assumption Documentation
- [ ] Dependency Identification (sistem eksternal, third-party)

### 1.5 Requirement Documentation
- [ ] User Story (format: As a [user], I want [goal], So that [benefit])
- [ ] Use Case (termasuk alternative flow & exception flow)
- [ ] Use Case Diagram
- [ ] Acceptance Criteria (per User Story / Use Case)
- [ ] Scope Project (in-scope & out-of-scope)
- [ ] Prioritas fitur (MoSCoW: Must Have, Should Have, Could Have, Won't Have)
- [ ] MVP Definition
- [ ] Requirement Traceability Matrix (RTM) — awal
- [ ] Stakeholder Sign-off on Requirements
- [ ] Dokumen: **Software Requirements Specification (SRS)**
- [ ] Dokumen: **Business Requirements Document (BRD)**

---

## FASE 2 — Project Planning

> **PIC:** Project Manager, Tech Lead, System Analyst  
> **Tujuan:** Menyusun rencana kerja, sumber daya, dan manajemen risiko sebelum eksekusi.

### 2.1 Project Scoping & Estimation
- [ ] Work Breakdown Structure (WBS)
- [ ] Estimasi waktu per task / story point
- [ ] Estimasi biaya (development, infrastructure, lisensi, operasional)
- [ ] Pembagian milestone & sprint
- [ ] Roadmap produk
- [ ] Definition of Done (DoD)
- [ ] Definition of Ready (DoR)

### 2.2 Resource & Team Planning
- [ ] Team Formation & Role Assignment (PM, SA, Architect, Dev, QA, DevOps, UI/UX)
- [ ] RACI Matrix (Responsible, Accountable, Consulted, Informed)
- [ ] Resource Planning (ketersediaan SDM & tools)
- [ ] Communication Plan (ritme meeting, channel, eskalasi)
- [ ] Onboarding Plan untuk anggota tim baru

### 2.3 Risk Management
- [ ] Risk Identification
- [ ] Risk Assessment (probabilitas & dampak)
- [ ] Risk Mitigation Plan
- [ ] Risk Register (dokumen)
- [ ] Contingency Plan

### 2.4 Technology & Architecture Decision
- [ ] Technology Stack Selection (backend, frontend, database, infrastruktur)
- [ ] Architecture Style Decision (monolith, microservices, serverless, dll)
- [ ] Build vs Buy Analysis (untuk komponen tertentu)
- [ ] Proof of Concept (PoC) jika diperlukan untuk teknologi baru
- [ ] Coding Standard & Convention
- [ ] Dokumen: **Architecture Decision Record (ADR)**

### 2.5 Tools & Process Setup
- [ ] Setup project management tool (Jira / Trello / Linear / GitHub Projects)
- [ ] Setup komunikasi tim (Slack / Teams / Discord)
- [ ] Setup document repository (Confluence / Notion / Google Drive)
- [ ] Agile ceremonies setup (sprint planning, daily standup, review, retrospective)

---

## FASE 3 — UI/UX Design

> **PIC:** UI/UX Designer, Product Manager, System Analyst  
> **Tujuan:** Merancang pengalaman pengguna yang intuitif, konsisten, dan accessible.

### 3.1 Research & Strategy
- [ ] User Research (interview, survey, ethnographic study)
- [ ] User Persona (lengkap: goals, pain points, behavior)
- [ ] Customer Journey Map
- [ ] Competitor UI Analysis
- [ ] Information Architecture

### 3.2 Structure & Flow
- [ ] User Flow (per fitur utama)
- [ ] Sitemap / Navigation Structure
- [ ] Content Strategy

### 3.3 Design Execution
- [ ] Wireframe (per halaman)
- [ ] Low Fidelity Design
- [ ] High Fidelity Design
- [ ] Design System (komponen, token warna, tipografi, spacing)
- [ ] Responsive Design (mobile, tablet, desktop)
- [ ] Accessibility Design (WCAG 2.1 / 2.2 compliance)
- [ ] Dark Mode (jika diperlukan)
- [ ] Error State Design
- [ ] Empty State Design
- [ ] Loading State Design
- [ ] Interactive Prototype

### 3.4 Validation & Approval
- [ ] Usability Testing (dengan representative user)
- [ ] Heuristic Evaluation / UX Review
- [ ] A/B Testing Concept (jika relevan)
- [ ] Design Handoff ke Developer (dengan annotation)
- [ ] Client / Stakeholder Approval
- [ ] Dokumen: **UI/UX Specification Document**

---

## FASE 4 — System Analysis & Specification

> **PIC:** System Analyst, Tech Lead  
> **Tujuan:** Menerjemahkan kebutuhan bisnis menjadi spesifikasi teknis yang siap dirancang dan dikembangkan.

### 4.1 System Analysis
- [ ] Analisis sistem yang ada (existing system review, jika ada)
- [ ] Identifikasi aktor dan interaksi sistem
- [ ] Analisis alur data end-to-end
- [ ] Identifikasi integrasi eksternal (third-party, legacy system)
- [ ] Analisis batasan teknis (constraint)
- [ ] Identifikasi potensi risiko teknis

### 4.2 Functional Specification
- [ ] System Use Case (lebih detail dari business use case)
- [ ] Sequence Diagram per use case utama
- [ ] Activity Diagram per alur proses teknis
- [ ] State Diagram / State Machine (untuk entitas dengan status, misal: order, payment)
- [ ] Business Rule Implementation Specification
- [ ] Exception & Error Flow Specification

### 4.3 Data Specification
- [ ] Data Dictionary (definisi setiap entitas, atribut, tipe data, constraint)
- [ ] Data Flow Diagram (DFD) — Level 0 (Context), Level 1, Level 2
- [ ] Master Data Identification
- [ ] Data Migration Plan (jika ada data dari sistem lama)
- [ ] Data Validation Rules

### 4.4 Interface Specification
- [ ] Interface antar modul internal
- [ ] Interface dengan sistem eksternal (integrasi)
- [ ] API Contract awal (input, output, error)
- [ ] Message / Event Specification (jika event-driven)
- [ ] File Transfer Specification (jika ada import/export)

### 4.5 Requirement Traceability
- [ ] Update Requirement Traceability Matrix (RTM) — mapping FR ke desain teknis
- [ ] Dokumen: **System Specification Document (SSD)**

---

## FASE 5 — System Design

> **PIC:** System Architect, Tech Lead, Senior Developer, DBA  
> **Tujuan:** Merancang arsitektur dan desain teknis sistem secara lengkap dan terdokumentasi.

### 5.1 High-Level Design (HLD)
- [ ] System Architecture Diagram (gambaran besar komponen & interaksinya)
- [ ] Architecture Pattern Decision (MVC, Clean Architecture, Hexagonal, dll)
- [ ] Component Diagram (identifikasi komponen/modul utama)
- [ ] Technology Stack final per komponen
- [ ] Integration Architecture (bagaimana sistem berinteraksi dengan sistem lain)
- [ ] Deployment Architecture (on-premise / cloud / hybrid)
- [ ] Network Topology Diagram (load balancer, firewall, CDN, VPC, subnet)
- [ ] Dokumen: **High-Level Design Document (HLD)**

### 5.2 Low-Level Design (LLD)
- [ ] Class Diagram (per modul/service)
- [ ] Detailed Sequence Diagram (per use case, hingga level method/function)
- [ ] Module / Service Decomposition
- [ ] Interface Definition antar modul (kontrak internal)
- [ ] Algorithm & Logic Design (untuk proses kompleks)
- [ ] Design Pattern Implementation (Repository, Factory, Observer, dll)
- [ ] Dokumen: **Low-Level Design Document (LLD)**

### 5.3 Database Design
- [ ] Entity Relationship Diagram (ERD) — Conceptual
- [ ] ERD — Logical (lengkap dengan tipe data, relasi, constraint)
- [ ] ERD — Physical (optimized untuk DBMS yang dipilih)
- [ ] Database Schema Design
- [ ] Indexing Strategy
- [ ] Partitioning Strategy (jika data besar)
- [ ] Data Dictionary Final
- [ ] Stored Procedure / Function / Trigger Design (jika diperlukan)
- [ ] Multi-tenancy Design (jika SaaS)

### 5.4 API Design
- [ ] RESTful API Design / GraphQL Schema Design
- [ ] API Versioning Strategy
- [ ] Request / Response Structure
- [ ] HTTP Method & Status Code Convention
- [ ] Pagination Strategy
- [ ] Filtering & Sorting Strategy
- [ ] API Documentation (OpenAPI / Swagger Spec)
- [ ] API Rate Limiting & Throttling Design

### 5.5 Security Design
- [ ] Authentication Design (JWT, OAuth2, SSO, MFA)
- [ ] Authorization Design (RBAC / ABAC / Permission-based)
- [ ] Data Encryption Design (at rest, in transit)
- [ ] Input Validation & Sanitization Strategy
- [ ] Protection terhadap OWASP Top 10
- [ ] Secrets Management Design (vault, env variable, key rotation)
- [ ] Security Audit Logging Design
- [ ] Session Management Design

### 5.6 Infrastructure & Reliability Design
- [ ] Infrastructure Design (server, cloud services, container orchestration)
- [ ] Scalability Design (horizontal / vertical scaling, auto-scaling)
- [ ] High Availability Design (failover, redundancy)
- [ ] Caching Strategy (level: CDN, API, database, in-memory)
- [ ] Message Queue / Event Streaming Design (jika async)
- [ ] File Storage Design (object storage, CDN)
- [ ] Deployment Diagram (environment: dev, staging, production)

### 5.7 Observability Design
- [ ] Logging Strategy (structured logging, log level, log aggregation)
- [ ] Monitoring & Alerting Design (metrics, threshold, alerting channel)
- [ ] Distributed Tracing Design (jika microservices)
- [ ] Dashboard Design (operational dashboard)

### 5.8 Resilience & Recovery Design
- [ ] Backup Strategy (frekuensi, retensi, lokasi)
- [ ] Disaster Recovery Plan (DRP) — RTO & RPO target
- [ ] Data Recovery Procedure
- [ ] Incident Response Plan

### 5.9 Design Review & Sign-off
- [ ] Architecture Review (internal)
- [ ] Security Design Review
- [ ] Database Design Review
- [ ] Update RTM — mapping ke desain
- [ ] Stakeholder / Tech Lead Sign-off
- [ ] Dokumen: **System Design Document (SDD)**

---

## FASE 6 — Development Preparation

> **PIC:** Tech Lead, DevOps Engineer, Developer  
> **Tujuan:** Menyiapkan seluruh infrastruktur, tools, dan standar kerja sebelum coding dimulai.

### 6.1 Repository & Version Control
- [ ] Git Repository Setup (GitHub / GitLab / Bitbucket)
- [ ] Branch Strategy (GitFlow / Trunk-based / Feature Branch)
- [ ] Branch Protection Rules (require PR, require review, no force push)
- [ ] Tag & Release Convention (SemVer)
- [ ] .gitignore & .gitattributes Setup

### 6.2 CI/CD & Automation
- [ ] CI Pipeline Setup (lint, test, build otomatis di setiap PR)
- [ ] CD Pipeline Setup (deploy otomatis ke staging / production)
- [ ] Static Code Analysis / Linting
- [ ] Test Automation Integration
- [ ] Container Build & Push (Docker)
- [ ] Artifact Repository (Docker registry, npm, dll)

### 6.3 Environment Setup
- [ ] Environment Strategy (local, development, staging, production)
- [ ] Docker / Docker Compose Setup
- [ ] Environment Variable & Config Management
- [ ] Secrets Management Setup (Vault / AWS Secrets Manager / .env)
- [ ] Database Environment Setup (dev, staging, production)
- [ ] Infrastructure as Code (Terraform / Ansible / Pulumi) — jika diperlukan

### 6.4 Coding Standards & Guidelines
- [ ] Coding Style Guide (per bahasa/framework)
- [ ] Code Review Guideline & Checklist
- [ ] Commit Message Convention (Conventional Commits)
- [ ] Pull Request Template
- [ ] Issue / Bug Report Template
- [ ] Definition of Done (DoD) Finalisasi
- [ ] Definition of Ready (DoR) Finalisasi

### 6.5 Documentation & Tracking
- [ ] API Documentation Initial Setup (Swagger / Postman Collection)
- [ ] Developer Onboarding Guide (README, setup lokal)
- [ ] Issue Tracking Setup (label, milestone, workflow)
- [ ] Sprint Board Setup

---

## FASE 7 — Backend Development

> **PIC:** Backend Developer, Tech Lead, DBA  
> **Tujuan:** Membangun logika bisnis, API, dan lapisan data sesuai desain yang telah disetujui.

### 7.1 Setup & Fondasi
- [ ] Project Scaffolding & Folder Structure
- [ ] Dependency & Package Management Setup
- [ ] Environment Configuration (per environment)
- [ ] Database Connection & ORM Setup
- [ ] Logging Framework Setup
- [ ] Error Handling Framework Setup

### 7.2 Database
- [ ] Database Migration Scripts
- [ ] Seed Data (untuk development & testing)
- [ ] Model / Entity Definition
- [ ] Relasi antar Model
- [ ] Index Implementation
- [ ] Database Optimization Review

### 7.3 Core Development
- [ ] Business Logic Implementation (per modul/service)
- [ ] Repository / Data Access Layer
- [ ] Service Layer
- [ ] Validation Layer (input, business rule)
- [ ] Error & Exception Handling
- [ ] Internationalization / Localization (jika diperlukan)

### 7.4 API Development
- [ ] REST API / GraphQL Endpoint Implementation
- [ ] API Versioning Implementation
- [ ] Request Validation
- [ ] Response Formatting (standar envelope)
- [ ] Pagination, Filtering, Sorting
- [ ] API Rate Limiting Implementation
- [ ] CORS Configuration

### 7.5 Security Implementation
- [ ] Authentication Implementation (JWT / OAuth2 / Session)
- [ ] Authorization / RBAC Implementation
- [ ] Password Hashing (bcrypt / argon2)
- [ ] Input Sanitization
- [ ] SQL Injection Prevention
- [ ] XSS & CSRF Protection
- [ ] Security Headers (Helmet / HSTS / CSP)

### 7.6 Performance & Reliability
- [ ] Caching Implementation (Redis / Memcached)
- [ ] Async Processing / Queue Implementation (jika ada)
- [ ] Database Query Optimization
- [ ] Connection Pooling

### 7.7 Observability
- [ ] Structured Logging Implementation
- [ ] Application Monitoring Integration (APM)
- [ ] Health Check Endpoint

### 7.8 Testing
- [ ] Unit Test (target coverage ≥ 80%)
- [ ] Integration Test
- [ ] API Test (contract test)
- [ ] Mock & Stub untuk dependency eksternal

### 7.9 Documentation
- [ ] API Documentation Update (Swagger / Postman)
- [ ] Code Documentation / Inline Comment (untuk logika kompleks)
- [ ] Update RTM

---

## FASE 8 — Frontend Development

> **PIC:** Frontend Developer, UI/UX Designer, Tech Lead  
> **Tujuan:** Membangun antarmuka pengguna yang responsif, accessible, dan terintegrasi dengan backend.

### 8.1 Setup & Fondasi
- [ ] Project Scaffolding & Folder Structure
- [ ] Design System / Component Library Integration
- [ ] Routing Setup
- [ ] State Management Setup
- [ ] Environment Configuration (API base URL, feature flags)
- [ ] Internationalization (i18n) Setup (jika diperlukan)

### 8.2 Layout & Komponen
- [ ] Global Layout (header, sidebar, footer)
- [ ] Reusable Component Library (button, input, modal, table, dll)
- [ ] Page / Screen Development (per fitur)
- [ ] Responsive Design (mobile-first)
- [ ] Accessibility Implementation (ARIA, keyboard navigation, screen reader)
- [ ] Dark Mode Implementation (jika diperlukan)

### 8.3 State & Data Management
- [ ] State Management Implementation (per fitur)
- [ ] API Integration (per endpoint)
- [ ] Data Fetching, Caching & Revalidation (React Query / SWR / dll)
- [ ] Optimistic UI Update (jika diperlukan)

### 8.4 Form & Validasi
- [ ] Form Implementation
- [ ] Client-side Validation (format, required, length, dll)
- [ ] Error Message Handling
- [ ] Form Submission & Feedback

### 8.5 UX & State Handling
- [ ] Loading State / Skeleton Screen
- [ ] Error State (global & per komponen)
- [ ] Empty State
- [ ] Toast / Notification System
- [ ] Confirmation Dialog

### 8.6 Performance
- [ ] Code Splitting & Lazy Loading
- [ ] Image Optimization
- [ ] Bundle Size Analysis & Optimization
- [ ] Web Performance Metrics (Core Web Vitals: LCP, FID/INP, CLS)

### 8.7 SEO & Meta (jika web publik)
- [ ] Meta Tags (title, description, OG)
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Structured Data (Schema.org)

### 8.8 Testing
- [ ] Unit Test (komponen)
- [ ] Integration Test (alur halaman)
- [ ] End-to-End Test (Cypress / Playwright)
- [ ] Cross-browser Testing (Chrome, Firefox, Safari, Edge)
- [ ] Cross-device Testing (mobile, tablet, desktop)
- [ ] Accessibility Testing (axe / Lighthouse)

---

## FASE 9 — Quality Assurance (QA)

> **PIC:** QA Engineer, Test Lead  
> **Tujuan:** Memastikan sistem berfungsi sesuai requirement, bebas bug kritis, dan siap production.

### 9.1 Test Planning
- [ ] QA Plan & Strategy
- [ ] Test Case Documentation (per fitur / use case)
- [ ] Test Data Preparation
- [ ] Test Environment Setup

### 9.2 Functional Testing
- [ ] Functional Testing (verifikasi semua fitur sesuai FR)
- [ ] Negative Testing (input tidak valid, edge case)
- [ ] Boundary Value Testing
- [ ] Regression Testing (setelah setiap perubahan)
- [ ] Smoke Testing (setelah setiap build baru)
- [ ] Integration Testing (antar modul & sistem eksternal)
- [ ] End-to-End Testing (alur bisnis utama)

### 9.3 Non-Functional Testing
- [ ] Performance Testing (response time, throughput)
- [ ] Load Testing (simulasi jumlah user normal)
- [ ] Stress Testing (simulasi beban puncak / melebihi kapasitas)
- [ ] Volume Testing (data dalam jumlah besar)
- [ ] Security Testing (OWASP Top 10 checklist)
- [ ] Penetration Testing (internal atau third-party)
- [ ] Usability Testing
- [ ] Accessibility Testing (WCAG 2.1 compliance)
- [ ] Compatibility Testing (browser, OS, device)

### 9.4 Acceptance Testing
- [ ] User Acceptance Testing (UAT) — melibatkan end user / stakeholder
- [ ] Business Acceptance Testing (BAT) — validasi alur bisnis
- [ ] Sign-off UAT dari stakeholder

### 9.5 Defect Management
- [ ] Bug Report (severity: critical, major, minor, trivial)
- [ ] Bug Triage & Prioritization
- [ ] Bug Fix Verification & Re-test
- [ ] Regression setelah bug fix

### 9.6 QA Closure
- [ ] Test Summary Report
- [ ] Update RTM — verifikasi semua requirement ter-cover
- [ ] Go/No-Go Recommendation dari QA
- [ ] Dokumen: **Test Report**

---

## FASE 10 — Pre-Production

> **PIC:** Tech Lead, DevOps Engineer, Project Manager  
> **Tujuan:** Validasi akhir sistem sebelum go-live ke production.

- [ ] Final Code Review
- [ ] Static Analysis & Security Scan (SAST)
- [ ] Dependency Vulnerability Scan (SCA)
- [ ] Merge ke Main / Release Branch
- [ ] Build Production Artifact
- [ ] Database Backup (environment staging)
- [ ] Migration Script Testing di Staging
- [ ] Staging Deployment (identik dengan production)
- [ ] Full Regression di Staging
- [ ] Environment Validation (config, secrets, koneksi)
- [ ] SSL / TLS Certificate Validation
- [ ] Domain & DNS Configuration
- [ ] CDN Configuration
- [ ] Firewall & Security Group Validation
- [ ] Monitoring & Alerting Setup Validation
- [ ] Logging Setup Validation
- [ ] Runbook / Deployment Procedure Dokumentasi
- [ ] Rollback Procedure Dokumentasi & Testing
- [ ] Change Advisory Board (CAB) Approval (jika enterprise)
- [ ] Go-Live Checklist Finalisasi
- [ ] Stakeholder Sign-off & Go-Live Authorization

---

## FASE 11 — Production Deployment

> **PIC:** DevOps Engineer, Tech Lead, Project Manager  
> **Tujuan:** Melakukan deployment ke production dengan risiko minimal dan terukur.

- [ ] Komunikasi ke stakeholder & user (jadwal maintenance / rilis)
- [ ] Deployment Strategy Execution (Blue-Green / Canary / Rolling)
- [ ] Database Backup Production (sebelum deploy)
- [ ] Run Database Migration
- [ ] Deploy Backend Service
- [ ] Deploy Frontend
- [ ] Health Check semua service
- [ ] Smoke Testing di Production
- [ ] Functional Verification (happy path utama)
- [ ] Monitoring Error (real-time)
- [ ] Performance Monitoring (real-time)
- [ ] Rollback Plan standby
- [ ] Post-Deploy Communication (rilis sukses ke stakeholder)
- [ ] Update Runbook & Deployment Log

---

## FASE 12 — Post-Production

> **PIC:** Project Manager, Tech Lead, DevOps, Support  
> **Tujuan:** Stabilisasi sistem pasca rilis, mengumpulkan feedback, dan memastikan sistem berjalan sehat.

- [ ] Real-time Server & Infrastructure Monitoring
- [ ] Error Log Monitoring (24-48 jam pertama)
- [ ] Performance Monitoring (response time, resource usage)
- [ ] User Feedback Collection
- [ ] Hotfix Process (jika ditemukan critical bug)
- [ ] SLA Verification (uptime, response time sesuai target)
- [ ] Backup Verification (backup pertama pasca rilis)
- [ ] Security Incident Monitoring
- [ ] Sprint Retrospective / Post-Mortem
- [ ] Lessons Learned Documentation
- [ ] Documentation Update (SRS, SDD, API doc sesuai final)
- [ ] Release Notes (untuk user & stakeholder)
- [ ] Dokumen: **Post-Implementation Review (PIR) Report**

---

## FASE 13 — Maintenance & Operations

> **PIC:** Development Team, DevOps, Support Team  
> **Tujuan:** Memastikan sistem terus berjalan optimal, aman, dan berkembang sesuai kebutuhan bisnis.

### 13.1 Corrective Maintenance
- [ ] Bug Fix (berdasarkan laporan user / monitoring)
- [ ] Hotfix untuk critical issue
- [ ] Root Cause Analysis (RCA) untuk incident

### 13.2 Adaptive Maintenance
- [ ] Feature Enhancement (pengembangan fitur baru)
- [ ] Penyesuaian terhadap perubahan regulasi / bisnis
- [ ] Third-party / API Update

### 13.3 Perfective Maintenance
- [ ] Performance Optimization (backend, frontend, database)
- [ ] Database Optimization (query, index, vacuum)
- [ ] Code Refactoring
- [ ] Technical Debt Management

### 13.4 Preventive Maintenance
- [ ] Dependency Update (library, framework, runtime)
- [ ] Security Patch & Update
- [ ] OS & Infrastructure Patching
- [ ] Penetration Testing berkala
- [ ] Backup Verification berkala
- [ ] Disaster Recovery Drill
- [ ] Capacity Planning & Monitoring
- [ ] Cost Optimization (cloud resource review)

### 13.5 Operational
- [ ] SLA Monitoring & Reporting
- [ ] On-call / Incident Response Process
- [ ] Change Management Process
- [ ] Knowledge Base Update
- [ ] Compliance Review berkala (GDPR, UU PDP, ISO 27001, dll)

---

## FASE 14 — Legal & Compliance

> **PIC:** Project Manager, Legal, Compliance Officer  
> **Catatan:** Wajib untuk aplikasi yang menyimpan / memproses data personal atau beroperasi di industri regulated.

- [ ] Perjanjian Kerahasiaan / NDA (sebelum project dimulai)
- [ ] Kontrak Kerja / Statement of Work (SOW)
- [ ] Intellectual Property (IP) Agreement
- [ ] Privacy Policy
- [ ] Terms of Service / Terms & Conditions
- [ ] Cookie Policy (jika web)
- [ ] Data Processing Agreement (DPA) — untuk vendor / third-party
- [ ] Data Retention & Deletion Policy
- [ ] Consent Management (persetujuan pengguna untuk data)
- [ ] Compliance terhadap regulasi yang berlaku (UU PDP, GDPR, HIPAA, PCI-DSS, dll)
- [ ] Security Audit / ISO 27001 Preparation (jika enterprise)
- [ ] Aksesibilitas Legal (WCAG — jika layanan publik)

---

## 📦 Deliverables per Fase

| Fase | Dokumen / Output Utama | PIC |
|---|---|---|
| Discovery & Business Analysis | BRD, Feasibility Study, Business Process Document, SRS | BA, SA |
| Project Planning | Project Plan, WBS, Risk Register, ADR, RACI | PM, Tech Lead |
| UI/UX Design | User Flow, Wireframe, Prototype, Design System, UI Spec | UI/UX |
| System Analysis | SSD, RTM, Data Dictionary, Interface Spec, State Diagram | SA |
| System Design | HLD, LLD, SDD, ERD, API Spec, DRP, Security Design | Architect, SA |
| Dev Preparation | README, CI/CD Config, Branch Strategy, DoD, PR Template | Tech Lead, DevOps |
| Backend Development | Source Code, DB Migration, API, Unit & Integration Test | Backend Dev |
| Frontend Development | Source Code, Component Library, E2E Test | Frontend Dev |
| QA | Test Plan, Test Case, Bug Report, Test Report, UAT Sign-off | QA |
| Pre-Production | Staging Report, Runbook, Go-Live Checklist, Sign-off | PM, DevOps |
| Production Deployment | Production Release, Deployment Log | DevOps |
| Post-Production | Monitoring Report, PIR Report, Lessons Learned, Release Notes | PM, Tech Lead |
| Maintenance | Patch, Update, RCA Report, Monitoring Report | Dev, DevOps |
| Legal & Compliance | Kontrak, Privacy Policy, ToS, DPA, Compliance Report | PM, Legal |

---

## 🔁 Requirement Traceability Matrix (RTM) — Overview

> RTM harus di-update secara iteratif di setiap fase.

| ID | User Story / FR | Use Case | System Spec | Design | Test Case | Status |
|---|---|---|---|---|---|---|
| FR-001 | ... | UC-01 | SSD-01 | LLD-01 | TC-001 | ✅ |
| FR-002 | ... | UC-02 | SSD-02 | LLD-02 | TC-002 | 🔄 |

---

## 📌 Catatan Penting

1. **RTM** harus dijaga konsistensinya dari fase Discovery hingga QA — setiap requirement harus dapat ditelusuri ke test case dan hasilnya.
2. **HLD** diselesaikan sebelum development dimulai; **LLD** dapat dikembangkan secara iteratif per modul/sprint.
3. **SRS** adalah kontrak teknis antara SA dan tim developer — perubahan SRS harus melalui proses **change request** formal.
4. **Disaster Recovery Plan** harus diuji (drill) minimal sekali sebelum go-live.
5. Checklist ini bersifat **komprehensif** — sesuaikan dengan skala proyek. Proyek kecil dapat menyederhanakan beberapa dokumen formal, namun prinsip dasarnya tetap berlaku.

---

*Versi: 2.0 | Standar referensi: IEEE 830 (SRS), IEEE 1016 (SDD), PMBOK, TOGAF, OWASP, WCAG 2.1*
