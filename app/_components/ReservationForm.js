"use client";

import { differenceInDays } from "date-fns";
import { useState } from "react";
import { useReservation } from "./ReservationContext";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range?.from;
  const endDate = range?.to;
  const numNights = (startDate && endDate) ? differenceInDays(endDate, startDate) : 0;
  
  // Member discount only applies if logged in
  const isEthiopian = user?.nationality === "Ethiopia";
  const isFeaturedCabin = id >= 14 && id <= 21;
  const memberPrice = regularPrice - discount;
  const residentPrice = Math.round(memberPrice * 0.9);
  const unitPrice = (user && isEthiopian && isFeaturedCabin) ? residentPrice : (user ? memberPrice : regularPrice);
  const cabinPrice = numNights * unitPrice;
  const EX_RATE = 120; // 1 USD = 120 ETB
  const totalETB = (cabinPrice || 0) * EX_RATE;

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice: cabinPrice || 0,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  async function handleAction(formData) {
    setError(null);
    setIsPending(true);
    
    try {
      const result = await createBookingWithData(formData);
      
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
        return;
      }

      // If "Pay Now" was checked, initialize Chapa
      if (formData.get("payNow") === "on") {
        const res = await fetch("/api/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: result.bookingId,
            amount: totalETB,
            email: user.email,
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ").slice(1).join(" ") || "Guest",
          }),
        });

        const data = await res.json();
        if (data.data?.checkout_url) {
          window.location.href = data.data.checkout_url;
        } else {
          // Specific error handling for API/Key failures
          throw new Error("Payment gateway is in maintenance. Please contact support.");
        }
      } else {
        // Standard flow: Redirect to Thank You page
        window.location.href = "/cabins/thankyou";
      }
    } catch (err) {
      setError(err.message);
      setIsPending(false);
    }
  }

  return (
    <div className="">
      <div className="bg-primary-900 text-primary-300 px-6 py-4 flex items-center justify-between shadow-sm">
        <p className="text-sm font-medium">Logged in</p>
        <div className="flex gap-2 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-6 w-6 rounded-full border border-primary-700"
            src={user.image}
            alt={user.name}
          />
          <p className="text-sm font-semibold text-accent-400">{user.name.split(" ")[0]}</p>
        </div>
      </div>

      <form
        action={handleAction}
        className="bg-primary-950/30 py-6 px-6 text-sm flex gap-4 flex-col"
      >
        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-100 px-4 py-3 rounded-md text-sm">
             {error}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="numGuests" className="font-medium text-primary-200">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-4 py-2 bg-primary-900 border border-primary-800 text-primary-100 w-full shadow-sm rounded-md focus:ring-1 focus:ring-accent-500 focus:border-accent-500 outline-none transition-all"
            required
          >
            <option value="" key="">Select guests...</option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Concierge Upsells */}
        <div className="space-y-3 pt-2 border-t border-primary-800/50">
           <h4 className="text-xs font-bold text-accent-500 uppercase tracking-widest">Concierge Add-ons</h4>
           <div className="flex items-center gap-2">
              <input type="checkbox" id="breakfast" name="hasBreakfast" className="h-4 w-4 bg-primary-900 border-primary-700 rounded text-accent-500 focus:ring-offset-primary-950" />
              <label htmlFor="breakfast" className="text-primary-300 select-none cursor-pointer">Organic Breakfast Basket (+$30)</label>
           </div>
           <div className="flex items-center gap-2">
              <input type="checkbox" id="shuttle" name="hasShuttle" className="h-4 w-4 bg-primary-900 border-primary-700 rounded text-accent-500 focus:ring-offset-primary-950" />
              <label htmlFor="shuttle" className="text-primary-300 select-none cursor-pointer">Airport Private Shuttle (+$120)</label>
           </div>
        </div>

        {/* Chapa Payment Option */}
        <div className="space-y-3 pt-4 border-t border-primary-800/50 bg-primary-900/40 p-4 rounded-xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <input type="checkbox" id="payNow" name="payNow" className="h-5 w-5 bg-primary-800 border-primary-700 rounded text-accent-500 focus:ring-offset-primary-950" />
                 <label htmlFor="payNow" className="text-accent-100 font-bold select-none cursor-pointer text-base">Pay with Telebirr / Cards</label>
              </div>
              <span className="bg-accent-500/10 text-accent-500 text-[10px] font-black px-2 py-1 rounded uppercase">Instant Confirmation</span>
           </div>
           {startDate && endDate && (
             <div className="flex justify-between items-center bg-primary-950/50 p-3 rounded-lg border border-accent-500/20">
                <p className="text-primary-400 text-xs uppercase tracking-widest">Estimated Total (ETB)</p>
                <p className="text-accent-100 font-serif text-xl font-bold">{totalETB.toLocaleString()} ETB</p>
             </div>
           )}
           <p className="text-[10px] text-primary-500 leading-tight">Secure payment via Chapa. Support for Telebirr, CBEBirr, and local credit cards.</p>
        </div>

        <div className="space-y-1">
          <label htmlFor="observations" className="font-medium text-primary-200">
            Special requests?
          </label>
          <textarea
            name="observations"
            id="observations"
            rows={2}
            className="px-4 py-2 bg-primary-900 border border-primary-800 text-primary-100 w-full shadow-sm rounded-md focus:ring-1 focus:ring-accent-500 outline-none transition-all"
            placeholder="Allergies, pets, etc..."
          />
        </div>

        <div className="flex justify-end pt-2">
          {!(startDate && endDate) ? (
            <p className="text-primary-400 text-sm italic">
              Select dates to book
            </p>
          ) : (
            <button 
              disabled={isPending}
              className="bg-accent-500 px-8 py-4 text-primary-950 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-primary-800 disabled:text-primary-500 w-full rounded-md flex items-center justify-center gap-3"
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
                  <span>Securing your Oasis...</span>
                </>
              ) : "Reserve Luxury Stay"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
