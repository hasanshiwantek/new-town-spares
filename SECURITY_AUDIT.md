# Security Audit — New Town Spares (Storefront)

| | |
|---|---|
| **Date** | 2026-10-15 |
| **Last updated** | 2026-10-15: remediation status added (section 0), new finding H-7 |
| **Branch / commit** | `release-dev` @ `9a78b5a` (audited baseline) |
| **Scope** | This repository only: Next.js 15 storefront (App Router), its API routes, build config, dependencies and git history |
| **Out of scope** | The backend API (`backend.sparemicro.com`), admin panel, hosting/Vercel config, infrastructure |
| **Method** | Manual code review of all auth, checkout, payment, rendering and API-route code; `npm audit` against a freshly resolved lockfile; git history scan for committed secrets |
| **Audience** | Senior engineering, architecture, and the Astra pentest team |

> **About backend findings:** several issues are about what the frontend *sends* (prices, discounts, order IDs). This review can't see whether the backend re-validates those values. Those findings are marked **"Needs backend check"**. Each one is a real problem unless the backend is shown to recompute or authorize the value server-side.

---

## 0. Remediation status

Branches are listed in merge order; each builds on the one before it.

| ID | Finding | Status | Where / what's left |
|---|---|---|---|
| C-1 | reCAPTCHA secrets in source/history | **Code fixed. Key rotation pending.** | `environment-variable-configuration` (`50b9a08`): all env values in `src/config/envConfig.ts` (`ENV_CONFIG`), no hard-coded keys, `.env.example`, build fails when a required var is missing. **Still to do:** rotate both reCAPTCHA keys (they stay in git history) and set the env vars in Vercel, including `GEONAMES_USERNAME`. |
| H-1 | `?token=` login CSRF | **Open: fix not applied** | A fix (confirm the account before signing in, strip the token from the URL, skip `/auth/*`) was written and reviewed, but it's in no branch, commit or stash. It needs to be reapplied. |
| H-2 | reCAPTCHA never verified | **Frontend fixed. Backend pending.** | `reCAPTCHA-integration-update-payloads-across-forms` (`ea04c1a`): all 5 forms send `recaptchaToken` and reset after submit. **Backend:** verify it with `siteverify`, and rate-limit auth and contact endpoints. |
| H-3 | Client-supplied prices/discounts | **Open (backend)** | Raised with the backend team. Frontend fields get removed once the backend recalculates totals. |
| H-4 | Stored XSS via backend HTML | **Fixed** | `implement-HTML-sanitization` (`e77c1a5`, `18f9d37`): `src/lib/sanitizeHtml.ts` applied to product, category, blog and CMS HTML. BlogHome uses `DOMParser`. Shares DOMPurify config with `bannerStyles.ts`. |
| H-5 | Admin scripts on checkout | **Open (fix reverted)** | A fix (no inline scripts on checkout, approved-host allowlist, reload on entering checkout) was implemented and then reverted. Still unprotected. |
| H-6 | Order details by order number | **Frontend hygiene done. Backend open.** | `implement-HTML-sanitization` (`931b840`): removed the unused unauthenticated `src/lib/api/order.ts`, which also logged PII; order ID is now URL-encoded. **Backend:** `GET web/orders/order-detail` answers without auth (see H-6). |
| H-7 | **New:** Laravel debug mode on in production | **Open (backend)** | See H-7. |
| M-1 | No security headers | **Fixed, CSP partly** | `next.config.ts`: HSTS (2 years, no includeSubDomains yet), X-Frame-Options, nosniff, Referrer-Policy (`no-referrer` on `/auth/*`), Permissions-Policy, no `X-Powered-By`. CSP **enforced** for `frame-ancestors`, `base-uri` and `object-src`. The full script/style/connect policy runs **report-only**, with reports to `/api/csp-report` (Vercel logs). **Still to do:** enforce it once production reports are clean, then add nonces to drop `'unsafe-inline'`. |
| M-2 … M-7 | Medium findings | Open | M-6: GeoNames username moved to env (with C-1); the other M-6 items remain. |
| L-1 | Hard-coded env fallbacks | **Fixed** | With C-1: no key fallbacks, build-time check for required vars. |
| L-3 | PII logged to console | **Partly fixed** | The order-details log was removed with H-6; other `console.*` calls remain. |
| L-2, L-4 … L-8 | Low / info | Open | |

