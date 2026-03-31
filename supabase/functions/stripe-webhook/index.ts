import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = new Uint8Array(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("Webhook verified. Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;

    if (!email) {
      return new Response("No email found", { status: 400 });
    }

    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error listing users:", usersError);
      return new Response("Failed to load users", { status: 500 });
    }

    const user = usersData.users.find(
      (u) => (u.email || "").toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      console.log("User not found:", email);
      return new Response("User not found", { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: "supreme" })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update role:", updateError);
      return new Response("Failed to update role", { status: 500 });
    }

    console.log("User upgraded to Supreme:", email);
  }

  return new Response("ok", { status: 200 });
});