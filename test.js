const scarp = require('./scrap')

const settings = {
    depht: 10,                                  // Check the first X page. Default: 5
    domain: "https://www.jofogas.hu/budapest",  // Domain. Default: "https://www.jofogas.hu/magyarorszag"
    minPrice : 100000,                          // Min price. Default: null
    maxPrice : 300000,                          // Max price. Default: null
    sleep : 0,                                  // Time to waint before next page is scrapped (in ms). Default: 200 
    enableCompany : true,                       // Enable company ads. Default: false
    enablePost: false                           // Enable post option. Default: false
}

scarp("iphone 11", settings, items =>
{  
    for(const item of items)
        console.log(item)
    console.log("done")
})