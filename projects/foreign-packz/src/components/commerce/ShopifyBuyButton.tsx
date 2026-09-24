'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BUY_BUTTON_SDK_URL, BUY_BUTTON_STYLES, SHOPIFY_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN,
} from '@/lib/shopify';

/**
 * Shopify Buy Button for a single apparel product.
 *
 * The customer browses and adds to the cart on this site; Shopify's cart slides out over
 * the page, and only the final payment step happens on Shopify's domain. Card details never
 * touch this site, which keeps the business out of PCI scope.
 *
 * APPAREL ONLY. Callers must resolve the product ID through `shopifyProductIdFor`, which
 * returns null for anything that is not apparel.
 */

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (opts: { domain: string; storefrontAccessToken: string }) => unknown;
      UI: {
        onReady: (client: unknown) => Promise<{
          createComponent: (type: string, config: Record<string, unknown>) => void;
        }>;
      };
    };
  }
}

let sdkPromise: Promise<void> | null = null;

/** Loads the SDK once per page, however many buy buttons are mounted. */
function loadSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.ShopifyBuy?.UI) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = BUY_BUTTON_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Shopify Buy Button SDK failed to load'));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export function ShopifyBuyButton({
  productId, productName,
}: {
  productId: string;
  productName: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const builtRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadSdk()
      .then(async () => {
        // React 18 strict mode mounts effects twice; without this the button renders twice.
        if (cancelled || builtRef.current || !mountRef.current || !window.ShopifyBuy) return;
        builtRef.current = true;

        const client = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_DOMAIN,
          storefrontAccessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        });
        const ui = await window.ShopifyBuy.UI.onReady(client);
        if (cancelled) return;

        ui.createComponent('product', {
          id: productId,
          node: mountRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              // The site already renders the image, title, price and description, so the
              // embed contributes the variant selector and the button only.
              contents: { img: false, title: false, price: false, options: true, button: true },
              text: { button: 'Add to Cart' },
              styles: {
                button: {
                  'font-family': 'Inter, system-ui, sans-serif',
                  'font-size': '14px',
                  'font-weight': '600',
                  'text-transform': 'uppercase',
                  'letter-spacing': '0.12em',
                  'padding-top': '18px',
                  'padding-bottom': '18px',
                  'border-radius': '6px',
                  'background-color': BUY_BUTTON_STYLES.emerald,
                  ':hover': { 'background-color': BUY_BUTTON_STYLES.emeraldHover },
                  ':focus': { 'background-color': BUY_BUTTON_STYLES.emeraldHover },
                },
                option: {
                  'font-family': 'Inter, system-ui, sans-serif',
                  color: BUY_BUTTON_STYLES.bone,
                },
                },
            },
            cart: {
              text: { title: 'Apparel cart', total: 'Subtotal', button: 'Checkout' },
              // Makes it unmistakable that this is the shipped apparel order, separate from
              // any cannabis request the customer may also have open on this site.
              popup: false,
              styles: {
                button: {
                  'font-family': 'Inter, system-ui, sans-serif',
                  'text-transform': 'uppercase',
                  'letter-spacing': '0.12em',
                  'border-radius': '6px',
                  'background-color': BUY_BUTTON_STYLES.emerald,
                  ':hover': { 'background-color': BUY_BUTTON_STYLES.emeraldHover },
                },
              },
            },
            toggle: {
              styles: {
                toggle: {
                  'background-color': BUY_BUTTON_STYLES.emerald,
                  ':hover': { 'background-color': BUY_BUTTON_STYLES.emeraldHover },
                },
              },
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (failed) {
    return (
      <div className="rounded-sm border border-warn/40 bg-warn/10 px-4 py-4">
        <p className="text-[13px] leading-relaxed text-warn">
          The checkout could not load. Refresh the page, or contact support to order
          {' '}
          {productName} directly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div ref={mountRef} aria-live="polite" />
      <p className="mt-3 text-[12px] leading-relaxed text-chrome-dim">
        Apparel is shipped and paid for by card at checkout. Cannabis products are never
        shipped and are never paid for here.
      </p>
    </div>
  );
}
