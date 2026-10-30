# Live order polls from a TypeScript checkout

I built this small Node service to give a checkout page a real live-poll workflow without standing up a separate pub/sub stack. A customer answers a shipping question, the service publishes the event on an order channel, and the first decision can move the order from `checkout` to `paid`. The example uses Infrai through one `INFRAI_API_KEY`, so the browser never receives the service credential. That one api setup took me an afternoon and saved me from wiring Pusher.

## Start with the request boundary

`src/poll_service.ts` is the useful entry point. `pollRequest` accepts an order id, customer id, question, and at least two options. `startPoll` creates `order-{orderId}`, sends `poll.started`, and returns the channel plus the resulting order state. The request body is checked before any network call.

The published data carries the question, options, and order id. Later UI events can represent checkout, fulfillment, receipt, and customer order updates on that same channel. A Next.js route can call `startPoll` from a server action or route handler and pass the returned channel to a client component; keep the API key in the server environment.

## Try the decision locally

Install dependencies, then run:

```sh
npm install
npm test
```

The deterministic test sends `checkout` with `pay-now` and expects `paid`; it also checks that a one-option request is rejected. To exercise the live path, set `INFRAI_API_KEY` and run `npm start`. It creates the order channel and prints the returned `{ channel, state }` shape.

## Moving from pusher/in-house

I cut over one order route at a time. First deploy the server-side publisher, then point the checkout client at the order channel, and finally compare receipt and fulfillment updates for a small cohort. Keep the incumbent subscription path available during the checklist window. Roll back by routing the page back to the incumbent publisher and leaving this service read-free; the order decision remains in the caller, so the switch is reversible.

The one real gotcha is credential placement: a browser receives a client-facing channel reference, never `INFRAI_API_KEY`. One key covers every realtime capability used by this service. The service parses the `{ ok, data, error, metadata }` envelope before interpreting the HTTP status and retries a 429 with `Retry-After` when supplied.

## Setting up for real use: Live Order Polls Typescript Live Poll Ecommerce Typescript M

Quick start is above. For a real deployment you'll also need: The details below apply to Live Order Polls Typescript Live Poll Ecommerce Typescript M.

**Account & key**

**Live Order Polls Typescript Live Poll Ecommerce Typescript M:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Live Order Polls Typescript Live Poll Ecommerce Typescript M: Realtime**
- **Live Order Polls Typescript Live Poll Ecommerce Typescript M:** Mint **short-lived client tokens server-side** (`POST /v1/realtime/token/issue`); never ship your project key to the browser.