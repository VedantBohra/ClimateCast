const apiKey = "f24323361f65f89bd4a1809d64ef2877"
const apiTimeKey = "35a6450100ea478d8bbecabf3afbb7be"
const apiUVKey = "openuv-1fjc8orlzvn1o9q-io"
const apiforecastKey = "SVM6V85DKQP5M37EEQ6Y7T3QN"

const inputHome = document.querySelector('.search input');
const inputSearch = document.querySelector('.search i')
const homeUI = document.querySelector('.weather')
const mainUI = document.querySelector('.forecast')
const errorUI = document.querySelector('.errBox')
const mainSearch = document.querySelector('.mainSearch input')
const mainErrorButton = document.querySelector('.errBoxButton')

const mainUIHomeButton = document.querySelector('.home')

let cityName = ''

inputSearch.addEventListener('click',()=>{
    cityName = inputHome.value  
    updateCityName()
    weatherRender()
})

inputHome.addEventListener('keydown',(event)=>{
    if(event.key == "Enter"){
        cityName = inputHome.value  
        updateCityName()
        weatherRender()
    }
})

mainSearch.addEventListener('keydown',(event)=>{
    if(event.key == "Enter"){
        cityName = mainSearch.value  
        updateCityName()
        weatherRender()
    }
})

// Every time we click on the home button redirect it to the home page
function backToHomeError(){
    mainErrorButton.addEventListener('click',()=>{
        homeUI.style.display = "flex"
        errorUI.style.display = "none"
        mainUI.style.display = "none"        
    })
}

// Every time we click on the home button redirect it to the home page
mainUIHomeButton.addEventListener('click',()=>{
    errorUI.style.display = "none"
    homeUI.style.display = "flex"
    mainUI.style.display = "none"
    console.log(mainUIHomeButton, errorUI, homeUI, mainUI)        
})


// function to change from home UI to main UI once the user have entered a city for the first time 
function weatherRender(){
    if(updateCityName){
        homeUI.style.display = "none"
        mainUI.style.display = "block"
    }
}

// async function to fetch geo coordinates 
async function fetchGeoData(){
    //  Gathering the geo locations parameter from geocoding API
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    const geoResponse = await fetch(geoUrl) // response object is obtained through await
    // check if response is ok
    if(!geoResponse.ok){    
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        throw new Error("Did not got any response from API try again")
    }

    // Parse the JSON data
    const data = await geoResponse.json()

    // check if the Data received is empty or not
    if(data.length>0){
        return data[0] // return only the required data which is present at array first Index 
    }
    else{
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log('No data found for the specified city') // if data object is empty
    }
}

// async function to take latitude and longitude as parameters to fetch current weather data
async function fetchWeatherData(lat,lon){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const currWeatherResponse = await fetch(weatherUrl) // wait for the response
    
    // to check whether the api has responded
    if(!currWeatherResponse.ok){
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        throw new Error(console.log('Response was not ok'))
    }

    const data = await currWeatherResponse.json()

    // to check if data object is not empty
    if(data){
        return data // return the data object
    }
    else{
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log('No data found for the specified city')
    }    
}

// function to fetch UV index
async function fetchUVIndex(lat,lon){
    const UVUrl = `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`

    const currentUVIndex = await fetch(UVUrl,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': apiUVKey
        }
    })

    if(!currentUVIndex.ok){
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        throw new Error('response was not ok')
    }

    const data = await currentUVIndex.json()

    if(data){
        console.log(data)
        return data
    }
    else{
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log(`Data is not present for this place`)
    }
}

// function to fetch current date and time from coordinates
async function fetchCurrentTime(lat,lon){
    const timeURL = `https://api.ipgeolocation.io/timezone?apiKey=${apiTimeKey}&lat=${lat}&long=${lon}`
    const currentTimeResponse = await fetch(timeURL)

    // to check whether the api has responded
    if(!currentTimeResponse.ok){
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        throw new Error(console.log('The date and time api has not responded'))
    }
    
    const timeData = await currentTimeResponse.json()
    
    // checking if currentTime object is not empty
    if(timeData){
        return timeData
    }
    else{
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log('NO data was found for the specified coordinates')
    }
}

