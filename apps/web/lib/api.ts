import { apiFetch } from "@fully-open-records/api/src/client";

export function getArtists() {
  return apiFetch<Array<Record<string, unknown>>>("/artists");
}

export function getArtist(slug: string) {
  return apiFetch<Record<string, unknown>>(`/artists/${slug}`);
}

export function getArtistContent(slug: string) {
  return apiFetch<Record<string, unknown>>(`/artists/${slug}/content`);
}

export function getProducts() {
  return apiFetch<Array<Record<string, unknown>>>("/products");
}

export function getProduct(slug: string) {
  return apiFetch<Record<string, unknown>>(`/products/${slug}`);
}

export function getFaq() {
  return apiFetch<Array<Record<string, unknown>>>("/faq");
}

export function getPage(slug: string) {
  return apiFetch<Record<string, unknown>>(`/pages/${slug}`);
}

export function getRadio() {
  return apiFetch<Record<string, unknown>>("/radio");
}

export function getRadioHistory() {
  return apiFetch<Array<Record<string, unknown>>>("/radio/history");
}
