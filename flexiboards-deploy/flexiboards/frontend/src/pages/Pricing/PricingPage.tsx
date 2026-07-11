const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    features: ["3 boards", "1 workspace", "Personal mode", "Basic To‑Do"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: ["10 boards", "5 workspaces", "Business mode", "Export"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 79,
    features: ["Unlimited boards", "Unlimited workspaces", "Teams & roles"],
  },
];

export default function PricingPage() {
  const checkout = async (tierId: string) => {
    const res = await fetch("/api/billing/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-[#0b0b12] border border-purple-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-2">{tier.name}</h2>
            <p className="text-3xl font-bold mb-4">${tier.price}/mo</p>
            <ul className="mb-4 space-y-1 text-sm text-gray-300">
              {tier.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <button
              className="w-full bg-purple-600 py-2 rounded-lg"
              onClick={() => checkout(tier.id)}
            >
              Choose {tier.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
