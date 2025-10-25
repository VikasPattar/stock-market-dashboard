const express = require('express')
const axios = require('axios')
const app = express()
const port = 4000

app.use(express.json())

app.get('/', (req, res) => {
    res.send('welcome to stock data')
})

app.get('/stock-profile', async (req, res) => {
    let { token, symbol } = req.query
    let base_url = `https://finnhub.io/api/v1`
    let stock_profile = "/stock/profile2"
    let realTimeData = '/quote'
    let response_data = {}  //declare empty response object
    try {
        await axios.get(`${base_url}${stock_profile}?token=${token}&symbol=${symbol}`)
            .then((response) => {
                let { name, ticker, marketCapitalization } = response.data
                response_data.name = name
                response_data.symbol = ticker
                response_data.marketCap = marketCapitalization
            })
            .catch((err) => {
                res.json({ error: err.message })
            })

        await axios.get(`${base_url}${realTimeData}?token=${token}&symbol=${symbol}`)
            .then((response) => {
                let { c, d, dp } = response.data
                response_data.price = c
                response_data.change = d
                response_data.changePercent = dp
                console.log(response.data)
            })
            .catch((error) => {
                res.json({
                    error: error.message
                })
            })
        res.json(response_data)
    } catch (err) {
        res.json({
            error: err.message
        })
    }
})

app.get('/price', async (req, res) => {
    let { token, symbol } = req.query
    let quote = '/quote'
    let base_url = `https://finnhub.io/api/v1`
    let response_data = {}

    try {
        await axios.get(`${base_url}${quote}?token=${token}&symbol=${symbol}`)
            .then((response) => {
                let { c } = response.data
                response_data.price = c
                console.log(response_data)
            })
            .catch((err) => {
                res.json({ error: err.message })
            })

        res.json(response_data)
    } catch (error) {
        res.json({error: error.message})
    }
})

app.listen(port, () => {
    console.log(`app is listening to the port ${port}`)
})