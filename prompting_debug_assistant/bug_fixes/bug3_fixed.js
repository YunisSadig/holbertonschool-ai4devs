// Bug 3: apply a promotion only when both requirements are met.

function finalPrice(subtotal, isMember) {
  if (typeof subtotal !== "number" || subtotal < 0) {
    throw new Error("Subtotal must be a non-negative number");
  }

  let discount = 0;
  // Promotion requires membership AND a subtotal of at least $100.
  if (isMember && subtotal >= 100) {
    discount = subtotal * 0.10;
  }

  return Number((subtotal - discount).toFixed(2));
}

console.log("Member, $80:", finalPrice(80, true));
console.log("Guest, $120:", finalPrice(120, false));
console.log("Member, $120:", finalPrice(120, true));
