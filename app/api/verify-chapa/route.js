import { NextResponse } from "next/server";
import { supabase } from "@/app/_lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  try {
    // 1. Verify with Chapa
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.status === "success" && data.data.status === "success") {
      // 2. Extract Booking ID from tx_ref (Format: B-ID-Timestamp)
      const bookingId = tx_ref.split("-")[1];

      // 3. Update Supabase
      const { error } = await supabase
        .from("bookings")
        .update({ ispaid: true, status: "confirmed" })
        .eq("id", bookingId);

      if (error) {
        console.error("Supabase Update Error:", error);
        return NextResponse.json({ error: "Booking update failed" }, { status: 500 });
      }

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/account/reservations?status=success`);
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/account/reservations?status=failed`);
    }
  } catch (err) {
    console.error("Chapa Verification Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
