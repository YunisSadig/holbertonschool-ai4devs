// Order service: sum the prices of the items in an order.
// fetchPrice simulates a network call that resolves after a short delay.
function fetchPrice(sku) {
  const prices = { apple: 3, pear: 4, plum: 5 };
  return new Promise((resolve) => setTimeout(() => resolve(prices[sku]), 10));
}

// Intended: resolve to the total price of all skus (e.g. 12 for the three above).
async function orderTotal(skus) {
  let total = 0;
  for (const sku of skus) {
    const price = fetchPrice(sku);
    total += price;
  }
  return total;
}

module.exports = { orderTotal, fetchPrice };

if (require.main === module) {
  orderTotal(['apple', 'pear', 'plum']).then((total) => {
    console.log('total:', total); // intended: total: 12
  });
}
