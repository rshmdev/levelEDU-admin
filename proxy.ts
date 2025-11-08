import { type NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment - support both localhost and lvh.me
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('lvh.me')) {
    // Try to extract subdomain from the full URL for localhost
    const localhostMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (localhostMatch && localhostMatch[1]) {
      return localhostMatch[1];
    }

    // Try to extract subdomain from lvh.me
    const lvhMatch = url.match(/http:\/\/([^.]+)\.lvh\.me/);
    if (lvhMatch && lvhMatch[1]) {
      return lvhMatch[1];
    }

    // Fallback to host header approach for localhost
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    // Fallback to host header approach for lvh.me
    if (hostname.includes('.lvh.me')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Block access to admin page from subdomains
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For the root path on a subdomain
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
    }

    // For other paths on subdomain (like /thank-you)
    return NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)'
  ]
};