---

## 1. Executive summary

The storefront has **no security headers**, **keeps the bearer token in `localStorage`**, and **renders backend-supplied HTML without sanitizing it**. Together these mean that one stored-XSS payload (for example in a product description) is enough to take over customer accounts and skim card data on the checkout page. On top of that:

- reCAPTCHA **secret keys are committed** to the public-facing GitHub repo (current source and git history).
- **reCAPTCHA is never verified.** The token is checked on the client and then thrown away, so every "protected" form can be scripted.
- Any URL with `?token=` **silently logs the visitor into whatever account that token belongs to** (login CSRF).
- The **charge amount, discount, shipping cost and manual discount all come from the client** at checkout.

| Severity | Count |
|---|---|
| Critical | 1 |
| High | 7 (incl. H-7, found during remediation) |
| Medium | 7 |
| Low / Info | 8 |

### Top 5 actions (do these first)

1. Rotate both reCAPTCHA secret keys and remove all hard-coded secret fallbacks (**C-1**).
2. Send the reCAPTCHA token with every protected request and verify it on the backend (**H-2**).
3. Remove the global `?token=` auto-login, or limit it to a one-time, server-exchanged code (**H-1**).
4. Confirm the backend recomputes every price, discount and shipping value and ties the PaymentIntent to the order (**H-3**).
5. Sanitize all backend HTML with DOMPurify (already a dependency) and ship a CSP plus security headers (**H-4**, **H-5**, **M-1**).

---

## 2. Findings

Severity is a CVSS-style judgement of impact × likelihood for a public e-commerce site. The OWASP Top 10 (2021) category and CWE are listed for traceability.

---

### C-1 — reCAPTCHA secret keys committed to source and git history
**Severity:** Critical · **OWASP:** A02 Cryptographic Failures / A05 Misconfiguration · **CWE-798, CWE-540**

**Where**
- [src/lib/axiosInstance.ts:19-21](src/lib/axiosInstance.ts:19) — `secretkey` falls back to a hard-coded secret (`6LevlO…eq9Jl`).
- Git history: `.env.local` was committed in `a97427d` (2026-09-03) and removed in `62e5170`. It contained a second `RECAPTCHA_SECRET_KEY` (`6LdD8C…`), the site key and the Stripe publishable key. `.env` was committed in `6d05a76`.
- The remote is GitHub (`hasanshiwantek/new-town-spares`). Anyone with read access, now or in the past, has both secrets.

**Why it matters**
- `axiosInstance.ts` is imported by client components. The secret is exported from a client-bundled module, and the local dev build already contains it (`.next/static/chunks/app/layout.js`, among others). A production build only drops it if tree-shaking happens to remove the unused export. That isn't a security control.
- Anyone holding the secret can call `siteverify` as the site. Combined with H-2, the CAPTCHA protects nothing.
- Deleting a file in a later commit doesn't remove it from history.

**Fix**
1. Rotate **both** reCAPTCHA keys in the Google admin console now. Treat every value that was in `.env.local` as compromised.
2. Delete `secretkey` from `axiosInstance.ts`. The secret belongs on the backend only and never in a `NEXT_PUBLIC_*` variable or a client-imported module.
3. Remove hard-coded fallbacks for every env value (see L-1) and fail the build when required variables are missing.
4. Optional: purge history with `git filter-repo`. Rotating the keys is what actually fixes the leak.
5. Add a secret scanner (gitleaks or GitHub secret scanning with push protection) to CI.

---

### H-1 — Login CSRF / session injection via `?token=` on any page
**Severity:** High · **OWASP:** A07 Identification & Authentication Failures · **CWE-352, CWE-384**

**Where** — [src/app/components/Footer/FooterBottom.tsx:43](src/app/components/Footer/FooterBottom.tsx:43), [:107-121](src/app/components/Footer/FooterBottom.tsx:107)

The footer is rendered on every page. If the URL has a `token` query parameter, the footer writes it straight into `persist:auth` as the bearer token, calls `customerProfile`, and redirects to `/my-account/orders`.

