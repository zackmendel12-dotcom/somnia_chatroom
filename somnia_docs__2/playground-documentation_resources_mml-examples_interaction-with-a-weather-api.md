# Interaction With A Weather API | Playground Documentation | Somnia Docs

Copy

  1. [Resources](/playground-documentation/resources)
  2. [MML Examples](/playground-documentation/resources/mml-examples)



# Interaction With A Weather API

![](https://docs.somnia.network/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2FkC3S4jjM9eI5TkJDPhBZ%2Fblobs%2FRuMOcWp5v1WgqcEi2TyV%2Fimage.png&width=768&dpr=4&quality=100&sign=4586ce4b&sv=2)

Copy
    
    
    <m-label id="latitude" content="latitude" y="4.5" font-size="50" width="5.5" alignment="center" height="1" color="#dddddd"></m-label>
    <m-label id="longitude" content="longitude" y="3.5" font-size="50" width="5.5" alignment="center" height="1" color="#dddddd"></m-label>
    <m-label id="windspeed" content="wind speed" x="0" y="2.5" font-size="60" width="11" alignment="center" height="1" color="#dddddd"></m-label>
    <m-label id="temperature" content="temperature" x="0" y="1.5" font-size="60" width="11" alignment="center" height="1" color="#dddddd"></m-label>
    <m-label id="weather" content="weather" x="0" y="0.5" font-size="60" width="11" alignment="center" height="1" color="#ddddff"></m-label>
    
    <script>
      const latLabel = document.getElementById("latitude");
      const longLabel = document.getElementById("longitude");
      const windSpeedLabel = document.getElementById("windspeed");
      const temperatureLabel = document.getElementById("temperature");
      const weatherLabel = document.getElementById("weather");
    
      const weatherCode = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Light snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Light snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        97: "Thunderstorm",
        98: "Thunderstorm",
        99: "Thunderstorm",
      };
    
      async function fetchAPIData() {
        const latitude = 51.5;
        const longitude = 0.11;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`,
        );
        const json = await res.json();
        latLabel.setAttribute("content", `Latitude: ${latitude}°N`);
        longLabel.setAttribute("content", `Longitude: ${longitude}°W`);
        const floatTemp = parseFloat(json["current_weather"].temperature);
        const color = floatTemp > 15 ? (floatTemp > 25 ? "#ffcccc" : "#ccffcc") : "#ccccff";
        const temperature = `${floatTemp}°C`;
        temperatureLabel.setAttribute("content", `Temp: ${temperature}`);
        temperatureLabel.setAttribute("color", color);
        const windSpeed = `${json["current_weather"].windspeed} km/h`;
        windSpeedLabel.setAttribute("content", `Wind: ${windSpeed}`);
        const weather = parseInt(json["current_weather"].weathercode);
        weatherLabel.setAttribute("content", weatherCode[weather]);
      }
      fetchAPIData();
    
      setInterval(() => {
        fetchAPIData();
      }, 5 * 60 * 1000);
    </script>

[PreviousA 3D Video Player](/playground-documentation/resources/mml-examples/a-3d-video-player)[NextA Simple Clock](/playground-documentation/resources/mml-examples/a-simple-clock)
