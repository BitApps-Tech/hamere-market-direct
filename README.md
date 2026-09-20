# Hamere Market Direct

Create a sleek, modern, and high-end merchant web application for a modern East Asian grocery and sourcing store named "Hamere Asian Market" (a blend of the founder's name, Hamere, and Chinese culinary heritage). The site serves as a digital storefront and a custom sourcing request platform, specifically tailored to the East Asian expat and culinary community in East Africa.

### Design & Aesthetic Guidelines

- Visual Style: Minimalist, clean, premium, and warm. Think modern Shanghai/Tokyo boutique market meets functional e-commerce.

- Color Palette: Deep Imperial Red (#8B0000 or #A31D1D) as primary accents, Warm Cream (#FAF8F5) background, Charcoal (#1A1A1A) text, and Jade Green (#2D5A27) for positive actions/badges.

- Typography: Sleek sans-serif pairing with support for clean Chinese typography (e.g., Noto Sans SC).

- Cultural Elements: Elegant modern Asian architectural nuances (subtle grid patterns, clean line art icons), high-resolution imagery, and a seamless bilingual toggle.

### Core Features & Functionality

1. Bilingual Support (English / Chinese - 简体中文):

   - Floating header toggle allowing users to instantly switch the entire UI between English and Simplified Chinese.

2. Homepage & About Section:

   - Hero Section: High-impact banner with bold headline: "Authentic Asian Ingredients & Custom Sourcing | 亚裔美馔 • 专属采买".

   - Story/Legitimacy Block: Brief story introducing Hamere and her curated market, highlighting freshness, authenticity, and direct supplier sourcing.

3. Interactive Product Catalog:

   - Category Filters: Fresh Produce (新鲜蔬菜), Pantry & Sauces (调料干货), Snacks & Drinks (零食饮料), Frozen Goods (冷冻食品), Household Essentials (生活用品).

   - Product Cards: Display bilingual titles, high-quality images, prices, stock badges ("In Stock" / "Available for Pre-order"), and a quick "Add to Cart" button.

4. Smart Bulk Order & Custom Sourcing Hub (Key Feature):

   - Two-Way Cart System:

     - Standard Cart: Items selected directly from the existing catalog.

     - Sourcing Request Form: An integrated section within the ordering interface where users can add items NOT currently in stock.

   - Sourcing Input Fields:

     - Item Name (English or Chinese)

     - Upload Image (for packaging/brand verification)

     - Quantity & Preferred Unit

     - Notes / Brand Preference

   - Unified Checkout / Quote Request: Users submit both catalog items and custom sourcing requests together in a single order submission.

5. Order Confirmation & WhatsApp Integration:

   - Direct-to-WhatsApp Checkout: Clicking "Submit Order & Request Quote" auto-generates a pre-formatted, structured message sent directly to Hamere's WhatsApp, detailing:

     - Catalog Items selected

     - Custom Sourcing Requests added

     - Delivery Address & Contact Info

   - Modal pop-up confirming submission with an estimated review timeframe (e.g., "Hamere will review your custom requests and reply with prices within 2 hours").

6. Trust & Contact Footer:

   - Store address/location map embed, operating hours, direct phone, WeChat ID/QR code placeholder, and WhatsApp contact button.

### User Interface & Animation

- Micro-interactions on buttons and hover effects on product cards.

- Sticky glassmorphism navigation bar with cart drawer trigger.

- Clean slide-over side drawer for the Cart & Sourcing Review list.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19be43a2-1c9f-4a19-957e-8a2fd349bfa1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
