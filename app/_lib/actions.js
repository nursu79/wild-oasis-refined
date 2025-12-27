"use server";

import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateGuest(prevState, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const fullName = formData.get("fullName");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  // 1) Validate Full Name (Optional bit of polish)
  if (!fullName || fullName.length < 3) {
    return { error: "Please provide a valid full name (minimum 3 characters)" };
  }

  // 2) Validate National ID (Country-specific logic)
  const validationRules = {
    'TR': /^[1-9][0-9]{10}$/, // Turkey (Example: 11 digits)
    'US': /^\d{3}-\d{2}-\d{4}$/, // US SSN (Example)
    'GB': /^[A-Z]{2}\d{6}[A-Z]$/, // UK NI (Example)
  };

  const regex = validationRules[countryFlag] || /^[a-zA-Z0-9]{6,12}$/;
  if (!regex.test(nationalID)) {
    return { error: `Invalid ID format for ${nationality}. Please provide a valid Passport or Citizen ID.` };
  }

  // Use snake_case keys to match Supabase/Postgres columns
  const updateData = { 
    name: fullName, 
    nationality, 
    countryflag: countryFlag, 
    nationalid: nationalID 
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error("Supabase Update Error:", error);
    return { error: "Verification failed. Please check your data or try again later." };
  }

  revalidatePath("/account/profile");
  revalidatePath("/account");
  return { success: true, message: "Profile and Identity updated successfully" };
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  /* Concierge Upsell handling */
  const hasBreakfast = formData.get("hasBreakfast") === "on";
  const hasShuttle = formData.get("hasShuttle") === "on";
  
  let finalObservations = formData.get("observations").slice(0, 1000);
  if (hasBreakfast) finalObservations += " | (Added: Organic Breakfast)";
  if (hasShuttle) finalObservations += " | (Added: Private Shuttle)";

  /* Use exact lowercase column names matching the updated DB schema */
  const newBooking = {
    startdate: bookingData.startDate,
    enddate: bookingData.endDate,
    numnights: bookingData.numNights,
    cabinprice: bookingData.cabinPrice,
    cabinid: bookingData.cabinId,
    guestid: session.user.guestId,
    numguests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasprice: hasShuttle ? 120 : 0, 
    totalprice: bookingData.cabinPrice + (hasBreakfast ? bookingData.numNights * 30 : 0) + (hasShuttle ? 120 : 0),
    ispaid: false,
    hasbreakfast: hasBreakfast,
    status: "unconfirmed",
  };

  const { data, error } = await supabase.from("bookings").insert([newBooking]).select().single();

  if (error) {
    console.error("Supabase Booking Error:", error);
    return { error: `Booking could not be created: ${error.message}` }; 
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  revalidatePath("/account");

  // Return bookingId to client so it can decide whether to redirect to Chapa or Thank You page
  return { bookingId: data.id };
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
  revalidatePath("/account");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numguests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");
  revalidatePath("/account");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function createReview(cabinId, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in to leave a review");

  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment");

  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
  if (!comment || comment.length < 10) throw new Error("Comment must be at least 10 characters");

  const newReview = { 
    cabin_id: cabinId, 
    guest_id: session.user.guestId, 
    rating, 
    comment 
  };

  const { error } = await supabase.from("reviews").insert([newReview]);

  if (error) {
    console.error(error);
    throw new Error("Review could not be submitted");
  }

  revalidatePath(`/cabins/${cabinId}`);
  return { success: true };
}
