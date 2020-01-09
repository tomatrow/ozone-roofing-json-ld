const Person = (name, jobTitle) => {
    return Object.assign(
        {
            "@type": "Person",
            name
        },
        jobTitle ? { jobTitle } : {}
    )
}
const Id = id => ({
    "@id": id
})

const rootUrl = "https://ozoneroofing.com"
const logo = {
    "@type": "ImageObject",
    "@id": `${rootUrl}/#logo`,
    url:
        "https://assets.website-files.com/5de5695fd5773ca76ac0db7b/5df29f599bca42b58421f0ca_ozone-roofing-san-clemente-logo.png"
}

const Review = (name, ratingValue, reviewBody) => ({
    "@type": "Review",
    reviewRating: {
        "@type": "Rating",
        ratingValue,
        bestRating: "5"
    },
    reviewBody,
    author: Person(name)
})

const review = [
    [
        "Kris Peterson",
        "5",
        "I give these guys 5-stars all day long. They do clean, nice looking work. They’re extremely friendly and competitively priced."
    ],
    [
        "Trish V.",
        "5",
        "Excellent, on time, expertly efficient, great communicators, friendly, courteous,  cleaned up after themselves as they went along, high work ethics."
    ],
    [
        "Sasha Dearinger",
        "5",
        "Ozone roofing is the roofing company everyone should use.  I’ve used them many times for many of my clients with their roofing needs. Each time it’s been a great experience. Highly recommend Ozone Roofing."
    ],
    [
        "Jeff H.",
        "5",
        "The guys at Ozone are great. We had a bunch of leaks in flashing around our fireplace and exaust vents. They were super professional, got the job done on time and beat the rain. Very grateful, thanks guys!"
    ]
].map(args => Review(...args))

const openingHoursSpecification = [
    {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "8:00",
        closes: "16:00"
    },
    {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [],
        opens: "11:30",
        closes: "23:00"
    },
    {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "16:00",
        closes: "23:00"
    },
    {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "16:00",
        closes: "22:00"
    }
]

const Organization = {
    "@type": "RoofingContractor",
    "@id": `${rootUrl}/#roofingcontractor`,
    name: "Ozone Roofing",
    sameAs: [
        "https://www.facebook.com/pages/category/Roofing-Service/Ozone-Roofing-Inc-142322333349882/",
        "https://www.yelp.com/biz/ozone-roofing-san-clemente-4",
        "https://www.instagram.com/ozoneroofing/"
    ],
    image: {
        "@id": `${rootUrl}/#logo`
    },
    logo,
    address: {
        "@type": "PostalAddress",
        streetAddress: "63 Via Pico Plaza Ste 433",
        addressLocality: "San Clemente",
        addressRegion: "CA",
        postalCode: "92672",
        addressCountry: "US"
    },
    // review, // TODO: Not in markup
    geo: {
        "@type": "GeoCoordinates",
        latitude: 33.435884,
        longitude: -117.620611
    },
    url: rootUrl,
    telephone: "+19493666597",
    // TODO: Determine if this is a good price range.
    priceRange: "$$$"
    // openingHoursSpecification // TODO: Not in markup
}

const WebSite = {
    "@type": "WebSite",
    "@id": `${rootUrl}/#website`,
    url: `${rootUrl}/`,
    name: Organization.name,
    publisher: Id(Organization["@id"])
}

const WebPage = {
    "@type": "WebPage",
    // "@id": `${rootUrl}/path/to/page`,
    // url: rootUrl,
    inLanguage: "en-US",
    // name: `Title - ${Organization.name}`,
    isPartOf: Id(WebSite["@id"]),
    about: Id(Organization["@id"])
    // description: "Just another WordPress site"
}

const graph = (config, transform) => {
    const { title, path, description } = config
    const url = `${rootUrl}/${path}`
    let graph = [
        Organization,
        WebSite,
        Object.assign(
            {},
            WebPage,
            {
                "@id": url,
                url,
                name: title
            },
            description ? { description } : {}
        )
    ]
    if (transform) {
        graph = JSON.parse(JSON.stringify(graph))
        graph.forEach(transform)
    }
    return {
        "@context": "https://schema.org",
        "@graph": graph
    }
}

