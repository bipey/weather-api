import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'; 


const port=3000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
async function getWeather(city){
    try {
        const apiKey=process.env.API_KEY
       
        const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`
        const response= await fetch(url);
        
        const data= await response.json();
        const weatherData={
            city:data.name,
            temperature:data.main.temp,
            feels_like:data.main.feels_like
        }
        console.log(weatherData)
        return weatherData;
    } catch (error) {
        console.log("Error occured",error)  
    }
    
}
app.get('/',async(req,res)=>{
    const {city}=req.query;
    if(!city){
        return res.status(400).json({message:"City is required"})}
    const weatherData=await getWeather(city)
    if(!weatherData){
        console.error("City not found")
        return res.status(404).json({message:"City not found"})
    }
    return res.status(200).json({data:weatherData, message:"Data fetched successfully"})
})
app.listen(port,(()=>{
    console.log(`Server is running on port ${port}`)
}))