**Attack**
1. The attacker sends a victim `https://<site>/?token=<attacker's own token>`.
2. The victim is now silently signed into the attacker's account.
3. Anything the victim enters (addresses, phone, order history, saved quotes) lands in the attacker's account.

**Collision with password reset:** the reset page uses `?token=…&email=…` ([ResetPassword.tsx:26](src/app/components/Auth/ResetPassword.tsx:26)). The footer therefore also sends the **password-reset token** to `web/customer-profile` as a bearer token.

**Fix**
- Remove the generic `?token=` handler.
- If an SSO or impersonation hand-off is needed, use a short-lived, single-use code on a dedicated route (for example `/auth/callback?code=…`) that the backend exchanges for a session.
- Clear the code from the URL with `history.replaceState` right after reading it.

---

### H-2 — reCAPTCHA is never verified
**Severity:** High · **OWASP:** A04 Insecure Design / A07 · **CWE-804, CWE-307**

**Where** — [Signup.tsx:108](src/app/components/Auth/Signup.tsx:108), [ContactUs.tsx:65](src/app/components/ContactUs/ContactUs.tsx:65), [AddReviewModal.tsx:86](src/app/components/modal/AddReviewModal.tsx:86), [BulkInquiryModal.tsx](src/app/components/modal/BulkInquiryModal.tsx), [WebContactForm.tsx](src/app/components/Product/WebContactForm.tsx)

Each form only checks `if (!captchaToken)` on the client. The token is **never added to the request payload**. A search for `captchaToken`, `g-recaptcha-response` and `recaptcha_token` finds no outgoing use. The backend therefore can't verify it, and a direct API call skips the CAPTCHA entirely.

**Impact:** bot sign-ups, fake reviews, contact-form and bulk-inquiry spam, and mail-bombing through magic-link or forgot-password if those endpoints aren't rate-limited.

**Fix**
- Send the token (for example `recaptchaToken`) with every protected request.
- Verify it server-side with the **rotated** secret, checking `success`, `hostname` and, for v3, `action` and `score`.
- Add backend rate limiting on `customer-login`, `user/register`, `auth/send-magic-link`, forgot-password and contact endpoints. Astra will test brute force on login.

---

### H-3 — Client-supplied prices, discounts and charge amount at checkout
**Severity:** High (**Needs backend check**) · **OWASP:** A04 Insecure Design · **CWE-602, CWE-840**

**Where** — [CheckoutComponent.tsx:821-841](src/app/components/CheckoutComponent/CheckoutComponent.tsx:821) (`web/stripe/pay`), [:744-790](src/app/components/CheckoutComponent/CheckoutComponent.tsx:744) (`web/orders/place-order`)

The browser sends:

| Endpoint | Client-controlled fields |
|---|---|
| `web/stripe/pay` | `amount` (minor units), `currency` |
| `web/orders/place-order` | `discountAmount`, `manualDiscount`, `shippingCost`, `shippingData` (whole rate object), per-destination `shippingCost`, `currency`, `paymentIntentId`, `ipAddress`, `orderPlaceCountry`, `userType` |

The payment is created **before** the order exists, and the two are linked only by a `paymentIntentId` the client hands back.

**What Astra will try**
1. Intercept `web/stripe/pay` and set `amount: 50`, then place the order normally.
2. Send `discountAmount` or `manualDiscount` larger than the subtotal.
3. Edit `shippingData` to pick a premium service with `cost: 0`.
4. Reuse one successful `paymentIntentId` for several `place-order` calls.
5. Set `userType: "guest"` while authenticated, or the reverse.
6. Spoof `ipAddress` and `orderPlaceCountry` to skip fraud or geo rules.

**Required backend behaviour** (please confirm each one)
- Compute the charge amount from server-side cart, prices, coupon, tax and shipping rate. **Ignore** client `amount`, `discountAmount`, `shippingCost` and `shippingData`. Accept only a coupon code and a shipping service ID.
- Only accept `manualDiscount` if it was issued server-side and is bound to that customer or quote.
- On `place-order`, fetch the PaymentIntent from Stripe and check `status=succeeded`, `amount`, `currency`, and that it hasn't been used before. Better: create the order first and the PaymentIntent from it, and confirm through Stripe webhooks.
- Take the client IP from the trusted proxy header on the server, not from the request body.

