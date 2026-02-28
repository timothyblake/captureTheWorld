# Timothy Blake Photography – Travel Photography Portfolio

A high-performance, SEO-optimized photography portfolio built with **Astro 5**, featuring a seamless blend of local content and dynamic imagery powered by the **Flickr API**.

## 🚀 Experience the World
This project serves as a personal archive for Timothy Blake's travel and wildlife photography across England, Europe, and East Asia.

## ✨ Key Features
- **Modern Tech Stack**: Built with [Astro](https://astro.build/) for lightning-fast loads and [Bootstrap 5](https://getbootstrap.com/) for a sleek, responsive UI.
- **Dynamic Flickr Integration**: Automatically pulls individual albums and recent photo streams directly from Flickr, with intelligent server-side caching to bypass API rate limits and speed up page generation.
- **Aesthetic First Design**:
  - **Hero Slider**: Crossfading background slider on the homepage.
  - **Subtle Interactions**: Polaroid-style stacked photo effects and smooth thumbnail hovers.
  - **Lightbox Gallery**: Integrated `GLightbox` with custom styling, photo counters, and touch navigation.
- **Precision Mapping**: Interactive OpenStreetMap embeds on every album page with dynamically calculated bounding boxes to ensure the location is always perfectly centered.
- **Advanced SEO**:
  - **Structured Data**: Full JSON-LD implementation for `BlogPosting`, `Person`, `WebSite`, and `BreadcrumbList`.
  - **Meta Optimization**: Dynamic OG images, Twitter cards, and canonical URL management via a centralized `SEOHead` component.
  - **Internal Linking**: Content-rich `SeoBlock` sections in every album for long-form storytelling and search visibility.
- **Performance**: Pre-fetching enabled for all main navigation paths, optimized image loading with `loading="lazy"` and `decoding="async"`.

## 🛠️ Project Structure
```text
/src
  /components     # Reusable UI elements (Hero, GalleryGrid, Map, etc.)
  /content        # Markdown-based albums with metadata (Astro Content Collections)
  /data           # Global JSON data (Hero imagery, site tags)
  /layouts        # Base layouts for the application
  /pages          # Routing and page templates
  /utils          # Helper functions (Flickr API fetching & caching)
/public           # Static assets (Favicon, robots.txt, manifests)
```

## 🚥 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root with your Flickr credentials:
   ```env
   FLICKR_API_KEY=your_api_key_here
   FLICKR_USER_ID=your_user_id_here
   ```

3. **Development Mode**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## 📸 Content Management
Adding a new album is as simple as creating a new `.md` file in `src/content/albums/`. Each album requires a frontmatter schema including `flickrAlbumId`, `lat/lng` for the map, `order`, and `datePublished`.

---
*Created by Timothy Blake. Photography is a record of curiosity.*
