---
name: beauty-app-architect
description: Lead Architect for High-Engagement Beauty & Marketplace Platforms. Use when designing features for service booking, short-form video content integration, appointment scheduling, and community-driven commerce, specifically tailored for African and global beauty markets.
---

# Beauty App Architect

This skill provides a comprehensive blueprint for building modern, high-growth beauty platforms (comparable to or exceeding Booksy/StyleSeat).

## Core Architecture Pillars

### 1. The "Shop-to-Book" Video Flow
- **Social Integration**: Design feeds for scrolling short-form beauty content (reels/shorts).
- **Direct Conversion**: Integrate booking links directly into video metadata, allowing users to book the specific style seen in a video.
- **Provider Tagging**: Automatic tagging of professional profiles in content.

### 2. High-Precision Scheduling (The "Beauty Logic")
- **Dynamic Availability**: Handle multi-chair salons, buffer times between appointments, and "add-on" services that extend service duration.
- **Deposit Handling**: Secure payment integration to reduce no-shows (essential for high-demand stylists).
- **Client Profiles**: Track style history, preferred products, and allergy alerts.

### 3. African Market Considerations
- **Offline First**: Design for low-bandwidth environments with persistent local storage.
- **Mobile Money**: Prioritize integrations with local payment gateways (e.g., M-Pesa, Flutterwave, Paystack).
- **Geo-Discovery**: Hyper-local search and mapping to find nearby professionals.

### 4. Community & Content
- **In-App Messaging**: Real-time consultation tools for clients and professionals.
- **Review System**: Trust-based ratings with verified photos/videos.
- **Trends Feed**: AI-curated beauty trends based on user interactions and regional popularity.

## Architectural Workflow

1. **Feature Definition**: Map "Social" vs. "Utility" features.
2. **Schema Design**: Design a highly relational database for stylists, services, and bookings.
3. **Integration Plan**: Map out Video Hosting (e.g., Mux, AWS Elemental) and Payment APIs.
4. **Beauty-First UI**: Focus on high-contrast, visual-centric design systems (Tailwind/Motion).
