/**
 * Location and Google Maps Utility Engine
 * Provides pure, zero-dependency helpers for coordinates validation, URL parsing,
 * and generating Google Maps Universal Deep Links.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PartialCoordinates {
  lat?: number;
  lng?: number;
}

export interface ShopAddress {
  line1?: string;
  line2?: string;
}

export interface ShopLocationTarget {
  name?: string;
  address?: ShopAddress;
  coordinates?: Coordinates | PartialCoordinates | null;
  googleMapsUrl?: string | null;
}

/**
 * Validates whether a given object contains valid latitude and longitude coordinates.
 */
export function isValidCoordinates(coords: unknown): coords is Coordinates {
  if (!coords || typeof coords !== "object") return false;
  const { lat, lng } = coords as Record<string, unknown>;
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Parses common Google Maps URL formats to extract latitude and longitude.
 * Supports:
 * - @lat,lng format (e.g. google.com/maps/@12.9716,77.5946,15z)
 * - query parameter ?q=lat,lng or &q=lat,lng
 * - ?ll=lat,lng parameter
 * - Google Maps place data parameters (!3dLAT!4dLNG)
 */
export function extractCoordinatesFromMapUrl(url: string): Coordinates | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // Pattern 1: @lat,lng
  const atMatch = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoordinates({ lat, lng })) return { lat, lng };
  }

  // Pattern 2: ?q=lat,lng or &q=lat,lng
  const qMatch = trimmed.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (isValidCoordinates({ lat, lng })) return { lat, lng };
  }

  // Pattern 3: ?ll=lat,lng or &ll=lat,lng
  const llMatch = trimmed.match(/[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (isValidCoordinates({ lat, lng })) return { lat, lng };
  }

  // Pattern 4: !3d<lat>!4d<lng> (protobuf format in Google Maps URLs)
  const protoMatch = trimmed.match(/!3d(-?\d+(?:\.\d+)?).*?!4d(-?\d+(?:\.\d+)?)/);
  if (protoMatch) {
    const lat = parseFloat(protoMatch[1]);
    const lng = parseFloat(protoMatch[2]);
    if (isValidCoordinates({ lat, lng })) return { lat, lng };
  }

  return null;
}

/**
 * Formats coordinates for clean UI display (e.g. "9.9816° N, 76.2999° E").
 */
export function formatCoordinates(
  coords?: Coordinates | PartialCoordinates | null
): string {
  if (!isValidCoordinates(coords)) return "";
  const latDir = coords.lat >= 0 ? "N" : "S";
  const lngDir = coords.lng >= 0 ? "E" : "W";
  return `${Math.abs(coords.lat).toFixed(4)}° ${latDir}, ${Math.abs(coords.lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Builds a Google Maps search URL for shop owners to search and find their salon pin.
 */
export function buildGoogleMapsSearchUrl(
  shopName?: string,
  address?: ShopAddress
): string {
  const queryParts = [shopName, address?.line1, address?.line2].filter(Boolean);
  const query = queryParts.join(", ").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query || "Salon"
  )}`;
}

/**
 * Generates the optimal Google Maps Directions / Universal Intent URL.
 * Prioritization:
 * 1. Exact Coordinates: https://www.google.com/maps/dir/?api=1&destination=LAT,LNG
 * 2. Coordinates parsed from Google Maps URL (if available)
 * 3. Custom Google Maps link (e.g. maps.app.goo.gl or place link)
 * 4. Fallback: Formatted name + address query
 */
export function generateGoogleMapsDirectionsUrl(
  target?: ShopLocationTarget | null
): string {
  if (!target || typeof target !== "object") {
    return "https://www.google.com/maps/dir/?api=1&destination=Salon";
  }

  // 1. Direct coordinates
  if (isValidCoordinates(target.coordinates)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${target.coordinates.lat},${target.coordinates.lng}`;
  }

  // 2. Try extracting coordinates from custom URL
  if (target.googleMapsUrl && typeof target.googleMapsUrl === "string") {
    const trimmedUrl = target.googleMapsUrl.trim();
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
      const extracted = extractCoordinatesFromMapUrl(trimmedUrl);
      if (extracted) {
        return `https://www.google.com/maps/dir/?api=1&destination=${extracted.lat},${extracted.lng}`;
      }
      // If it's a valid custom URL (like https://maps.app.goo.gl/...), use it directly
      return trimmedUrl;
    }
  }

  // 3. Fallback: Formatted address query
  const queryParts = [
    target.name,
    target.address?.line1,
    target.address?.line2,
  ].filter(Boolean);

  const query = queryParts.join(", ").trim();
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    query || "Salon"
  )}`;
}
