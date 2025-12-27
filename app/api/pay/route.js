import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { bookingId, amount, email, firstName, lastName } = await req.json();

    if (!bookingId || !amount || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Unique Reference: Generate using Booking ID and Timestamp to prevent duplicates
    const tx_ref = `B-${bookingId}-${Date.now()}`;
    
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(amount), // Ensure amount is a string
        currency: "ETB",        // Force ETB for Ethiopian payment methods
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-chapa?tx_ref=${tx_ref}`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account/reservations`,
        customization: {
          title: "Wild Oasis Stay",
          description: `Payment for Booking ${bookingId}`,
        },
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({ 
        data: { checkout_url: data.data.checkout_url } 
      });
    } else {
      console.error("Chapa Initialization Error:", data);
      return NextResponse.json({ 
        error: data.message || "Invalid API Key or Configuration", 
        details: data
      }, { status: 401 });
    }
  } catch (err) {
    console.error("Chapa API Route Crash:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
