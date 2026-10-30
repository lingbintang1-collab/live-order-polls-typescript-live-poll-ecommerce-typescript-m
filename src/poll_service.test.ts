import test from "node:test";
import assert from "node:assert/strict";
import { nextOrderState, pollRequest } from "./poll_service.ts";

test("a pay-now poll advances checkout to paid", () => {
  assert.equal(nextOrderState("checkout", "pay-now"), "paid");
  assert.equal(nextOrderState("checkout", "review"), "checkout");
});

test("the request boundary rejects a poll with fewer than two options", () => {
  assert.throws(() => pollRequest.parse({ orderId: "o", customerId: "c", question: "Q", options: ["only"] }));
});
