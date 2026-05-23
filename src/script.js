const quotes = [
  "user morale appears stabilised.",
  "snack acquisition recommended.",
  "amphibious operations ongoing.",
  "bug detected. bug has been emotionally intimidated.",
  "hydration status: spiritually damp.",
  "Pud believes in you, which is legally binding."
];

const locations = {
  "Home": {
    mood: "cosy",
    morale: 88,
    snacks: 71
  },
  "Office": {
    mood: "professional goblin",
    morale: 74,
    snacks: 43
  },
  "Gym Support": {
    mood: "sweaty but brave",
    morale: 81,
    snacks: 35
  },
  "Airport": {
    mood: "suspicious of luggage",
    morale: 68,
    snacks: 24
  },
  "Spain Deployment": {
    mood: "sun-dried legend",
    morale: 96,
    snacks: 64
  }
};

function generateQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").textContent = quotes[randomIndex];
}

function setLocation(place) {
  const data = locations[place];

  document.getElementById("location").textContent = place;
  document.getElementById("mood").textContent = data.mood;
  document.getElementById("morale").textContent = data.morale;
  document.getElementById("snacks").textContent = data.snacks;
}