const Service = (name, offerNames) => {
    return {
        areaServed: "Orange County, CA, USA",
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offerNames.map(offerName => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: offerName
                }
            }))
        }
    }
}

// actually create the pages we need
;[
    [
        {
            title: "Ozone Roofing in San Clemente, CA - Home",
            path: "",
            description:
                "We are Ozone Roofing, a top rated commercial and residential roofing company based out of San Clemente, California. We serve all of southern California with our services, which include commercial roofing, residential roofing, roof repairs and elevated decks. Contact us today to start your roofing project!"
        }
    ],
    [
        {
            title: "Contact Ozone Roofing - San Clemente, CA",
            path: "contact",
            description:
                "Ozone Roofing offers premium residential and commercial roofing services, including elevated decks. Please contact us today for a quote!"
        },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            piece.email = "inspections@ozoneroofing.com"
        }
    ],
    [
        {
            title: "Ozone Roofing - Southern California Roofing Company",
            path: "about",
            description:
                "We are a family owned & operated roofing company that values quality and integrity. We offer premium residential and commercial roofing services, including elevated decks. Please contact us today for a quote!"
        },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            piece.employees = [
                ["Greg Kuhn", "CFO"],
                ["Spencer Kuhn", "CEO"],
                ["Freddy Kuhn", "Male Model"]
            ].map(([name, title]) => Person(name, title))
        }
    ],
    [
        {
            title: "Residential Roofing | Ozone Roofing San Clemente, CA",
            path: "services/residential-roofing",
            description:
                "Ozone Roofing, Inc specializes in residential roof repair. We have been in the business for 30+ years. We got our start in working with homeowners all over Orange County. We handle all residential projects with a professional approach and attention to detail."
        },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            Object.assign(
                piece,
                Service("Residential Roof Systems", [
                    "Metal Roofs – Standing Seam",
                    "Composition Roofs – GAF, Certainteed, Malarky, Owens Corning",
                    "Concrete/Cement/Clay Roofs– Eagle, Auburn, Redlands, Boral",
                    "Slate Roofs– American Slate, Da Vinci (synthetic)",
                    "Wood Roofs – Class A fire treated Shake, Shingle",
                    "Low pitch systems",
                    "Built up roofing",
                    "Single ply roofing",
                    "Insulation",
                    "Title 24 roof systems",
                    "Roof coatings",
                    "Skylights- Install and/or void"
                ])
            )
        }
    ],
    [
        {
            title: "Elevated Decks | Ozone Roofing San Clemente, CA",
            path: "services/elevated-decks",
            description:
                "Ozone Roofing, Inc specializes elevated decking. This type of property upgrade requires the years of experience and roofing knowledge that only Ozone Roofing can offer. Elevated decking is a great way to utilize square footage that would normally go to waste."
        },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            Object.assign(
                piece,
                Service("Elevated Decking", [
                    "Ipe Wood Deck Tiles",
                    "Pedestal Supported Wood Plank Deck",
                    "Interlocking Deck Tiles"
                ])
            )
        }
    ],
    [
        {
            title: "Commercial Roofing | Ozone Roofing San Clemente, CA",
            path: "services/commercial-roofing",
            description:
                "Looking for quality commercial roofing services for your properties? For over 20+ years, Ozone Roofing has worked directly with Property Managers to get jobs done quickly and efficiently. We pride ourselves on our quick response and superior workmanship. We are equipped to maintain a variety of different roofs from residential, commercial and industrial properties. You will be absolutely happy with our roofing services."
        },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            Object.assign(
                piece,
                Service("Commercial Roofing Services", [
                    "New Roofs",
                    "Re-roofs",
                    "Roof Repairs",
                    "Exterior Coating",
                    "Roof Inspections",
                    "Maintenance",
                    "Title 24 Systems"
                ])
            )
        }
    ]
].forEach(([config, transform]) => {
    const jsonLd = graph(config, transform)
    // then we write it somewhere
    if (`/${config.path}` !== window.location.pathname) return

    // actually insert the structured data
    const script = document.createElement("script")
    script.id = "#poppyfield-json-ld"
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify(jsonLd)
    document.head.append(script)
})
