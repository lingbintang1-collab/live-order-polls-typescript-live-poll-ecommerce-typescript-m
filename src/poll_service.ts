import { z } from "zod";
import { InfraiClient } from "./infrai_client.ts";

// The public capability name for this workflow is infrai.realtime.publish.

export const pollRequest = z.object({
  orderId: z.string().min(1),
  customerId: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2)
});
export type PollRequest = z.infer<typeof pollRequest>;

export function nextOrderState(current: "checkout" | "paid" | "fulfilled", vote: string): "checkout" | "paid" | "fulfilled" {
  if (current === "checkout" && vote === "pay-now") return "paid";
  if (current === "paid" && vote === "ship-now") return "fulfilled";
  return current;
}

export async function startPoll(input: PollRequest, client = new InfraiClient(process.env.INFRAI_API_KEY ?? "")) {
  const request = pollRequest.parse(input);
  const channel = `order-${request.orderId}`;
  await client.request("/v1/realtime/channel/create", "POST", { channel, type: "private", vendor: "infrai" });
  const data = JSON.stringify({ question: request.question, options: request.options, order_id: request.orderId });
  await client.request("/v1/realtime/publish", "POST", { channel, event: "poll.started", data, account_id: request.customerId });
  return { channel, state: nextOrderState("checkout", request.options[0]) };
}

export async function runExample() {
  const input = { orderId: "order-1042", customerId: "customer-7", question: "How should we move this order?", options: ["pay-now", "review"] };
  console.log(await startPoll(input));
}

if (import.meta.main) await runExample();
