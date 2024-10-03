function calculateTotalProductValue(products) {
  return products.reduce((acc, product) => acc + product.price, 0);
}

function calculateOdds(products, alpha) {
  // Calculate the denominator sum for normalization
  const totalScaledValue = products.reduce(
    (acc, product) => acc + Math.pow(product.price, -alpha),
    0
  );

  // Normalize and calculate odds for each product
  return products.map((product) => {
    const odds = (Math.pow(product.price, -alpha) / totalScaledValue) * 100;
    return { ...product, odds: odds.toFixed(2) };
  });
}

function calculateExpectedValue(productsWithOdds) {
  // Calculate the expected value of the items in the box
  return productsWithOdds.reduce(
    (acc, product) => acc + (product.price * parseFloat(product.odds)) / 100,
    0
  );
}

function calculateBoxPrice(expectedValue, houseEdge) {
  // Box price based on the expected value and the house edge
  return (expectedValue / (1 - houseEdge)).toFixed(2);
}

function assignTicketRanges(productsWithOdds, totalTickets = 1000000) {
  let currentMinTicket = 0;
  return productsWithOdds.map((product) => {
    const ticketRangeSize = (totalTickets * parseFloat(product.odds)) / 100;
    const ticketRange = {
      min: Math.floor(currentMinTicket),
      max: Math.floor(currentMinTicket + ticketRangeSize),
    };
    currentMinTicket += ticketRangeSize;
    return { ...product, ticketRange };
  });
}

function generateRandomTicket(totalTickets = 1000000) {
  return Math.floor(Math.random() * totalTickets);
}

function determineWinner(productsWithTicketRanges, randomTicket) {
  return productsWithTicketRanges.find((product) => {
    return (
      randomTicket >= product.ticketRange.min &&
      randomTicket < product.ticketRange.max
    );
  });
}

// Main function to create the mystery box
function createMysteryBox(products, alpha, houseEdge) {
  const totalProductValue = calculateTotalProductValue(products);
  const productsWithOdds = calculateOdds(products, alpha);
  const expectedValue = calculateExpectedValue(productsWithOdds);
  const boxPrice = calculateBoxPrice(expectedValue, houseEdge);
  const productsWithTicketRanges = assignTicketRanges(productsWithOdds);

  const randomTicket = generateRandomTicket();
  const winner = determineWinner(productsWithTicketRanges, randomTicket);

  return {
    boxPrice,
    products: productsWithTicketRanges,
    expectedValue: expectedValue.toFixed(2),
    randomTicket,
    winner,
  };
}

// Example usage
const products = [
  { name: "Product1", price: 500 },
  { name: "Product2", price: 20 },
  { name: "Product3", price: 0.25 },
];

const alpha = 2; // Exponential scaling factor
const houseEdge = 0.3; // 30% house edge

const mysteryBox = createMysteryBox(products, alpha, houseEdge);
console.log(mysteryBox);
