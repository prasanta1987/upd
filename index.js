const scrapeIt = require("scrape-it")
const axios = require('axios');

const fetchData = () => {
    scrapeIt("https://www.mohfw.gov.in/", { title: "tr" })
        .then(({ data, response }) => {
            let dataValue = []
            let chunk = []
            let finalData = []
            let breaks = 0;

            // console.log(`Status Code: ${response.statusCode}`)
            let dataArray = data.title.split()
            dataArray.map(values => {
                values.split("\n").map(value => dataValue.push(value.trim()))
            })
            // console.log(dataValue.splice(21, breaks))

            for (let i = 0; i < dataValue.length; i++) {
                chunk.push(dataValue[i])
                breaks++
                if (breaks > 6) {
                    finalData.push(chunk)
                    chunk = []
                    breaks = 0
                }
            }

            finalData.shift()
            finalData.pop()
            finalData.map(popData => { popData.pop() })
            finalData.map(shiftData => shiftData.shift())
            let dataObjectArray = []
            let dataObjectChunk = {}
            finalData.map(entries => {
                dataObjectChunk = {
                    "State": entries[0],
                    "Infected(Indian)": entries[1],
                    "Infected(Foreigner)": entries[2],
                    "Cured": entries[3],
                    "Death": entries[4]
                }
                dataObjectArray.push(dataObjectChunk)
            })
            // console.log(dataObjectArray)
            const fbUrl = 'https://asia-east2-pran-home.cloudfunctions.net/api/covid/'
            // const fbUrl = 'http://localhost:5000/pran-home/asia-east2/api/covid/'
            axios({
                method: 'post',
                url: fbUrl,
                data: dataObjectArray
            })
                .then(res => console.log(res.data))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

fetchData()

setInterval(fetchData, 3600000)
