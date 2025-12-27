"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  if (!range || !range.from || !range.to) return false;
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();

  // 1. Centralized Safety: Always work with a defined object
  const safeRange = range || { from: undefined, to: undefined };
  
  // 2. Determine display range based on booking status
  const displayRange = isAlreadyBooked(safeRange, bookedDates) ? { from: undefined, to: undefined } : safeRange;

  const { regularPrice, discount } = cabin;
  
  // 3. Safe property access for differenceInDays
  const numNights = (displayRange?.from && displayRange?.to) 
    ? differenceInDays(displayRange.to, displayRange.from) 
    : 0;
    
  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between p-0">
      <DayPicker
        className="pt-6 pb-6 place-self-center rdp-luxury"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
        modifiersClassNames={{
          selected: "bg-accent-500 text-primary-900",
          range_middle: "bg-accent-500/20 !text-accent-200",
          range_start: "bg-accent-500 text-primary-900 rounded-l-full",
          range_end: "bg-accent-500 text-primary-900 rounded-r-full",
          disabled: "text-primary-700 line-through opacity-50",
          today: "font-bold text-accent-400 border border-accent-400/50 rounded-full"
        }}
      />

      <div className="flex items-center justify-between px-6 bg-accent-500 text-primary-900 h-[60px] border-t border-primary-800">
        <div className="flex items-baseline gap-2 text-sm">
           {/* Price Info */}
           <div className="flex flex-col items-start leading-tight">
             <span className="text-xs uppercase font-bold opacity-80">Rate <span className="opacity-50">/night</span></span>
             <span className="text-xl font-bold font-serif">${regularPrice - discount}</span>
           </div>
           
           {numNights > 0 ? (
                <>
                   <span className="mx-1 text-primary-900/50">|</span>
                   <div className="flex flex-col items-start leading-tight">
                        <span className="text-xs uppercase font-bold opacity-80">Total</span>
                        <span className="text-xl font-bold font-serif">${cabinPrice}</span>
                   </div>
                </>
           ) : null}
        </div>

        {(safeRange?.from || safeRange?.to) ? (
          <button
            className="border border-primary-900/30 hover:bg-primary-900/10 py-1 px-3 text-xs font-bold uppercase tracking-wider rounded transition-colors"
            onClick={resetRange}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
