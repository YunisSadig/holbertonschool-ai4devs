// Bug 4: safely display a customer's city when address data is absent.

function formatDestination(customer) {
  const name = customer.name.trim();
  const city = customer.address?.city?.toLowerCase() ?? "unknown";
  return `${name} - ${city}`;
}

function printDestinations(customers) {
  for (const customer of customers) {
    console.log(formatDestination(customer));
  }
}

const customers = [
  { name: "Ayla", address: { city: "BAKU" } },
  { name: "Murad" },
  { name: "Leyla", address: { city: "BRNO" } },
];

printDestinations(customers);
