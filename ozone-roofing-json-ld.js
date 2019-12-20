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
    url: `${rootUrl}/logo.png`
}
const review = [
    {
        "@type": "Review",
        reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
        },
        reviewBody:
            "I give these guys 5-stars all day long. They do clean, nice looking work. They’re extremely friendly and competitively priced.",
        author: Person("Kris Peterson")
    },
    {
        "@type": "Review",
        reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
        },
        reviewBody:
            "Excellent, on time, expertly efficient, great communicators, friendly, courteous,  cleaned up after themselves as they went along, high work ethics.",
        author: Person("Trish V.")
    },
    {
        "@type": "Review",
        reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
        },
        reviewBody:
            "Ozone roofing is the roofing company everyone should use.  I’ve used them many times for many of my clients with their roofing needs. Each time it’s been a great experience. Highly recommend Ozone Roofing.",
        author: Person("Sasha Dearinger")
    },
    {
        "@type": "Review",
        reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
        },
        reviewBody:
            "The guys at Ozone are great. We had a bunch of leaks in flashing around our fireplace and exaust vents. They were super professional, got the job done on time and beat the rain. Very grateful, thanks guys!",
        author: Person("Jeff H.")
    }
]
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
    // image: {
    //     "@id": `${rootUrl}/#logo` // TODO: Not in markup
    // },
    // logo, // TODO: Not in markup
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
                name: `${title} - ${Organization.name}`
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
    [{ title: "Home", path: "" }],
    [
        { title: "Contact", path: "contact" },
        piece => {
            if (piece["@type"] !== "RoofingContractor") return
            piece.email = "inspections@ozoneroofing.com"
        }
    ],
    [
        { title: "About", path: "about" },
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
        { title: "Residential Roofing", path: "services/residential-roofing" },
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
        { title: "Elevated Decks", path: "services/elevated-decks" },
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
        { title: "Commercial Roofing", path: "services/commercial-roofing" },
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

    // actually set the id
    const script = document.createElement("script")
    script.id = "#poppyfield-json-ld"
    script.innerHTML = JSON.stringify(jsonLd)
})
