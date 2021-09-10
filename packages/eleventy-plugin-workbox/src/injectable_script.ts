import { toRootUrl } from 'common';

/**
 * Build script for service worker registration
 * that will be injected into HTML.
 *
 * @param publicUrl of service worker.
 * @param scope of urls that can hijacked by service worker.
 * By convention, it should be in the site's root.
 */
export const buildSWScriptRegistration = (
  publicUrl: string,
  scope: string,
) => /* html */ `<!-- Register service worker for PWA offline mode support. -->
      <script>
        if ("serviceWorker" in window.navigator) {
          window.addEventListener("load", () =>
            window.navigator.serviceWorker.register("${toRootUrl(
              publicUrl,
            )}", { scope: "${scope}" }),
          );
        }
      </script>`;
