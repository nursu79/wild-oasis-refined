import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

/////////////
// GET

export async function getCabin(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity:maxcapacity, regularPrice:regularprice, discount, image, description, latitude, longitude, arrival_instructions, proximity_stats")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  if (data) {
    data.image = data.image.startsWith("/") || data.image.startsWith("http") ? data.image : `/${data.image}`;
  }

  return data;
}

export async function getReviews(cabinId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, guests(fullName:name, image)")
    .eq("cabin_id", cabinId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getAverageRating(cabinId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("cabin_id", cabinId);

  if (error || !data.length) return 0;

  const avg = data.reduce((acc, cur) => acc + cur.rating, 0) / data.length;
  return Math.round(avg * 10) / 10;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice:regularprice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity:maxcapacity, regularPrice:regularprice, discount, image, reviews(rating)")
    .order("name");

  if (error) {
    console.error("Supabase error (getCabins):", error);
    throw new Error("Cabins could not be loaded");
  }

  // Calculate average rating for each cabin with defensive defaults
  const cabins = data.map(cabin => {
    const reviewsArr = cabin.reviews || [];
    const ratings = reviewsArr.map(r => r.rating);
    const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    return {
      ...cabin,
      image: cabin.image.startsWith("/") || cabin.image.startsWith("http") ? cabin.image : `/${cabin.image}`,
      average_rating: Math.round(avg * 10) / 10,
      num_reviews: ratings.length
    };
  });

  // console.log("FETCHED CABINS WITH PROCESSED IMAGES:", cabins.map(c => c.image));
  return cabins;
};

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  const { data, error } = await supabase
    .from("guests")
    .select(
      "id, fullName:name, email, nationality, nationalID:nationalid, countryFlag:countryflag"
    )
    .eq("email", email)
    .single();

  if (error) {
    console.error("Supabase Error (getGuest):", error.message);
  }

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select(
      "*, cabinId:cabinid, guestId:guestid, numNights:numnights, numGuests:numguests, cabinPrice:cabinprice, extrasPrice:extrasprice, totalPrice:totalprice, hasBreakfast:hasbreakfast, isPaid:ispaid, startDate:startdate, endDate:enddate"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate:startdate, endDate:enddate, numNights:numnights, numGuests:numguests, totalPrice:totalprice, guestId:guestid, cabinId:cabinid, status, cabins(name, image)"
    )
    .eq("guestid", guestId)
    .order("startdate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinid", cabinId)
    .or(`startdate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startdate),
        end: new Date(booking.enddate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  // await new Promise((res) => setTimeout(res, 5000));

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function hasGuestStayedInCabin(guestId, cabinId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id")
    .eq("guestid", guestId)
    .eq("cabinid", cabinId)
    .eq("status", "checked-out")
    .single();

  return !!data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag,alpha2Code"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}
/*
export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}
*/
/////////////
// UPDATE

/*
// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
