const BASE_URL = 'https://anapioficeandfire.com/api';

function extractId(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

async function fetchWithHandling(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

function parseLinkHeader(header) {
  if (!header) return {};
  const links = {};
  const parts = header.split(',');
  parts.forEach((part) => {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      links[match[2]] = match[1];
    }
  });
  return links;
}

async function fetchListWithPagination(endpoint, page = 1, pageSize = 10) {
  const url = `${BASE_URL}/${endpoint}?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  const linkHeader = response.headers.get('Link');
  const links = parseLinkHeader(linkHeader);
  return {
    data,
    hasNext: !!links.next,
    hasPrev: !!links.prev,
  };
}

export async function getBooks(page = 1, pageSize = 10) {
  return fetchListWithPagination('books', page, pageSize);
}

export async function getBook(id) {
  return fetchWithHandling(`${BASE_URL}/books/${id}`);
}

export async function getCharacters(page = 1, pageSize = 10, name = '') {
  let url = `${BASE_URL}/characters?page=${page}&pageSize=${pageSize}`;
  if (name) {
    url += `&name=${encodeURIComponent(name)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  const linkHeader = response.headers.get('Link');
  const links = parseLinkHeader(linkHeader);
  return {
    data,
    hasNext: !!links.next,
    hasPrev: !!links.prev,
  };
}

export async function getCharacter(id) {
  return fetchWithHandling(`${BASE_URL}/characters/${id}`);
}

export async function getHouses(page = 1, pageSize = 10, region = '') {
  let url = `${BASE_URL}/houses?page=${page}&pageSize=${pageSize}`;
  if (region) {
    url += `&region=${encodeURIComponent(region)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  const linkHeader = response.headers.get('Link');
  const links = parseLinkHeader(linkHeader);
  return {
    data,
    hasNext: !!links.next,
    hasPrev: !!links.prev,
  };
}

export async function getHouse(id) {
  return fetchWithHandling(`${BASE_URL}/houses/${id}`);
}

export async function getResourceByUrl(url) {
  return fetchWithHandling(url);
}

export { extractId };