---

### H-4 — Stored XSS: backend HTML rendered without sanitization (and entity-decoded first)
**Severity:** High · **OWASP:** A03 Injection · **CWE-79**

**Where**
- [ProductOverview.tsx:12,45](src/app/components/Product/ProductOverview.tsx:45) — product description
- [ProductList.tsx:45,120,239](src/app/components/Product/ProductList.tsx:120) — category description and FAQ
- [SingleBlog.tsx:6,20](src/app/components/SingleBlog/SingleBlog.tsx:20) — blog body
- [DynamicWebPage.tsx:12,55](src/app/components/Product/DynamicWebPage.tsx:55) — CMS pages
- [BlogHome.tsx:15-19](src/app/components/Home/BlogHome.tsx:15) — `innerHTML` assigned on a detached element, which still fires `<img onerror>`

Each of these runs `decode()` from `html-entities` and then passes the result to `dangerouslySetInnerHTML`. **Decoding defeats backend escaping:** if the backend stores `&lt;img src=x onerror=…&gt;` safely, the frontend turns it back into live markup.

Product descriptions are a high-risk source: they're often bulk-imported from vendor feeds, eBay or BigCommerce, given the image hosts in `next.config.ts`.

**Impact:** script runs on product, category and blog pages. Combined with M-2 (token in `localStorage`) and M-1 (no CSP), that means account takeover. On checkout, it means card-field skimming.

