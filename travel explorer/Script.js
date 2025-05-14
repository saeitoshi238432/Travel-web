const WEATHER_API_KEY = 'f4ae7d2b27e43e62402ab4b58a38174d'; // ← Replace with your key
const UNSPLASH_ACCESS_KEY = '136Tnyi2aYmon3XQPsZegGvtrONuHuEbE7lVngA438s'; // ← Replace with your key

const infoDisplay = document.getElementById("infoDisplay");
const moreInfoDisplay = document.getElementById("moreInfoDisplay");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", searchPlace);

async function searchPlace() {
  const place = document.getElementById("placeInput").value.trim();
  if (!place) return;

  infoDisplay.innerHTML = "Loading...";
  moreInfoDisplay.innerHTML = "Loading...";

  const weather = await fetchWeather(place);
  const generalImages = await fetchImages(place, 2);
  const details = await fetchWikipediaDetails(place);
  const moreImages = await fetchImages(`${place} culture`, 4);
  const foodImage = await fetchImages(`${place} food`, 1);
  const personalityImage = await fetchImages(`${place} famous person`, 2);
  const landmarkImage = await fetchImages(`${place} landmarks`, 2);

  infoDisplay.innerHTML = `
    <h2>${place}</h2>
    <p>${weather}</p>
    <div class="images">${generalImages}</div>
  `;

  moreInfoDisplay.innerHTML = `
    <h3>Famous Food:</h3>
    <p>${details.food}</p>
    <div class="images">${foodImage}</div>

    <h3>Famous Places:</h3>
    <p>${details.places}</p>
    <div class="images">${landmarkImage}</div>

    <h3>Famous Personalities:</h3>
    <p>${details.personalities}</p>
    <div class="images">${personalityImage}</div>

    <h3>General Cultural Images:</h3>
    <div class="images">${moreImages}</div>
  `;
}

async function fetchWeather(place) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${WEATHER_API_KEY}`);
    const data = await res.json();

    return `
      🌡 Temperature: ${data.main.temp}°C<br>
      ☁️ Condition: ${data.weather[0].description}<br>
      💧 Humidity: ${data.main.humidity}%
    `;
  } catch (err) {
    console.error("Weather error:", err);
    return "Weather data not available.";
  }
}

async function fetchImages(query, count = 3) {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await res.json();
    return data.results.map(img => `<img src="${img.urls.small}" alt="${query}" />`).join("");
  } catch (err) {
    console.error("Unsplash error:", err);
    return "<p>No images found.</p>";
  }
}

async function fetchWikipediaDetails(place) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place)}`);
    const data = await res.json();
    const lowerPlace = place.toLowerCase();

    // Example data override for popular places
    const presets = {
      "japan": {
        food: "Sushi, Ramen, Tempura",
        places: "Mount Fuji, Kyoto Temples, Tokyo Skytree",
        personalities: "Hayao Miyazaki, Yoko Ono, Naomi Osaka"
      },
      "france": {
        food: "Baguette, Croissant, Coq au vin",
        places: "Eiffel Tower, Louvre Museum, French Riviera",
        personalities: "Napoleon Bonaparte, Zinedine Zidane, Coco Chanel"
      },
      "india": {
        food: "Butter Chicken, Biryani, Dosa",
        places: "Taj Mahal, Red Fort, Jaipur City Palace",
        personalities: "Mahatma Gandhi, A. R. Rahman, Virat Kohli"
      },
      "usa": {
        food: "Burgers, Hot Dogs, Apple Pie",
        places: "Statue of Liberty, Grand Canyon, Times Square",
        personalities: "Barack Obama, Elon Musk, Taylor Swift"
      }
    };

    if (presets[lowerPlace]) {
      return presets[lowerPlace];
    } else {
      return {
        food: `Popular dishes in ${place} may include local specialties and traditional cuisine.`,
        places: `Famous locations in ${place} often include historical landmarks, nature spots, and cultural hubs.`,
        personalities: `Well-known people from ${place} include cultural, political, and artistic figures.`
      };
    }

  } catch (err) {
    console.error("Wiki error:", err);
    return {
      food: "Information not available.",
      places: "Information not available.",
      personalities: "Information not available."
    };
  }
}
