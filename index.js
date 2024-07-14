let weather = {
    "apiKey": "12a91b67a2733a92633dbaf49329676d",
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid=" 
            + this.apiKey
        )
        .then((response) => response.json()) 
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;        
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = 
        "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp) + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        //document.querySelector(".weather").classList.remove("loading");
        //document.body.style.backgroundImage = "url('https://unsplash.com/blog/content/images/size/w1600/2024/03/" + name + "')"

        fetch(`https://api.unsplash.com/search/photos?query=${name}&client_id=gNHDVHswieakNAH4XZPPISuAYFMXYWfk43WHa4Ptnko`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
            }
        });
    },
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        weather.search();
    }
})