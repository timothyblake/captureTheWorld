/**
 * Flickr API Utility
 *
 * Fetches photo data for a given album (photoset) from the Flickr API.
 * Called at build time by Astro's static site generator, so no client-side
 * JavaScript is shipped to the browser.
 *
 * Required environment variables (set in .env):
 *   FLICKR_API_KEY  – API key
 *   FLICKR_USER_ID  – account owner NSID (e.g. 139917624@N04)
 */

import fs from 'node:fs';
import path from 'node:path';

const FLICKR_API_BASE = 'https://www.flickr.com/services/rest/';
const CACHE_DIR = path.resolve(process.cwd(), 'node_modules', '.cache', 'flickr');
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours caching ttl

/**
 * Returns an array of photo objects for a given Flickr album (photoset).
 *
 * Each returned object contains:
 *   - id        {string}  Flickr photo ID
 *   - title     {string}  photo title
 *   - url_l     {string}  large image URL  (1024px)
 *   - url_m     {string}  medium image URL (500px) – useful for thumbnails
 *   - width_l   {number}
 *   - height_l  {number}
 *
 * @param {string} albumId   The Flickr photoset ID from the album frontmatter.
 * @param {number} [perPage] Photos per page (max 500). Defaults to 100.
 * @returns {Promise<Array>}
 */
export async function getFlickrAlbumPhotos(albumId, perPage = 100) {
  const apiKey = import.meta.env.FLICKR_API_KEY;
  const userId = import.meta.env.FLICKR_USER_ID;

  if (!apiKey) {
    throw new Error(
      'Missing FLICKR_API_KEY environment variable. ' +
      'Add it to your .env file: FLICKR_API_KEY=your_key_here'
    );
  }

  const cacheFile = path.join(CACHE_DIR, `${albumId}-${perPage}-v2.json`);

  // 1. Check if valid cached response exists
  try {
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const isFresh = Date.now() - stats.mtimeMs < CACHE_TTL_MS;
      if (isFresh) {
        console.log(`[Flickr Cache] Using cached photos for album ${albumId}`);
        const cachedData = fs.readFileSync(cacheFile, 'utf-8');
        return JSON.parse(cachedData);
      }
    }
  } catch (err) {
    console.warn(`[Flickr Cache] Error reading cache for ${albumId}:`, err.message);
  }

  // 2. Fetch from API if cache misses or is stale
  console.log(`[Flickr API] Fetching photos for album ${albumId}...`);
  const params = new URLSearchParams({
    method: 'flickr.photosets.getPhotos',
    api_key: apiKey,
    user_id: userId,
    photoset_id: albumId,
    extras: 'url_l,url_m,url_n,url_z,title,description,date_taken',
    per_page: String(perPage),
    format: 'json',
    nojsoncallback: '1',
  });

  const response = await fetch(`${FLICKR_API_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`Flickr API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.stat !== 'ok') {
    throw new Error(`Flickr API error: ${data.message} (code ${data.code})`);
  }

  const photos = data.photoset?.photo ?? [];
  const validPhotos = photos.filter((photo) => photo.url_l);

  // 3. Save the fetched results to cache
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(validPhotos), 'utf-8');
    console.log(`[Flickr Cache] Saved photos for album ${albumId} to cache.`);
  } catch (err) {
    console.warn(`[Flickr Cache] Error writing cache for ${albumId}:`, err.message);
  }

  return validPhotos;
}

/**
 * Returns an array of the user's most recent public photo objects.
 *
 * @param {number} [perPage] Photos per page (max 500). Defaults to 50.
 * @returns {Promise<Array>}
 */
export async function getRecentFlickrPhotos(perPage = 50) {
  const apiKey = import.meta.env.FLICKR_API_KEY;
  const userId = import.meta.env.FLICKR_USER_ID;

  if (!apiKey) {
    throw new Error(
      'Missing FLICKR_API_KEY environment variable. ' +
      'Add it to your .env file: FLICKR_API_KEY=your_key_here'
    );
  }

  const cacheFile = path.join(CACHE_DIR, `recent-${perPage}-v2.json`);

  // 1. Check if valid cached response exists
  try {
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const isFresh = Date.now() - stats.mtimeMs < CACHE_TTL_MS;
      if (isFresh) {
        console.log(`[Flickr Cache] Using cached recent photos`);
        const cachedData = fs.readFileSync(cacheFile, 'utf-8');
        return JSON.parse(cachedData);
      }
    }
  } catch (err) {
    console.warn(`[Flickr Cache] Error reading cache for recent photos:`, err.message);
  }

  // 2. Fetch from API if cache misses or is stale
  console.log(`[Flickr API] Fetching recent photos...`);
  const params = new URLSearchParams({
    method: 'flickr.people.getPublicPhotos',
    api_key: apiKey,
    user_id: userId,
    extras: 'url_l,url_m,url_n,url_z,title,description,date_taken',
    per_page: String(perPage),
    format: 'json',
    nojsoncallback: '1',
  });

  const response = await fetch(`${FLICKR_API_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`Flickr API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.stat !== 'ok') {
    throw new Error(`Flickr API error: ${data.message} (code ${data.code})`);
  }

  const photos = data.photos?.photo ?? [];
  const validPhotos = photos.filter((photo) => photo.url_l);

  // 3. Save the fetched results to cache
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(cacheFile, JSON.stringify(validPhotos), 'utf-8');
    console.log(`[Flickr Cache] Saved recent photos to cache.`);
  } catch (err) {
    console.warn(`[Flickr Cache] Error writing cache for recent photos:`, err.message);
  }

  return validPhotos;
}

/**
 * Constructs a Flickr static image URL from its component parts.
 * Useful if you need to build a URL manually without the extras parameter.
 *
 * Sizes:
 *   s – small square (75px)
 *   q – large square (150px)
 *   t – thumbnail (100px)
 *   m – small (240px)
 *   n – small (320px)
 *   w – small (400px)
 *   (none) – medium (500px)
 *   z – medium (640px)
 *   c – medium (800px)
 *   b – large (1024px)
 *   h – large (1600px)  – requires permission
 *   k – large (2048px)  – requires permission
 *   o – original
 *
 * @param {string} farmId
 * @param {string} serverId
 * @param {string} photoId
 * @param {string} secret
 * @param {string} [size='b']
 * @returns {string}
 */
export function buildFlickrUrl(farmId, serverId, photoId, secret, size = 'b') {
  return `https://farm${farmId}.staticflickr.com/${serverId}/${photoId}_${secret}_${size}.jpg`;
}
