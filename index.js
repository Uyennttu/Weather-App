let city = "Gold Coast";
let units = "metric";
let weather = {
    apiKey: "12a91b67a2733a92633dbaf49329676d",
    fetchWeather: function (city, units) {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${this.apiKey}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Invalid City Name");
                }
                return response.json();
            })
            .then((data) => {
                this.displayWeather(data);
                document.querySelector(".error").classList.add("hidden");
                document.querySelector(".card").classList.remove("hidden");
                document.querySelector(".weather").classList.remove("hidden");
            })
            .catch((error) => {
                document.querySelector(".error").classList.remove("hidden");
                document.querySelector(".weather").classList.add("hidden");
                document.querySelector(".card").classList.remove("hidden");
            });
    },
    convertCountryCode: function (country) {
        let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        return regionNames.of(country);
    },
    convertTimeStamp: function (timestamp, timezone) {
        const convertTimezone = timezone / 3600; // convert seconds to hours
        const date = new Date(timestamp * 1000);
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
            hour12: true,
        };
        return date.toLocaleString("en-US", options);
    },
    displayWeather: function (data) {
        const { name } = data;
        const { country } = data.sys;
        const { dt: datetime, timezone } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, temp_min, temp_max } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerHTML = `${name}, ${this.convertCountryCode(country)}`;
        document.querySelector(".datetime").innerHTML = this.convertTimeStamp(datetime, timezone);
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerHTML = description;
        document.querySelector(".temp").innerHTML = Math.round(temp) + (units === "metric" ? "°C" : "°F");
        document.querySelector(".minmax").innerHTML = `
        <p>Min: ${Math.round(temp_min)}${units === "metric" ? "°C" : "°F"}</p>
        <p>Max: ${Math.round(temp_max)}${units === "metric" ? "°C" : "°F"}</p>`;
        document.querySelector(".humidity p").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector(".wind p").innerHTML = `Wind Speed: ${speed} ${units === "imperial" ? "mph" : "km/h"}`;
        document.querySelector(".error").classList.add("hidden");

        //Fetch background image from Unsplash
        fetch(`https://api.unsplash.com/search/photos?query=${name}&client_id=gNHDVHswieakNAH4XZPPISuAYFMXYWfk43WHa4Ptnko`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const imageUrl = data.results[0].urls.regular;
                    document.body.style.backgroundImage = `url('${imageUrl}')`;
                }
            });
    },
    search: function () {
        const cityInput = document.querySelector(".search-bar").value.trim();
        if (cityInput) {
            city = cityInput;
            this.fetchWeather(city, units);
            document.querySelector(".search-bar").value = "";
        } else {
            document.querySelector(".error").classList.remove("hidden");
            document.querySelector(".weather").classList.add("hidden");
        };
    }
};
//change unit
document.querySelector(".celcius").addEventListener("click", () => {
    if (units !== "metric") {
        units = "metric";
        weather.fetchWeather(city, units);
    }
});
document.querySelector(".farenheit").addEventListener("click", () => {
    if (units !== "imperial") {
        units = "imperial";
        weather.fetchWeather(city, units);
    }
});
// Initial weather fetch
weather.fetchWeather(city, units);

// Form submit listener
document.querySelector(".form-search").addEventListener("submit", function (event) {
    event.preventDefault();
    weather.search();
});


