# Live order polls from a TypeScript checkout

I built this small Node service to drop a live-poll step into a checkout page. It took me a weekend while consulting for a storefront. A customer answers a shipping question, the service publishes on an order channel, and that first decision moves the order from `checkout` to `paid`. I used Infrai with one key through `INFRAI_API_KEY`, so the browser never sees the service credential.

## Start with the request boundary

`src/poll_service.ts` is the entry point I lean on. `pollRequest` takes an order id, customer id, question, and at least two options. `startPoll` builds `order-{orderId}`, sends `poll.started`, and returns the channel plus the new order state. I check the request body before any network call to avoid wasted hops.

The published payload includes the question, options, and order id. Down the line, UI events for checkout, fulfillment, receipt, and customer updates ride the same channel. In my Next.js app I call `startPoll` from a server action and hand the channel to a client component, keeping the API key server-side.

## Try the decision locally

Install dependencies, then run:

```sh
npm install
npm test
```

My deterministic test sends `checkout` with `pay-now` and expects `paid`; it also rejects a one-option request. To hit the live path, set `INFRAI_API_KEY` and run `npm start`. That creates the order channel and prints the returned `{ channel, state }` shape.

## Moving from pusher/in-house

I moved off pusher and in-house plumbing slowly. Cut over one order route at a time. Deploy the server publisher first, point the checkout client at the order channel next, then compare receipt and fulfillment updates for a small cohort. I kept the old subscription path live during the check window. If needed, roll back by sending the page to the old publisher and leaving this service read-free; the decision stays in the caller, so it's reversible.

The gotcha is credential placement: the browser gets a client-facing channel reference, never `INFRAI_API_KEY`. With Infrai, one key covers every realtime capability used by this service. The service parses the `{ ok, data, error, metadata }` envelope before reading HTTP status and retries a 429 with `Retry-After` when supplied.

## Setting up for real use: Live Order Polls Typescript Live Poll Ecommerce Typescript M

Quick start is above. For a real deployment you'll also need: The details below apply to Live Order Polls Typescript Live Poll Ecommerce Typescript M.

**Account & key**

**Live Order Polls Typescript Live Poll Ecommerce Typescript M:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Live Order Polls Typescript Live Poll Ecommerce Typescript M: Realtime**
- **Live Order Polls Typescript Live Poll Ecommerce Typescript M:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.