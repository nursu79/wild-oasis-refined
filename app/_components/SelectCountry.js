import { getCountries } from "@/app/_lib/data-service";

// Let's imagine your colleague already built this component 😃

async function SelectCountry({ defaultCountry, name, id, className }) {
  const countries = await getCountries();
  const flag =
    countries.find((country) => country.name === defaultCountry)?.flag ?? "";

  return (
    <div className="relative group">
      <select
        name={name}
        id={id}
        defaultValue={`${defaultCountry}%${countries.find(c => c.name === defaultCountry)?.alpha2Code || ""}`}
        className={`${className} appearance-none cursor-pointer hover:bg-primary-900/60 transition-colors shadow-inner`}
      >
        <option value="">Select country...</option>
        {countries.map((c) => (
          <option key={c.name} value={`${c.name}%${c.alpha2Code}`} className="bg-primary-950 text-white">
            {c.name}
          </option>
        ))}
      </select>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-accent-500 opacity-50 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}

export default SelectCountry;
