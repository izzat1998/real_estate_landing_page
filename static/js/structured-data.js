// Structured Data for Real Estate Listings
document.addEventListener('DOMContentLoaded', function() {
    // Create the JSON-LD structured data for the real estate property
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Residence",
        "name": "YANGI BOZOR RESIDENCE",
        "description": "Премиальный жилой комплекс. Современное жилье для комфортной и стильной жизни в центре города.",
        "url": window.location.href,
        "image": [
            window.location.origin + "/static/images/55_1.jpg",
            window.location.origin + "/static/images/11_1.jpg",
            window.location.origin + "/static/images/12_1.jpg"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Uzbekistan",
            "addressLocality": "Ташкент",
            "addressRegion": "Ташкентская область",
            "streetAddress": "Янги Бозор"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "41.315356",
            "longitude": "69.533471"
        },
        "telephone": "+998712345678",
        "amenityFeature": [
            {
                "@type": "LocationFeatureSpecification",
                "name": "Детская площадка",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Спортивная площадка",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Подземный паркинг",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Зона отдыха с прудом",
                "value": true
            },
            {
                "@type": "LocationFeatureSpecification",
                "name": "Круглосуточная охрана",
                "value": true
            }
        ],
        "containsPlace": [
            {
                "@type": "Apartment",
                "numberOfRooms": 1,
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": 45.2,
                    "unitCode": "MTK"
                },
                "occupancy": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2
                }
            },
            {
                "@type": "Apartment",
                "numberOfRooms": 2,
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": 65.8,
                    "unitCode": "MTK"
                },
                "occupancy": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3
                }
            },
            {
                "@type": "Apartment",
                "numberOfRooms": 3,
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": 78.69,
                    "unitCode": "MTK"
                },
                "occupancy": {
                    "@type": "QuantitativeValue",
                    "minValue": 2,
                    "maxValue": 5
                }
            },
            {
                "@type": "Apartment",
                "numberOfRooms": 4,
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": 112.4,
                    "unitCode": "MTK"
                },
                "occupancy": {
                    "@type": "QuantitativeValue",
                    "minValue": 3,
                    "maxValue": 6
                }
            }
        ],
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "UZS"
        }
    };

    // Add Organization schema
    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "YANGI BOZOR RESIDENCE",
        "url": window.location.href,
        "logo": window.location.origin + "/static/images/logo.png",
        "sameAs": [
            "https://www.facebook.com/yangibozorresidence",
            "https://instagram.com/yangibozorresidence",
            "https://t.me/yangibozor_residence_uylari"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+998712345678",
            "contactType": "sales",
            "availableLanguage": ["Russian", "Uzbek", "English"]
        }
    };

    // Add BreadcrumbList schema
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": window.location.origin
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "YANGI BOZOR RESIDENCE",
                "item": window.location.href
            }
        ]
    };

    // Create script elements for each structured data object
    function addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Add all structured data objects to the page
    addStructuredData(structuredData);
    addStructuredData(organizationData);
    addStructuredData(breadcrumbData);
});
