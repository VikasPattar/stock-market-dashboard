const axios = require("axios")
const base_url = `http://localhost:4000`
const endpoints = {
    stock_profile : "/stock-profile",
    price : '/price'
}
const token = "d3tmr19r01qigeg3u1hgd3tmr19r01qigeg3u1i0"

const companies = {
    apple : 'AAPL',
    microsoft : 'MSFT',
    tesla : 'TSLA',
    google : 'GOOG',
    amazon : "AMZN"
}

const StockProfile = async ()=>{
    await axios.get(`${base_url}${endpoints.stock_profile}?token=${token}&symbol=${companies.google}`)
    .then((response)=>{
        console.log(response.data)
    })
    .catch((err)=>{
        console.log(err)
    })
}

const price = async()=>{
    axios.get(`${base_url}${endpoints.price}?token=${token}&symbol=${companies.microsoft}`)
    .then((response)=>{
        console.log(response.data)
    })
    .catch((error)=>{
        console.log('error in feetching the price\n\n', error.message)
    })
}

StockProfile()
price()