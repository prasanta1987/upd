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

            for (let i = 0; i < dataValue.length; i++) {
                chunk.push(dataValue[i])
                breaks++
                if (breaks > 5) {
                    finalData.push(chunk)
                    chunk = []
                    breaks = 0
                }
            }

            finalData.shift()
            finalData.pop()
            finalData.pop()
            finalData[0].pop()
            for (let j = 1; j < finalData.length; j++) {
                finalData[j].shift()
            }
            finalData.map(shiftData => shiftData.shift())

            let dataObjectArray = []
            let dataObjectChunk = {}

            finalData.map(entries => {
                dataObjectChunk = {
                    "State": entries[0],
                    "InfInd": entries[1].replace(/[!@#$%^&*a-zA-Z]/g, "") || 0,
                    "InfFgn": 0,
                    "Cured": entries[2].replace(/[!@#$%^&*a-zA-Z]/g, "") || 0,
                    "Death": entries[3].replace(/[!@#$%^&*a-zA-Z]/g, "") || 0,
                }
                dataObjectArray.push(dataObjectChunk)
            })

            console.log(dataObjectArray)

            const fbUrl = 'https://asia-east2-pran-home.cloudfunctions.net/api/covid/'
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