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

let allCharactersCache = null;

export async function searchAllCharacters(query) {
  if (!allCharactersCache) {
    const promises = [];
    // There are 43 pages in the API for characters with pageSize=50
    for (let i = 1; i <= 43; i++) {
      promises.push(
        fetch(`${BASE_URL}/characters?page=${i}&pageSize=50`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      );
    }
    const results = await Promise.all(promises);
    allCharactersCache = results.flat();
  }
  
  const q = query.toLowerCase();
  return allCharactersCache.filter((c) => {
    const name = (c.name || '').toLowerCase();
    const aliases = (c.aliases || []).join(' ').toLowerCase();
    return name.includes(q) || aliases.includes(q);
  });
}

export { extractId };