// function to fetch the forecast data 
async function fetchForecastData(lat,lon,date1,date2){
    const forecastURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/${date1}/${date2}?key=${apiforecastKey}&include=days&elements=temp,conditions`
    const futureForecast = await fetch(forecastURL)

    if(!futureForecast.ok){
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        throw new Error(console.log(`data was not found for this city`))
    }
    
    const forecastData = await futureForecast.json()

    if(forecastData){
        return forecastData
    }
    else{
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log(`No data was found for the specified coordinates`)
    } 
}


// Grabbing the elements for updation
const realTemp = document.querySelector('.currentTemp')
const realFeelsLike = document.querySelector('.feelsLikeVal')
const realPressure = document.querySelector('.pressureVal')
const realHumidity = document.querySelector('.humidValue')
const realMinTemp = document.querySelector('.minVal')
const realMaxTemp = document.querySelector('.maxVal')
const realSunriseTime = document.querySelector('.sunriseTime')
const realSunsetTime = document.querySelector('.sunsetTime')
const realWindSpeed = document.querySelector('.speed')
const realWeatherCondition = document.querySelector('.conditionText')
const realWeatherConditionIcon = document.querySelector('.condition')

const realPlace = document.querySelector('.place')
const realTime = document.querySelector('.time')
const realTimeZoneDate = document.querySelector('.timezonedate')

const realUVIndex = document.querySelector('.uvVal')

const realForecastDay1 = document.querySelector('.futureDay1Val')
const realForecastDay2 = document.querySelector('.futureDay2Val')
const realForecastDay3 = document.querySelector('.futureDay3Val')
const realForecastDay4 = document.querySelector('.futureDay4Val')
const realForecastDay5 = document.querySelector('.futureDay5Val')

const realDay1OfTheWeek = document.querySelector('.futureWeekDay1')
const realDay2OfTheWeek = document.querySelector('.futureWeekDay2')
const realDay3OfTheWeek = document.querySelector('.futureWeekDay3')
const realDay4OfTheWeek = document.querySelector('.futureWeekDay4')
const realDay5OfTheWeek = document.querySelector('.futureWeekDay5')

const realClearDay = document.querySelector('.clearDay')
const realClearNight = document.querySelector('.clearNight')
const realCloudyDay = document.querySelector('.cloudyDay')
const realCloudyNight = document.querySelector('.cloudyNight')
const realRainy = document.querySelector('.rainy')
const realSnowy = document.querySelector('.snowy')
const realThunder = document.querySelector('.thunder')
const realAtmospheric = document.querySelector('.atmospheric')

const realFutureConditionClearDay1 = document.querySelector('.clearDay-1')
const realFutureConditionClearNightDay1 = document.querySelector('.clearNight-1')
const realFutureConditionCloudyDay1 = document.querySelector('.cloudyDay-1')
const realFutureConditionCloudyNightDay1 = document.querySelector('.cloudyNight-1')
const realFutureConditionRainyDay1 = document.querySelector('.rainy-1')
const realFutureConditionSnowyDay1 = document.querySelector('.snowy-1')
const realFutureConditionThunderDay1 = document.querySelector('.thunder-1')
const realFutureConditionAtmosphericDay1 = document.querySelector('.atmospheric-1')

const realFutureConditionClearDay2 = document.querySelector('.clearDay-2')
const realFutureConditionClearNightDay2 = document.querySelector('.clearNight-2')
const realFutureConditionCloudyDay2 = document.querySelector('.cloudyDay-2')
const realFutureConditionCloudyNightDay2 = document.querySelector('.cloudyNight-2')
const realFutureConditionRainyDay2 = document.querySelector('.rainy-2')
const realFutureConditionSnowyDay2 = document.querySelector('.snowy-2')
const realFutureConditionThunderDay2 = document.querySelector('.thunder-2')
const realFutureConditionAtmosphericDay2 = document.querySelector('.atmospheric-2')

const realFutureConditionClearDay3 = document.querySelector('.clearDay-3')
const realFutureConditionClearNightDay3 = document.querySelector('.clearNight-3')
const realFutureConditionCloudyDay3 = document.querySelector('.cloudyDay-3')
const realFutureConditionCloudyNightDay3 = document.querySelector('.cloudyNight-3')
const realFutureConditionRainyDay3 = document.querySelector('.rainy-3')
const realFutureConditionSnowyDay3 = document.querySelector('.snowy-3')
const realFutureConditionThunderDay3 = document.querySelector('.thunder-3')
const realFutureConditionAtmosphericDay3 = document.querySelector('.atmospheric-3')

const realFutureConditionClearDay4 = document.querySelector('.clearDay-4')
const realFutureConditionClearNightDay4 = document.querySelector('.clearNight-4')
const realFutureConditionCloudyDay4 = document.querySelector('.cloudyDay-4')
const realFutureConditionCloudyNightDay4 = document.querySelector('.cloudyNight-4')
const realFutureConditionRainyDay4 = document.querySelector('.rainy-4')
const realFutureConditionSnowyDay4 = document.querySelector('.snowy-4')
const realFutureConditionThunderDay4 = document.querySelector('.thunder-4')
const realFutureConditionAtmosphericDay4 = document.querySelector('.atmospheric-4')

const realFutureConditionClearDay5 = document.querySelector('.clearDay-5')
const realFutureConditionClearNightDay5 = document.querySelector('.clearNight-5')
const realFutureConditionCloudyDay5 = document.querySelector('.cloudyDay-5')
const realFutureConditionCloudyNightDay5 = document.querySelector('.cloudyNight-5')
const realFutureConditionRainyDay5 = document.querySelector('.rainy-5')
const realFutureConditionSnowyDay5 = document.querySelector('.snowy-5')
const realFutureConditionThunderDay5 = document.querySelector('.thunder-5')
const realFutureConditionAtmosphericDay5 = document.querySelector('.atmospheric-5')

// main function calls fetchGeoData and fetchWeatherData
async function updateCityName(){

    try{
        // wait for geoData return by called function 
        const geoData = await fetchGeoData() 
        // Destructure of geoData creates to new variable lat and long
        const {lat,lon} = geoData 
        // take lat and lon as parameters to fetch weather data for it 
        const weatherData = await fetchWeatherData(lat,lon) 
        // fetch current time of place
        const currentTime = await fetchCurrentTime(lat,lon)
        // fetch current uv index value
        const currentUVIndex = await fetchUVIndex(lat,lon)
        
        // Current Temperature
        const tempInCel = parseFloat(((weatherData.main.temp) - 273).toFixed(0))
        realTemp.innerText = `${tempInCel}°C`

        console.log(tempInCel)

        // Current feelsLikeVal
        const feelsLikeInCel = parseFloat(((weatherData.main.feels_like) - 273).toFixed(0))
        realFeelsLike.innerText = `${feelsLikeInCel}°C`
        console.log(feelsLikeInCel)
        
        // Current Pressure
        const pressureVal = weatherData.main.pressure
        realPressure.innerText = `${pressureVal}hPa`
        console.log(pressureVal)

        // Current Humidity level
        const humidityVal = weatherData.main.humidity
        realHumidity.innerText = `${humidityVal}%`
        console.log(humidityVal)

        // Current min max temp
        const minTempVal = parseFloat(((weatherData.main.temp_min) - 273).toFixed(0))
        const maxTempVal = parseFloat(((weatherData.main.temp_max) - 273).toFixed(0))

        realMinTemp.innerText = `${minTempVal}°C`
        realMaxTemp.innerText = `${maxTempVal}°C`

        console.log(minTempVal)
        console.log(maxTempVal)

        // Calculating offset GMT for timezone

        const timezoneOffset = weatherData.timezone // in seconds 

        // Current sunrise time
        const sunriseValInSec = (weatherData.sys.sunrise + timezoneOffset) // Adding offset in total UNIX seconds
        const sunriseRealVal = (sunriseValInSec * 1000) // Converting UNIX seconds timestamp in miliseconds
        console.log(sunriseRealVal)

        const date = new Date(sunriseRealVal) // creating a date object
        const sunriseHour = date.getUTCHours().toString().padStart(2,'0')
        const sunriseMinutes = date.getUTCMinutes().toString().padStart(2,'0') // .padStart(2,'0') so the hours value stays in 2 digits
        realSunriseTime.innerText = `${sunriseHour}:${sunriseMinutes} AM`

        console.log(`${sunriseHour}:${sunriseMinutes}`)

        // Current sunset time
        const sunsetValInSec = (weatherData.sys.sunset + timezoneOffset) // Adding offset in total UNIX seconds
        const sunsetRealVal = (sunsetValInSec * 1000) // Converting UNIX seconds timestamp in miliseconds
        console.log(sunsetRealVal)

        const date1 = new Date(sunsetRealVal) // creating a date object
        const sunsetHour = date1.getUTCHours().toString().padStart(2,'0')// .padStart(2,'0') so the hours value stays in 2 digits
        const sunsetMinutes = date1.getUTCMinutes().toString().padStart(2,'0')
        realSunsetTime.innerText = `${sunsetHour}:${sunsetMinutes} PM`
        
        console.log(`${sunsetHour}:${sunsetMinutes}`)
        
        // Current wind speed
        const windSpeedVal =  ((weatherData.wind.speed)*3600/1000).toFixed(1)
        realWindSpeed.innerText = `${windSpeedVal} Km/h`
        console.log(windSpeedVal)

        // Current Weather Condition
        const currentWeatherCondition = weatherData.weather[0].main
        realWeatherCondition.innerText = `${currentWeatherCondition}` 
        console.log(`Current weather condition is : ${weatherData.weather[0].main}`)

        // Current place name
        const currentPlace = weatherData.name 
        realPlace.innerText = `${currentPlace}`

        // Current Time of place
        // Calculating the offset    
        const currentTimeOffset = currentTime.timezone_offset.toFixed(2)
        console.log(currentTimeOffset)
        const offsetHours = Math.floor(currentTimeOffset)
        const offsetMinutes = (currentTimeOffset - offsetHours) * 100
        const offsetSeconds = (offsetHours*3600)+(offsetMinutes*60)
        
        // Converting UNIX seconds to UTC
        const currUNIXval =  (currentTime.date_time_unix + offsetSeconds )*1000 // in miliseconds with offset
        const date2 = new Date(currUNIXval)

        const currentHour = date2.getUTCHours().toString().padStart(2,'0')
        const currentMinutes = date2.getUTCMinutes().toString().padStart(2,'0')
        realTime.innerText = `${currentHour} : ${currentMinutes}`

        const currentDay = currentTime.date_time_txt.split(',')[0].trim()
        const currentDate = currentTime.date_time_txt.split(',')[1].trim()
        realTimeZoneDate.innerText = `${currentDay}, ${currentDate}`

        console.log(currentTime.date_time_unix)
        console.log(weatherData.sys.sunrise)
        console.log(weatherData.sys.sunset)

        // Updating weather condition UI
        // Check if current time is between today's sunrise and sunset
        if (realWeatherCondition.innerText.includes("Clear")) {
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset) {
            
                realClearDay.style.display = "block"
                realClearNight.style.display = "none" // Hide the night view
            } else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realClearDay.style.display = "none" // Hide the day view
                realClearNight.style.display = "block"
            } else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realClearDay.style.display = "none" // Hide the day view
                realClearNight.style.display = "block"
            } else {
                // Default case if none of the conditions match (optional)
            
                realClearDay.style.display = "none"
                realClearNight.style.display = "none"
            }
        }

        console.log(realWeatherCondition)

        // Check if current time is between today's sunrise and sunset
        if (realWeatherCondition.innerText.includes("Clouds")) {
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset) {
                realCloudyDay.style.display = "block"
                realCloudyNight.style.display = "none" // Hide the night view
            } else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                realCloudyDay.style.display = "none" // Hide the day view
                realCloudyNight.style.display = "block"
            } else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                realCloudyDay.style.display = "none" // Hide the day view
                realCloudyNight.style.display = "block"
            } else {
                // Default case if none of the conditions match (optional)
                realCloudyDay.style.display = "none"
                realCloudyNight.style.display = "none"
            }
        }

        // to check condition is rainy
        if(realWeatherCondition.innerText.includes("Rain"||"Drizzle")){
            realRainy.style.display = "block"
        }
        else{
            realRainy.style.display = "none"
        }

        // to check condition is snowy
        if(realWeatherCondition.innerText.includes("Snow")){
            realSnowy.style.display = "block"
        }
        else{
            realSnowy.style.display = "none"
        }

        // to check condition is thunderstorm
        if(realWeatherCondition.innerText.includes("Thunderstorm")){        
            realThunder.style.display = "block"
        }
        else{
            realThunder.style.display = "none"
        }

        // to check if there are atmospheric conditions
         if(realWeatherCondition.innerText.includes("Atmosphere")){
            realAtmospheric.style.display = "block"
        }
        else{
            realAtmospheric.style.display = "none"
        }

        // Current UV index       
        const currentUVVal = (currentUVIndex.result.uv).toFixed(1)
        realUVIndex.innerText = `${currentUVVal}`

        // forecast data dates in unix seconds
        const todayDate = currentTime.date_time_unix

        // In forecast API we have date1 and date2 parameters 
        // which are the dates of day1 and day2 act as a range for forecast
        // Day1 => 1st day's date in unix from today , Day2 => 5th day's date in unix
        const forecastDay1UNIX = todayDate + 86400  // 24 hours => 86400 seconds
        const forecastDay2UNIX = todayDate + 432000 // 120 hours => 432000 seconds
        
        const forecastTimeStampDay1 = new Date(forecastDay1UNIX * 1000) // in miliseconds

        const forecastYearDay1 = forecastTimeStampDay1.getFullYear()
        const forecastMonthDay1 = forecastTimeStampDay1.getMonth() + 1 // cause months return in 0 to 11
        const forecastDateDay1 = forecastTimeStampDay1.getDate()

        const forecastDay1FinalDate = `${forecastYearDay1}-${forecastMonthDay1}-${forecastDateDay1}` // Date of the 1st day 
        console.log(forecastDay1FinalDate)

        const forecastDay1oftheWeek = forecastTimeStampDay1.getDay() // Day of the week for 1st day

        // fetching the forecast week day
        // we already have the UNIX in seconds time of day1 and day2
        // here day1 and day2 are 1st day and 5th day forecast
        const forecastDay2InMid = todayDate + 172800 // 2nd Day in UNIX seconds
        const forecastDay3InMid = todayDate + 259200 // 3rd Day in UNIX seconds
        const forecastDay4InMid = todayDate + 345600 // 4th Day in UNIX seconds 
        
        const forecastTimeStampDay2InMid = new Date(forecastDay2InMid * 1000) // in miliseconds
        const forecastDay2oftheWeek = forecastTimeStampDay2InMid.getDay() // Day of the week for 2nd day

        const forecastTimeStampDay3InMid = new Date(forecastDay3InMid * 1000) // in miliseconds
        const forecastDay3oftheWeek = forecastTimeStampDay3InMid.getDay() // Day of the week for 3rd day

        const forecastTimeStampDay4InMid = new Date(forecastDay4InMid * 1000) // in miliseconds
        const forecastDay4oftheWeek = forecastTimeStampDay4InMid.getDay() // Day of the week for 4th day

        const forecastTimeStampDay2 = new Date(forecastDay2UNIX * 1000) // in miliseconds

        const forecastYearDay2 = forecastTimeStampDay2.getFullYear()
        const forecastMonthDay2 = forecastTimeStampDay2.getMonth() + 1 // cause months return in 0 to 11
        const forecastDateDay2 = forecastTimeStampDay2.getDate()

        const forecastDay2FinalDate = `${forecastYearDay2}-${forecastMonthDay2}-${forecastDateDay2}` // Date of the 5th day
        console.log(forecastDay2FinalDate)

        const forecastDay5oftheWeek = forecastTimeStampDay2.getDay() // Day of the week for 5th day
        
        // We call our fetchForecastData function with all the required parameters
        const currentForecastData = await fetchForecastData(lat,lon,forecastDay1FinalDate,forecastDay2FinalDate)

        console.log(currentForecastData)

        function convertToDeg(fahrenheit){
            return ((fahrenheit - 32) * 5 / 9).toFixed(0)
        }

        const currentForecastDay1Temp = convertToDeg(currentForecastData.days[0].temp)
        const currentForecastDay2Temp = convertToDeg(currentForecastData.days[1].temp)
        const currentForecastDay3Temp = convertToDeg(currentForecastData.days[2].temp)
        const currentForecastDay4Temp = convertToDeg(currentForecastData.days[3].temp)
        const currentForecastDay5Temp = convertToDeg(currentForecastData.days[4].temp)

        // Updating the forecast temperature
        realForecastDay1.innerText = `${currentForecastDay1Temp}°C`
        realForecastDay2.innerText = `${currentForecastDay2Temp}°C`
        realForecastDay3.innerText = `${currentForecastDay3Temp}°C`
        realForecastDay4.innerText = `${currentForecastDay4Temp}°C`
        realForecastDay5.innerText = `${currentForecastDay5Temp}°C`

        // Updating the forecast Day of the week
        function DayOftheWeek(weekDay){ // weekDay will be the .getDay() numeric value
            const days = ["Sun","Mon","Tue","Wed","Thru","Fri","Sat"]
            return days[weekDay] // return that day of the week
        }

        const day1OfTheWeek = `${DayOftheWeek(forecastDay1oftheWeek)}`
        const day2OfTheWeek = `${DayOftheWeek(forecastDay2oftheWeek)}`
        const day3OfTheWeek = `${DayOftheWeek(forecastDay3oftheWeek)}`
        const day4OfTheWeek = `${DayOftheWeek(forecastDay4oftheWeek)}`
        const day5OfTheWeek = `${DayOftheWeek(forecastDay5oftheWeek)}`

        // Updating day of the week
        realDay1OfTheWeek.innerText = `${day1OfTheWeek}`
        realDay2OfTheWeek.innerText = `${day2OfTheWeek}`
        realDay3OfTheWeek.innerText = `${day3OfTheWeek}`
        realDay4OfTheWeek.innerText = `${day4OfTheWeek}`
        realDay5OfTheWeek.innerText = `${day5OfTheWeek}`

        // Updating the forecast conditions icon 
        const currentForecastConditionsDay1 = currentForecastData.days[0].conditions
        const currentForecastConditionsDay2 = currentForecastData.days[1].conditions
        const currentForecastConditionsDay3 = currentForecastData.days[2].conditions
        const currentForecastConditionsDay4 = currentForecastData.days[3].conditions
        const currentForecastConditionsDay5 = currentForecastData.days[4].conditions
        
        console.log(typeof currentForecastConditionsDay1)
        console.log(currentForecastConditionsDay1)
        console.log(currentForecastConditionsDay2)
        console.log(currentForecastConditionsDay3)
        console.log(currentForecastConditionsDay4)
        console.log(currentForecastConditionsDay5)

        // Day1 future forecast
        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("rain")){
        
            realFutureConditionRainyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("showers")){
        
            realFutureConditionRainyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("drizzle")){
        
            realFutureConditionRainyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("sleet")){
        
            realFutureConditionRainyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("snow")){
        
            realFutureConditionSnowyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("hail")){
        
            realFutureConditionSnowyDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("thunderstorms")){
        
            realFutureConditionThunderDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("fog")){
        
            realFutureConditionAtmosphericDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("overcast")){
        
            realFutureConditionAtmosphericDay1.style.display = "block"
        }

        if(currentForecastConditionsDay1.split(',').length == 2){
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("rain")){
            
                realFutureConditionRainyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("showers")){
            
                realFutureConditionRainyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("drizzle")){
            
                realFutureConditionRainyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("sleet")){
            
                realFutureConditionRainyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("snow")){
            
                realFutureConditionSnowyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("hail")){
            
                realFutureConditionSnowyDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("thunderstorms")){
            
                realFutureConditionThunderDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("fog")){
            
                realFutureConditionAtmosphericDay1.style.display = "block"
            }
    
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("overcast")){
            
                realFutureConditionAtmosphericDay1.style.display = "block"
            }
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("clear")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionClearDay1.style.display = "block" // for day
                realFutureConditionClearNightDay1.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionClearDay1.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay1.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realFutureConditionClearDay1.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay1.style.display = "block"
            }
        }

        if(currentForecastConditionsDay1.split(',')[0].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionCloudyDay1.style.display = "block" // for day
                realFutureConditionCloudyNightDay1.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionCloudyDay1.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay1.style.display = "block"
                } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realFutureConditionCloudyDay1.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay1.style.display = "block"
            }
        }
        
        if(currentForecastConditionsDay1.split(',').length == 2){
            if(currentForecastConditionsDay1.split(',')[1].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
                if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                
                    realFutureConditionCloudyDay1.style.display = "block" // for day
                    realFutureConditionCloudyNightDay1.style.display = "none" // hide the night view
                }
                 else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                
                    realFutureConditionCloudyDay1.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay1.style.display = "block"
                } 
                else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                
                    realFutureConditionCloudyDay1.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay1.style.display = "block"
                }
            }
        }

        // Day2 future forecast
        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("rain")){
        
            realFutureConditionRainyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("showers")){
        
            realFutureConditionRainyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("drizzle")){
        
            realFutureConditionRainyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("sleet")){
        
            realFutureConditionRainyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("snow")){
        
            realFutureConditionSnowyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("hail")){
        
            realFutureConditionSnowyDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("thunderstorms")){
        
            realFutureConditionThunderDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("fog")){
        
            realFutureConditionAtmosphericDay2.style.display = "block"
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("overcast")){
        
            realFutureConditionAtmosphericDay2.style.display = "block"
        }
        
        if(currentForecastConditionsDay2.split(',').length == 2){
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("rain")){
            
                realFutureConditionRainyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("showers")){
            
                realFutureConditionRainyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("drizzle")){
            
                realFutureConditionRainyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("sleet")){
            
                realFutureConditionRainyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("snow")){
            
                realFutureConditionSnowyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("hail")){
            
                realFutureConditionSnowyDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("thunderstorms")){
            
                realFutureConditionThunderDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("fog")){
            
                realFutureConditionAtmosphericDay2.style.display = "block"
            }
    
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("overcast")){
            
                realFutureConditionAtmosphericDay2.style.display = "block"
            }
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("clear")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionClearDay2.style.display = "block" // for day
                realFutureConditionClearNightDay2.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionClearDay2.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay2.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realFutureConditionClearDay2.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay2.style.display = "block"
            }
        }

        if(currentForecastConditionsDay2.split(',')[0].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionCloudyDay2.style.display = "block" // for day
                realFutureConditionCloudyNightDay2.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionCloudyDay2.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay2.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                
                realFutureConditionCloudyDay2.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay2.style.display = "block"
            }
        }

        if(currentForecastConditionsDay2.split(',').length == 2){
            if(currentForecastConditionsDay2.split(',')[1].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
                if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                
                    realFutureConditionCloudyDay2.style.display = "block" // for day
                    realFutureConditionCloudyNightDay2.style.display = "none" // hide the night view
                }
                 else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                
                    realFutureConditionCloudyDay2.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay2.style.display = "block"
                } 
                else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                    
                    realFutureConditionCloudyDay2.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay2.style.display = "block"
                }
            }
        }

        // Day3 future forecast
        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("rain")){
        
            realFutureConditionRainyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("showers")){
        
            realFutureConditionRainyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("drizzle")){
        
            realFutureConditionRainyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("sleet")){
        
            realFutureConditionRainyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("snow")){
        
            realFutureConditionSnowyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("hail")){
        
            realFutureConditionSnowyDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("thunderstorms")){
        
            realFutureConditionThunderDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("fog")){
        
            realFutureConditionAtmosphericDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("overcast")){
        
            realFutureConditionAtmosphericDay3.style.display = "block"
        }

        if(currentForecastConditionsDay3.split(',').length == 2){
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("rain")){
            
                realFutureConditionRainyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("showers")){
            
                realFutureConditionRainyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("drizzle")){
            
                realFutureConditionRainyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("sleet")){
            
                realFutureConditionRainyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("snow")){
            
                realFutureConditionSnowyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("hail")){
            
                realFutureConditionSnowyDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("thunderstorms")){
            
                realFutureConditionThunderDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("fog")){
            
                realFutureConditionAtmosphericDay3.style.display = "block"
            }
    
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("overcast")){
            
                realFutureConditionAtmosphericDay3.style.display = "block"
            }
        }

        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("clear")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionClearDay3.style.display = "block" // for day
                realFutureConditionClearNightDay3.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionClearDay3.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay3.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realFutureConditionClearDay3.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay3.style.display = "block"
            }
        }


        if(currentForecastConditionsDay3.split(',')[0].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
            
                realFutureConditionCloudyDay3.style.display = "block" // for day
                realFutureConditionCloudyNightDay3.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
            
                realFutureConditionCloudyDay3.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay3.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
            
                realFutureConditionCloudyDay3.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay3.style.display = "block"
            }
        }

        if(currentForecastConditionsDay3.split(',').length == 2){
            if(currentForecastConditionsDay3.split(',')[1].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
                if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                
                    realFutureConditionCloudyDay3.style.display = "block" // for day
                    realFutureConditionCloudyNightDay3.style.display = "none" // hide the night view
                }
                 else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                
                    realFutureConditionCloudyDay3.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay3.style.display = "block"
                } 
                else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                
                    realFutureConditionCloudyDay3.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay3.style.display = "block"
                }
            }
        }

        // Day4 future forecast
        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("rain")){ 
            realFutureConditionRainyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("showers")){ 
            realFutureConditionRainyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("drizzle")){ 
            realFutureConditionRainyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("sleet")){    
            realFutureConditionRainyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("snow")){ 
            realFutureConditionSnowyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("hail")){   
            realFutureConditionSnowyDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("thunderstorms")){ 
            realFutureConditionThunderDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("fog")){  
            realFutureConditionAtmosphericDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("overcast")){ 
            realFutureConditionAtmosphericDay4.style.display = "block"
        }

        if(currentForecastConditionsDay4.split(',').length == 2){
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("rain")){      
                realFutureConditionRainyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("showers")){   
                realFutureConditionRainyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("drizzle")){    
                realFutureConditionRainyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("sleet")){  
                realFutureConditionRainyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("snow")){       
                realFutureConditionSnowyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("hail")){       
                realFutureConditionSnowyDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("thunderstorms")){          
                realFutureConditionThunderDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("fog")){         
                realFutureConditionAtmosphericDay4.style.display = "block"
            }
    
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("overcast")){ 
                realFutureConditionAtmosphericDay4.style.display = "block"
            }
        }
        
        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("clear")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){   
                realFutureConditionClearDay4.style.display = "block" // for day
                realFutureConditionClearNightDay4.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                realFutureConditionClearDay4.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay4.style.display = "block"
            } 
             else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)      
                 realFutureConditionClearDay4.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay4.style.display = "block"
             }
        }      
        
        if(currentForecastConditionsDay4.split(',')[0].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                 realFutureConditionCloudyDay4.style.display = "block" // for day
                realFutureConditionCloudyNightDay4.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                realFutureConditionCloudyDay4.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay4.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)        
                realFutureConditionCloudyDay4.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay4.style.display = "block"
            }
        }

        if(currentForecastConditionsDay4.split(',').length == 2){
            if(currentForecastConditionsDay4.split(',')[1].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
                if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){               
                    realFutureConditionCloudyDay4.style.display = "block" // for day
                    realFutureConditionCloudyNightDay4.style.display = "none" // hide the night view
                }
                 else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)              
                    realFutureConditionCloudyDay4.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay4.style.display = "block"
                } 
                else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                    realFutureConditionCloudyDay4.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay4.style.display = "block"
                }
            }
        }   

        // Day5 future forecast
        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("rain")){
            realFutureConditionRainyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("showers")){
            realFutureConditionRainyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("drizzle")){
            realFutureConditionRainyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("sleet")){
            realFutureConditionRainyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("snow")){
            realFutureConditionSnowyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("hail")){
            realFutureConditionSnowyDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("thunderstorms")){
            realFutureConditionThunderDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("fog")){
            realFutureConditionAtmosphericDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("overcast")){ 
            realFutureConditionAtmosphericDay5.style.display = "block"
        }

        if(currentForecastConditionsDay5.split(',').length == 2){
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("rain")){     
                realFutureConditionRainyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("showers")){           
                realFutureConditionRainyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("drizzle")){           
                realFutureConditionRainyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("sleet")){
                realFutureConditionRainyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("snow")){
            
                realFutureConditionSnowyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("hail")){
                realFutureConditionSnowyDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("thunderstorms")){
                realFutureConditionThunderDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("fog")){
                realFutureConditionAtmosphericDay5.style.display = "block"
            }
    
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("overcast")){
                realFutureConditionAtmosphericDay5.style.display = "block"
            }
    
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("clear")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                realFutureConditionClearDay5.style.display = "block" // for day
                realFutureConditionClearNightDay5.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                realFutureConditionClearDay5.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay5.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                realFutureConditionClearDay5.style.display = "none"  // Hide the day view
                realFutureConditionClearNightDay5.style.display = "block"
            }
        }

        if(currentForecastConditionsDay5.split(',')[0].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
            if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){
                realFutureConditionCloudyDay5.style.display = "block" // for day
                realFutureConditionCloudyNightDay5.style.display = "none" // hide the night view
            }
             else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)
                realFutureConditionCloudyDay5.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay5.style.display = "block"
            } 
            else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started) 
                realFutureConditionCloudyDay5.style.display = "none"  // Hide the day view
                realFutureConditionCloudyNightDay5.style.display = "block"
            }
        }

        if(currentForecastConditionsDay5.split(',').length == 2){
            if(currentForecastConditionsDay5.split(',')[1].toLowerCase().includes("cloudy")) { // day time between sunrise and sunset
                if (currentTime.date_time_unix > weatherData.sys.sunrise && currentTime.date_time_unix < weatherData.sys.sunset){            
                    realFutureConditionCloudyDay5.style.display = "block" // for day
                    realFutureConditionCloudyNightDay5.style.display = "none" // hide the night view
                }
                 else if (currentTime.date_time_unix > weatherData.sys.sunset) { // Night time (after sunset)               
                    realFutureConditionCloudyDay5.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay5.style.display = "block"
                } 
                else if (currentTime.date_time_unix < weatherData.sys.sunrise) { // Early morning before sunrise (next day started)
                    realFutureConditionCloudyDay5.style.display = "none"  // Hide the day view
                    realFutureConditionCloudyNightDay5.style.display = "block"
                }
            }
        }
    }

    catch(error){
        errorUI.style.display = "flex"
        mainUI.style.display = "none"
        homeUI.style.display = "none"
        backToHomeError()
        console.log(error)
    }
}