**Fix**
- Sanitize with DOMPurify in one shared helper, like `src/lib/bannerStyles.ts` already does for banners. Use an explicit allowlist and allow `<iframe>` only for YouTube/Vimeo hosts.
- Run it server-side (`isomorphic-dompurify`) so the HTML is clean before hydration.
- In `BlogHome.stripHtml`, use `DOMParser` (which doesn't run scripts) instead of `innerHTML`.

---

### H-5 — Arbitrary backend-supplied JavaScript injected on every page, including checkout
**Severity:** High · **OWASP:** A08 Software & Data Integrity Failures · **CWE-829, CWE-94** · **PCI DSS v4.0 req. 6.4.3 / 11.6.1**

> **Status: open.** A fix was implemented and then reverted. Scripts configured at the time of the audit (`GET web/scripts/get-script`): #20 an inline test `console.log` on checkout, #2 an inline FAQ helper on all pages (duplicates logic already in `ProductList.tsx`), and #1 an empty URL script.

**Where** — [src/components/ScriptInjector.tsx](src/components/ScriptInjector.tsx), mounted in [layout.tsx:77](src/app/layout.tsx:77)

Scripts fetched from the backend are executed as inline code, or loaded from any `src` URL, on `allPages`, `storefront`, `checkout` and `orderConfirmation`. There is no allowlist, no SRI and no CSP. Anyone with admin-panel access, or anyone who compromises it or the API, can drop a card skimmer onto the payment page (a Magecart-style attack).

PCI DSS 4.0 (mandatory since 2025-03-31) requires an inventory, an authorization and a justification for every script on payment pages, plus tamper detection (6.4.3 and 11.6.1). Stripe Elements iframes reduce scope but don't remove this requirement for the hosting page.

**Fix**
- Don't inject admin scripts on `/checkout*`, or allow only a reviewed set there.
- Keep a host allowlist for `src` scripts (GTM, GA, Trustpilot and so on) and drop inline `script_content`, or require a hash approved at review time.
- Enforce with a CSP `script-src` allowlist (see M-1). Protect the admin "scripts" feature with MFA and audit logging.

---

### H-6 — Order details retrievable by order number (possible IDOR)
**Severity:** High (**Needs backend check**) · **OWASP:** A01 Broken Access Control · **CWE-639**

**Where**
- `/checkout/order-information/[orderId]` ([OrderInformation.tsx:77](src/app/components/CheckoutComponent/OrderInformation.tsx:77)) — public route, works for guests, keyed only by the order number in the URL.
- [src/lib/api/order.ts:5](src/lib/api/order.ts:5) — `POST web/orders/order-details` sent with **no Authorization header**, only `orderId`. It also logs the full order to the console (see L-3).

If order numbers are sequential or guessable, anyone can enumerate other customers' names, addresses, phone numbers, emails and order contents. This is the first thing a pentester tries.

**Evidence (2026-10-15, made-up order IDs only; no real order data was fetched)**
- `GET web/orders/order-detail?orderId=does-not-exist-123` with **no Authorization header** returns `404 {"message":"Order not found."}`, not `401`. The endpoint looks orders up for unauthenticated callers, so a real order number very likely returns that order. Not yet confirmed with a real order.
- `POST web/orders/order-details` without auth is rejected, but through a crash page (see H-7).

**Fix (backend)**
- Require that the authenticated customer owns the order.
- For guests, require a random, unguessable access token issued at checkout (for example `/order-information/{orderNumber}?k={128-bit token}`), or the order email plus the number. The frontend then passes that key along, which is a small change.
- ~~Remove or authenticate the unauthenticated `order-details` frontend call.~~ Done: `src/lib/api/order.ts` was unused and has been removed.

---

### H-7 — Production backend runs with Laravel debug mode on
**Severity:** High · **OWASP:** A05 Security Misconfiguration · **CWE-209, CWE-215** · *Found during remediation; backend*

**Evidence:** `POST https://backend.sparemicro.com/api/web/orders/order-details` with no token returns an HTML Laravel debug page, not a JSON 401. It shows:
- the exception `RouteNotFoundException: Route [login] not defined`,
- the server path `/var/www/nts-backend`,
- vendor and framework file paths and the stack trace.

The same crash is the likely cause of `web/customer-profile` returning **500** (not 401) for an invalid token.

**Why it matters:** debug pages give attackers the stack, file layout and package versions. Depending on configuration, they can also expose environment variables, database errors and request data. It also shows that unauthenticated API requests aren't handled cleanly.

**Fix (backend)**
- Set `APP_DEBUG=false` and `APP_ENV=production` on the production server, then clear the config cache (`php artisan config:clear`).
- Make unauthenticated API requests return JSON `401` instead of redirecting to the `login` route. That means overriding `redirectTo` / `unauthenticated` in the auth middleware or exception handler for `api/*`.
- Check every environment the public can reach (staging included) for the same setting.

---

### M-1 — No HTTP security headers (no CSP, HSTS, framing or referrer policy)
**Severity:** Medium · **OWASP:** A05 Security Misconfiguration · **CWE-693, CWE-1021**

[next.config.ts:88-109](next.config.ts:88) sets only `Cache-Control`. The following are missing: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options` / `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`.

- **Clickjacking:** account settings, address book and checkout can be framed.
- **No CSP:** nothing contains H-4 or H-5.
- **No Referrer-Policy:** tokens in URLs leak (M-5).

Astra will flag every one of these on day one.

**Fix (starting point; tune the CSP in report-only mode first)**
```ts
{ source: "/:path*", headers: [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
  { key: "Content-Security-Policy-Report-Only", value:
    "default-src 'self'; script-src 'self' 'nonce-…' https://js.stripe.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://widget.trustpilot.com; frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com/recaptcha/ https://widget.trustpilot.com; connect-src 'self' https://backend.sparemicro.com https://api.stripe.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
]}
```
Use per-request nonces through middleware so you can avoid `'unsafe-inline'` for scripts.

---

### M-2 — Bearer token and customer PII stored in `localStorage`
**Severity:** Medium · **OWASP:** A07 / A04 · **CWE-922**

The token is written in three places: `persist:auth` (redux-persist) and the separate `token`, `tokenExpiry` and `user` keys ([authSlice.ts:220-222](src/redux/slices/authSlice.ts:220), [:267-269](src/redux/slices/authSlice.ts:267)). The checkout form, including name, address, phone and email, is also saved to `localStorage` ([CheckoutComponent.tsx:1454](src/app/components/CheckoutComponent/CheckoutComponent.tsx:1454)).

Any script on the origin can read all of it: XSS from H-4, injected scripts from H-5, or a compromised third-party tag. Logout doesn't invalidate the token server-side; it only clears local state.

**Fix**
- **Target architecture:** move to an `HttpOnly; Secure; SameSite=Lax` session cookie set by a Next.js route handler (backend-for-frontend), with the API called server-side or through a same-origin proxy. Add CSRF protection on state-changing calls.
- **Short term:**
  - Keep only one copy of the token.
  - Shorten its lifetime and rotate it.
  - Add a backend `logout` call that revokes it.
  - Stop persisting checkout PII, or use `sessionStorage` and clear it after the order.

---

### M-3 — JSON-LD `<script>` blocks can be broken out of
**Severity:** Medium · **OWASP:** A03 · **CWE-79**

[blogs/[id]/page.tsx:239-261](src/app/blogs/[id]/page.tsx:239), [[slug]/page.tsx:152](src/app/[slug]/page.tsx:152) (`backendSchema` comes directly from the backend), [Breadcrumb.tsx:37](src/app/components/Product/Breadcrumb.tsx:37)

`JSON.stringify` doesn't escape `<`. A product, blog title or schema value containing `</script><script>…` closes the tag and runs code during SSR.

**Fix:** `JSON.stringify(obj).replace(/</g, "\\u003c")`, in a shared `toJsonLd()` helper.

---

### M-4 — Guest cart session ID is predictable and never rotated at login
**Severity:** Medium · **CWE-330, CWE-384**

[FooterBottom.tsx:103](src/app/components/Footer/FooterBottom.tsx:103) builds the session ID with `Math.random().toString(36).substring(2, 15)`. That's about 60 bits from a non-cryptographic PRNG, sent as `X-Session-ID` to identify guest carts and to transfer them at login (`web/cart/transfer`). It's only rotated after an order, not at login.

If the backend trusts this header alone, guest carts (and anything tied to them, such as quotes and applied discounts) can be guessed or fixed.

**Fix:** use `crypto.randomUUID()`, have the backend issue the ID (preferably as a cookie), rotate it on login and register, and bind the transfer to the authenticated user.

---

### M-5 — Sensitive tokens in URLs, leaked through Referer and logs
**Severity:** Medium · **OWASP:** A04 · **CWE-598**

- Password reset: `?token=…&email=…`
- Magic link: `?actiontoken=…`
- Auto-login: `?token=…` (H-1)
- Saved quote: `?quoteToken=…`, interpolated **unencoded** ([Signin.tsx:60](src/app/components/Auth/Signin.tsx:60), [Cart.tsx:46](src/app/components/Cart/Cart.tsx:46))

These pages also load third-party scripts (H-5, Trustpilot, reCAPTCHA), and there's no `Referrer-Policy`. Full URLs, tokens included, can leak to third parties and end up in analytics and CDN logs.

**Fix**
- Set `Referrer-Policy: strict-origin-when-cross-origin`; for `/auth/*`, use `no-referrer`.
- Strip tokens from the URL with `history.replaceState` once read.
- Make reset and magic-link tokens single-use and short-lived (backend).
- Wrap `quoteToken` in `encodeURIComponent`.

---

### M-6 — Unauthenticated proxy API routes: parameter injection, plaintext HTTP, no rate limiting
**Severity:** Medium · **OWASP:** A10 SSRF (limited) / A05 · **CWE-918, CWE-319, CWE-770**

| Route | Issue |
|---|---|
| [api/detect-country](src/app/api/detect-country/route.ts:5) | Takes the IP from the client-spoofable `x-forwarded-for` and puts it **unencoded into the URL path** of an outbound request (`ip=1.1.1.1?fields=…%23` rewrites the query). Uses plaintext `http://ip-api.com`, whose free tier forbids commercial use and is limited to 45 req/min. Anyone can exhaust it, which breaks geo-detection for real users. |
| [api/city-zip](src/app/api/city-zip/route.ts:15) | `country` is **not URL-encoded**, so `?country=US%26username=other` injects parameters. Plaintext `http://api.geonames.org`. GeoNames username hard-coded. |
| [api/get-ip](src/app/api/get-ip/route.ts) | Echoes a spoofable header back. Its output is then sent as the order's `ipAddress` (H-3). |

**Fix**
- Validate `country` against `/^[A-Z]{2}$/` and the IP with `net.isIP()`.
- Use HTTPS providers.
- Read the client IP only from the platform's trusted header (on Vercel, `x-real-ip` or `request.ip`, and only behind the platform proxy).
- Move the GeoNames username to an env variable.
- Add rate limiting (Vercel WAF, Upstash, or similar).

---

### M-7 — Vulnerable / unmaintained dependencies and no committed lockfile
**Severity:** Medium · **OWASP:** A06 Vulnerable & Outdated Components · **CWE-1104**

`npm audit` against a freshly resolved tree: **8 high, 1 moderate, 0 critical.**

| Package | Severity | Path | Notes |
|---|---|---|---|
| `xlsx@0.18.5` | High | direct | Prototype pollution (GHSA-4r6h-8v6p-xvw6) and ReDoS (GHSA-5pgg-2g8v-p4x9). **No fix on npm**: SheetJS now publishes only on its own CDN. **Not imported anywhere in `src/`, so remove it** (along with `@types/xlsx`). |
| `postcss` (bundled in `next`) | High | transitive | `</style>` XSS and sourceMappingURL file-read advisories. Build-time only, low runtime risk. Clears with a Next upgrade. |
| `next-sitemap` → `fast-glob` → `micromatch` → `braces` | High | build-time | ReDoS / stack exhaustion. Build-time only. |
| `eslint-config-next` → same chain | High | dev only | Pin to `15.5.x` to match `next`. |

- **No lockfile in the repo.** `package-lock.json` was deleted in `bb02494`, even though `.gitignore` explicitly keeps it. Every install resolves fresh `^` ranges, so builds aren't reproducible and a compromised upstream release would be picked up automatically (supply-chain risk). **Restore and commit `package-lock.json`, and use `npm ci` in CI and Vercel.**
- Both `dompurify` and `isomorphic-dompurify` are installed; one is enough.
- Add Dependabot or Renovate and run `npm audit --omit=dev` in CI.

---

### Low / Informational

| ID | Finding | Location | Recommendation |
|---|---|---|---|
| L-1 | Hard-coded fallbacks for API URL, store ID, site key and a **Stripe test key** (`pk_test_…`). A production deploy with a missing env var silently runs Stripe in test mode, or talks to the wrong backend. | [axiosInstance.ts:11-26](src/lib/axiosInstance.ts:11) | Fail closed: throw at build or start when required vars are missing. `chargeInSelectedCurrency` uses `\|\| true`, so the string `"false"` still reads as true. |
| L-2 | `x-pathname` header can be spoofed for paths containing a dot. The middleware matcher excludes `.*\..*`, so for those paths `[slug]/page.tsx` reads the client-sent header and puts it into the backend URL `get-product-by-url${slug}` (server-side request path manipulation). | [middleware.ts:12](src/middleware.ts:12), [[slug]/page.tsx:35](src/app/[slug]/page.tsx:35), [products.ts:50](src/lib/api/products.ts:50) | Derive the path from `params.slug` instead of a request header, or always overwrite or strip the header. `encodeURIComponent` each segment. |
| L-3 | Full order details (PII) logged to the console; 47 `console.*` calls in `src/`. | [order.ts:18](src/lib/api/order.ts:18) | Remove the log. Add `compiler.removeConsole` for production (keep `error`). |
| L-4 | `next.config.ts` image config allows **any HTTPS host** (`hostname: "*"`), plain-HTTP IP `3.12.69.112`, and `dangerouslyAllowSVG`. Currently inert because `unoptimized: true`, but turning optimization back on would make `/_next/image` an open proxy serving SVG. | [next.config.ts:13,43-53](next.config.ts:43) | Remove the wildcard, the HTTP IP and `dangerouslyAllowSVG`. |
| L-5 | Password policy is 7 characters plus alphanumeric (client-side only). | [ResetPassword.tsx:124](src/app/components/Auth/ResetPassword.tsx:124) | Backend: at least 8 (NIST 800-63B recommends 8+ with a breached-password check) and account lockout or throttling. |
| L-6 | Route protection exists only on the client (`ProtectedLayout`). That's fine as UX, but it isn't access control. | [ProtectedLayout.tsx](src/app/components/ProtectedPages/ProtectedLayout.tsx) | Confirm every `web/customer*`, `web/orders*` and address endpoint enforces auth and ownership on the backend. |
| L-7 | Saved-quote ownership is checked on the client (`auth.user.id != response.customer.id`) *after* the quote has been fetched by token. | [Cart.tsx:36](src/app/components/Cart/Cart.tsx:36) | Backend must enforce ownership, and the quote token must be unguessable. |
| L-8 | `eslint.ignoreDuringBuilds: true`; 12 `target="_blank"` links without `rel="noopener"` (modern browsers mitigate this); placeholder `http://localhost:3000` share URL in `WishlistView`; `robots: noindex` in root metadata (confirm this is meant to be staging-only). | [next.config.ts:71](next.config.ts:71), [WishlistView.tsx:53](src/app/components/wishlist/WishlistView.tsx:53), [layout.tsx:18](src/app/layout.tsx:18) | Housekeeping. |

---

## 3. What's already done well

- Banner HTML is sanitized server-side with DOMPurify ([bannerStyles.ts](src/lib/bannerStyles.ts)). This is the pattern to reuse for H-4.
- Card data goes through Stripe Elements (`createPaymentMethod`). Raw PANs never touch this app.
- The 401 interceptor logs out once, flushes persisted state and avoids redirect loops ([axiosInstance.ts:28-95](src/lib/axiosInstance.ts:28)).
- Login redirects go only to fixed internal paths; no open redirect was found.
- `.env*` is git-ignored now, `productionBrowserSourceMaps: false`, and `serverActions.allowedOrigins` is locked down.
- Next.js is on the patched 15.5 line (15.5.27 installed).

---

## 4. Remediation plan

| Priority | Item | Owner | Effort |
|---|---|---|---|
| **P0 – now** | C-1 rotate reCAPTCHA secrets and remove hard-coded secrets | FE + DevOps | < 1 h |
| **P0** | H-1 remove the `?token=` auto-login | FE | 1 h |
| **P0** | H-3 / H-6 confirm backend price recomputation, PaymentIntent binding and order ownership | BE | 1–3 d |
| **P0** | H-7 turn off `APP_DEBUG` in production; JSON 401 for unauthenticated API calls | BE + DevOps | < 1 h |
| **P1 – before pentest** | H-2 send and verify the CAPTCHA token, plus rate limiting | FE + BE | 0.5–1 d |
| **P1** | H-4 / M-3 shared `sanitizeHtml()` and `toJsonLd()` helpers | FE | 0.5 d |
| **P1** | M-1 security headers (CSP report-only, then enforce) | FE | 1 d |
| **P1** | H-5 script allowlist and no admin scripts on checkout | FE + BE | 0.5 d |
| **P1** | M-7 commit the lockfile, remove `xlsx`, add Dependabot and a CI audit | FE | 1 h |
| **P2** | M-2 move auth to an HttpOnly cookie (BFF) | FE + BE (architecture) | 3–5 d |
| **P2** | M-4, M-5, M-6, L-1 … L-8 | FE | 1–2 d |

---

## 5. Questions for the backend / architecture review

1. Does `web/stripe/pay` ignore the client `amount` and compute the total from the server-side cart? Does `place-order` re-check the PaymentIntent's amount, status and single use with Stripe?
2. Are `discountAmount`, `manualDiscount`, `shippingCost` and `shippingData` from the request ever persisted or used in totals?
3. Are order numbers sequential? What authorizes `web/orders/order-detail` and `web/orders/order-details` for guests?
4. Does any endpoint verify reCAPTCHA today? (Nothing in the frontend sends a token.)
5. Are bearer tokens revocable, and what is their lifetime? Is there a logout endpoint?
6. Which admin roles can edit "scripts", product descriptions and CMS pages? Is MFA enforced?
7. Are login, register, magic-link and forgot-password rate-limited per IP and per account?

---

*This report covers the frontend repository at the commit above. It isn't a penetration test. The findings marked "Needs backend check" should be confirmed against the backend code or verified during the Astra engagement.*
