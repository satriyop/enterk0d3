export const onRequest: PagesFunction<{ GITHUB_TOKEN?: string }> = async (context) => {
  const { request, env, params } = context;

  // 1. Strictly allow only read methods (GET, HEAD)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'GET, HEAD',
      },
    });
  }

  // 2. Validate and reconstruct the path
  const pathSegments = Array.isArray(params.path) ? params.path : [params.path];
  const apiPath = pathSegments.map(s => String(s)).join('/');

  // Reject path traversal
  if (apiPath.includes('..') || apiPath.includes('//')) {
    return new Response(JSON.stringify({ error: 'Invalid path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Whitelist allowed endpoints: strictly scoped to satriyop
  const isAllowed = 
    apiPath === 'users/satriyop/events/public' ||
    apiPath === 'users/satriyop/repos' ||
    /^repos\/satriyop\/[a-zA-Z0-9._-]+\/(contents(\/.*)?|commits)$/.test(apiPath);

  if (!isAllowed) {
    return new Response(JSON.stringify({ error: 'Forbidden: Unauthorized resource scope' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const githubUrl = `https://api.github.com/${apiPath}${url.search}`;

  const headers = new Headers();
  headers.set('User-Agent', 'Enterk0d3-Portfolio');
  headers.set('Accept', 'application/vnd.github.v3+json');

  if (env.GITHUB_TOKEN) {
    headers.set('Authorization', `token ${env.GITHUB_TOKEN}`);
  }

  try {
    const response = await fetch(githubUrl, {
      method: request.method,
      headers,
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Edge & client caching for 200 responses to conserve rate limits
    if (response.ok) {
      responseHeaders.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from GitHub' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};