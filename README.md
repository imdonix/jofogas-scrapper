# Jófogás.hu scraper

Simple scraper for `jofogas.hu` for node.js
Works also with:
- `ingatlan.jofogas.hu`
- `auto.jofogas.hu`

## Installation


```bash
npm install imdonix/jofogas-scraper --save
```

## Usage

```javascript
const scarp = require('jofogas-scraper')

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
```

```javascript
...
{
  id: '113504691',
  pos: 271,
  name: 'Új iphone 11 64Gb több színben Akció',
  price: 225000,
  image: 'https://img.jofogas.hu/bigthumbs/Uj_iphone_11_64Gb_tobb_szinben_Akcio_285201850034264.jpg',
  url: 'https://www.jofogas.hu/budapest/Uj_iphone_11_64Gb_tobb_szinben_Akcio_113504691.htm',
  company: true,
  post: false
}
done
```
