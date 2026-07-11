import React, { useState } from "react";

export default function ContactDetailsForm() {
  const [type, setType] = useState<"business" | "personal">("business");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    businessName: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-[#0b0b12] border border-purple-700 rounded-xl p-6 text-white">
      <div className="flex gap-3 mb-4">
        <select
          className="bg-[#111] px-3 py-2 rounded-lg border border-purple-500"
          value={type}
          onChange={(e) => setType(e.target.value as "business" | "personal")}
        >
          <option value="business">Business</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      {type === "business" && (
        <input
          className="w-full mb-3 bg-[#111] px-3 py-2 rounded-lg"
          placeholder="Business name"
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
      )}

      <input
        className="w-full mb-3 bg-[#111] px-3 py-2 rounded-lg"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          className="bg-[#111] px-3 py-2 rounded-lg"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          className="bg-[#111] px-3 py-2 rounded-lg"
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => update("mobile", e.target.value)}
        />
      </div>

      <input
        className="w-full mb-3 bg-[#111] px-3 py-2 rounded-lg"
        placeholder="Street address"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
      />

      <div className="grid grid-cols-3 gap-3">
        <input
          className="bg-[#111] px-3 py-2 rounded-lg"
          placeholder="City"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
        <input
          className="bg-[#111] px-3 py-2 rounded-lg"
          placeholder="State"
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
        />
        <input
          className="bg-[#111] px-3 py-2 rounded-lg"
          placeholder="ZIP"
          value={form.zip}
          onChange={(e) => update("zip", e.target.value)}
        />
      </div>
    </div>
  );
}
