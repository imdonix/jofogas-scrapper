const fetch = require('node-fetch')
const { parse } = require('node-html-parser')

const DEFAULT_DEPHT = 5
const DOMAIN_NAME = "https://www.jofogas.hu/magyarorszag"
const SLEEP = 200

function scrap(keywords, settings, callback)
{
    let proper = initSettings(settings ? settings : {})
    processPage(buildUrl(keywords, proper), [], proper.depht, proper, callback)
}

function processPage(url, items, iterations, settings, finalize)
{
    fetch(url, { headers : {'Content-Type' : 'text/plain; charset=iso-8859-2'}})
    .then(res => res.textConverted())
    .then(body => 
        {
            const domRoot = parse(body)
            for(const domItem of domRoot.querySelectorAll('.list-item'))
            {
                let item = processDomItem(domItem)
                if(item)
                    if(!settings.minPrice || settings.minPrice < item.price)
                        if(!settings.maxPrice || settings.maxPrice > item.price)
                            if(settings.enableCompany || !item.company)
                                if(settings.enablePost || !item.post)
                                    items.push(item)
            }
            next(domRoot)
        })
    .catch(_ => next(null))

    function next(root)
    {
        let next = nextPage(root)
        if(iterations > 0 && next)
            setTimeout(() => processPage(next, items, --iterations, settings, finalize), settings.sleep) 
        else
            finalize(items)
    }
}

function processDomItem(item)
{   
    try
    {
        const itemRoot = parse(item);
        const metaAttributes = itemRoot.querySelectorAll('meta').map(dom => dom.attributes)

        return {
            id: toId(metaAttributes.find(prop => prop.itemprop == 'url').content),
            pos: parseInt(metaAttributes.find(prop => prop.itemprop == 'position').content),
            name: metaAttributes.find(prop => prop.itemprop == 'name').content,
            price: parseInt(itemRoot.querySelector('.price-value').attributes.content),
            image: itemRoot.querySelector('img').attributes['src'],
            url: itemRoot.querySelector('.subject').attributes.href,
            company: itemRoot.querySelector('.badge-company_ad') != null,
            post: itemRoot.querySelector('.badge-box') != null
        }
    } catch(_){ return null }
}

function toId(url)
{
    return url.slice(url.indexOf('#')+1)
}

function nextPage(root)
{
    if(root)
        return root.querySelector('.ad-list-pager-item-next').attributes.href
    else 
        return null
}

function initSettings(settings)
{
    return {
        depht: settings.depht || DEFAULT_DEPHT,
        domain: settings.domain || DOMAIN_NAME,
        minPrice : settings.minPrice || null,
        maxPrice : settings.maxPrice || null,
        sleep : settings.sleep || SLEEP,
        enableCompany : settings.enableCompany || false,
        enablePost: settings.enablePost || false
    }
}

function buildUrl(keywords, settings)
{
    return settings.domain + '?' +
    new URLSearchParams(
    {
        'q' : keywords,
        'max_price' : settings.maxPrice ? settings.maxPrice : '',
        'min_price' : settings.minPrice ? settings.minPrice : ''
    });
}

module.exports = scrap