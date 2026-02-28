const CDN_PATTERN = /cdn-cgi\/image\/[^/]+\//;

export function cfImg(url: string, transforms: Record<string, string | number>): string {
    const str = Object.entries({ format: 'auto', ...transforms })
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
    return url.replace(CDN_PATTERN, `cdn-cgi/image/${str}/`);
}

// Convenience helpers used across multiple files:
export const mobileHero = (url: string) =>
    cfImg(url, { width: 800, height: 800, fit: 'crop', gravity: 'auto' });

export const albumThumb = (url: string, w: number) => cfImg(url, { width: w });
