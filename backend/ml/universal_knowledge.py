"""
Universal Crop & Plant Disease Knowledgebase
Provides comprehensive botanical metadata, symptoms, immediate actions,
biological/organic treatments, chemical guidance, and preventive protocols
for ALL agricultural crops, fruit trees, vegetables, and universal plant foliage.
"""

from typing import Dict, Any, List, Optional

UNIVERSAL_CROPS_METADATA: Dict[str, Dict[str, Any]] = {
    "Tomato": {
        "scientific_name": "Solanum lycopersicum",
        "family": "Solanaceae",
        "icon": "tomato",
        "description": "Widely cultivated nightshade vegetable crop susceptible to foliar blights, leaf curls, and bacterial spots."
    },
    "Potato": {
        "scientific_name": "Solanum tuberosum",
        "family": "Solanaceae",
        "icon": "potato",
        "description": "Major tuber staple crop vulnerable to late blight (Phytophthora) and early blight (Alternaria)."
    },
    "Corn": {
        "scientific_name": "Zea mays",
        "family": "Poaceae",
        "icon": "corn",
        "description": "Essential cereal grain vulnerable to foliar rusts, northern corn leaf blight, and gray leaf spots."
    },
    "Rice": {
        "scientific_name": "Oryza sativa",
        "family": "Poaceae",
        "icon": "rice",
        "description": "Primary global food staple susceptible to blast fungus (Magnaporthe oryzae) and bacterial leaf blight."
    },
    "Wheat": {
        "scientific_name": "Triticum aestivum",
        "family": "Poaceae",
        "icon": "wheat",
        "description": "Cool-season cereal grain prone to stripe rust, leaf rust, powdery mildew, and fungal blights."
    },
    "Cotton": {
        "scientific_name": "Gossypium hirsutum",
        "family": "Malvaceae",
        "icon": "cotton",
        "description": "Primary natural fiber crop prone to bacterial blight (angular leaf spot), target spot, and Alternaria."
    },
    "Apple": {
        "scientific_name": "Malus domestica",
        "family": "Rosaceae",
        "icon": "apple",
        "description": "Temperate tree fruit susceptible to apple scab (Venturia inaequalis), cedar apple rust, and black rot."
    },
    "Grape": {
        "scientific_name": "Vitis vinifera",
        "family": "Vitaceae",
        "icon": "grape",
        "description": "Woody vine fruit crop vulnerable to black rot, Esca trunk measles, downy mildew, and powdery mildew."
    },
    "Mango": {
        "scientific_name": "Mangifera indica",
        "family": "Anacardiaceae",
        "icon": "leaf",
        "description": "Tropical fruit tree susceptible to Anthracnose (Colletotrichum), powdery mildew, and bacterial canker."
    },
    "Citrus (Lemon/Orange)": {
        "scientific_name": "Citrus spp.",
        "family": "Rutaceae",
        "icon": "leaf",
        "description": "Citrus fruit species vulnerable to citrus canker (Xanthomonas), black spot, and huanglongbing (greening)."
    },
    "Banana": {
        "scientific_name": "Musa acuminata",
        "family": "Musaceae",
        "icon": "leaf",
        "description": "Major tropical monocot crop susceptible to Black Sigatoka, Yellow Sigatoka, and Fusarium wilt."
    },
    "Chilli / Pepper": {
        "scientific_name": "Capsicum annuum",
        "family": "Solanaceae",
        "icon": "leaf",
        "description": "Warm-season vegetable and spice crop prone to Anthracnose, bacterial leaf spot, and Gemini leaf curl virus."
    },
    "Soybean": {
        "scientific_name": "Glycine max",
        "family": "Fabaceae",
        "icon": "leaf",
        "description": "Legume oilseed staple prone to frogeye leaf spot, Asian soybean rust, and bacterial blight."
    },
    "Papaya": {
        "scientific_name": "Carica papaya",
        "family": "Caricaceae",
        "icon": "leaf",
        "description": "Fast-growing tropical fruit plant vulnerable to papaya ringspot virus (PRSV), Anthracnose, and leaf spot."
    },
    "Guava": {
        "scientific_name": "Psidium guajava",
        "family": "Myrtaceae",
        "icon": "leaf",
        "description": "Hardy tropical fruit tree susceptible to guava wilt (Fusarium/Macrophomina), Anthracnose, and leaf canker."
    },
    "Strawberry": {
        "scientific_name": "Fragaria × ananassa",
        "family": "Rosaceae",
        "icon": "leaf",
        "description": "Low-growing perennial berry crop vulnerable to leaf scorch, powdery mildew, and angular leaf spot."
    },
    "Cucumber / Squash": {
        "scientific_name": "Cucumis sativus / Cucurbita spp.",
        "family": "Cucurbitaceae",
        "icon": "leaf",
        "description": "Vine crop family vulnerable to downy mildew (Pseudoperonospora), powdery mildew, and Anthracnose."
    },
    "Eggplant (Brinjal)": {
        "scientific_name": "Solanum melongena",
        "family": "Solanaceae",
        "icon": "leaf",
        "description": "Warm-season nightshade crop susceptible to Phomopsis blight, Cercospora leaf spot, and bacterial wilt."
    },
    "Sugarcane": {
        "scientific_name": "Saccharum officinarum",
        "family": "Poaceae",
        "icon": "leaf",
        "description": "Tall perennial grass crop vulnerable to red rot (Colletotrichum falcatum), rust, and smut."
    },
    "Coffee": {
        "scientific_name": "Coffea arabica",
        "family": "Rubiaceae",
        "icon": "leaf",
        "description": "Highland beverage crop severely impacted by Coffee Leaf Rust (Hemileia vastatrix) and brown eye spot."
    },
    "Tea": {
        "scientific_name": "Camellia sinensis",
        "family": "Theaceae",
        "icon": "leaf",
        "description": "Perennial evergreen shrub vulnerable to blister blight (Exobasidium vexans) and grey blight."
    },
    "Universal Plant Leaf": {
        "scientific_name": "Plantae spp. (General Foliage)",
        "family": "General Angiospermae",
        "icon": "leaf",
        "description": "General agricultural and horticultural plant foliage screened for universal foliar pathogens and chlorophyll health."
    }
}

UNIVERSAL_PATHOLOGY_GUIDANCE: Dict[str, Dict[str, Any]] = {
    "Healthy": {
        "symptoms": [
            "Vibrant, uniform green lamina across the leaf blade",
            "Intact vascular venation with no chlorotic halos",
            "Absence of necrotic spotting, rust pustules, or foliar lesions"
        ],
        "severity": "Healthy",
        "treatment": {
            "immediate_actions": [
                "No chemical or corrective curative sprays required.",
                "Continue standard balanced vegetative fertilization.",
                "Maintain consistent root-zone moisture without overwatering."
            ],
            "biological_treatments": [
                "Apply prophylactic seaweed extract (0.2%) or compost tea to boost plant immune vitality.",
                "Incorporate mycorrhizal fungi or Trichoderma harzianum at the root zone to sustain systemic resistance."
            ],
            "chemical_treatments": [
                "No synthetic fungicides or bactericides indicated for healthy foliage."
            ],
            "chemical_disclaimer": "Avoid applying unnecessary pesticides to protect beneficial predatory insects and pollinator populations.",
            "expert_notes": "Maintain regular weekly scouting to detect any airborne spore drift or early aphid/vector colonization."
        },
        "prevention": {
            "spacing": "Maintain optimal canopy air passage to prevent humid microclimates.",
            "sanitation": "Keep field perimeter free of wild weed hosts and decaying biomass.",
            "irrigation": "Employ drip irrigation or furrow watering to keep leaf surfaces dry.",
            "rotation": "Follow sustainable 3-year crop rotation with non-host botanical families.",
            "resistant_varieties": "Select certified certified disease-resistant seed and seedling stocks.",
            "monitoring": "Routine visual inspection of lower and mid-canopy leaves twice weekly."
        }
    },
    "Bacterial Blight": {
        "symptoms": [
            "Water-soaked, dark brown to black angular lesions delimited by leaf veinlets",
            "Yellow chlorotic halos surrounding necrotic leaf spots",
            "Premature defoliation or blighting of heavily affected leaf areas"
        ],
        "severity": "Severe",
        "treatment": {
            "immediate_actions": [
                "Halt all overhead sprinkler irrigation immediately to arrest water-splash bacterial dispersion.",
                "Prune heavily infected lower leaves using sanitized shears (sterilized in 70% alcohol).",
                "Do not cultivate or walk through wet crop foliage to prevent mechanical inoculation."
            ],
            "biological_treatments": [
                "Apply preventive Bacillus subtilis (QST 713 strain) or Bacillus amyloliquefaciens bio-fungicide.",
                "Spray organic copper octanoate (copper soap) according to certified organic standards."
            ],
            "chemical_treatments": [
                "Apply copper hydroxide (53.8% WG) or copper oxychloride in rotation with bactericides where locally approved.",
                "Where permitted by agricultural extension guidelines, apply agricultural streptomycin-oxytetracycline formulation."
            ],
            "chemical_disclaimer": "Strictly follow local pesticide safety intervals (PHI) and do not apply copper sprays during peak midday heat to avoid phytotoxicity.",
            "expert_notes": "Bacterial pathogens enter primarily through open stomata and mechanical wounds created by storms, insects, or equipment."
        },
        "prevention": {
            "spacing": "Ensure wider row spacing for rapid morning leaf drying through sunlight exposure.",
            "sanitation": "Deeply bury or destroy crop stubble post-harvest to eradicate overwintering bacteria.",
            "irrigation": "Strictly utilize subsurface drip or ground-level irrigation lines.",
            "rotation": "Rotate field away from susceptible botanical families for at least 2 consecutive seasons.",
            "resistant_varieties": "Plant certified acid-delinted or certified bacterial-blight-resistant hybrid seed varieties.",
            "monitoring": "Scout fields promptly after rainstorms or high-humidity wind events."
        }
    },
    "Early Blight / Leaf Spot": {
        "symptoms": [
            "Circular to irregular brown-black lesions showing concentric 'target-board' rings",
            "Yellow chlorotic tissue developing around mature necrotic spots",
            "Lower and older leaves developing lesions first, progressing upward through canopy"
        ],
        "severity": "Moderate",
        "treatment": {
            "immediate_actions": [
                "Prune and discard the lowest 30 cm of affected leaves touching or near soil level.",
                "Apply mulch around plant bases to create a physical barrier against soil-borne splash spores.",
                "Ensure balanced nitrogen nutrition; avoid nitrogen deficiency which accelerates Alternaria attack."
            ],
            "biological_treatments": [
                "Spray cold-pressed organic neem seed oil (0.5% concentration) emulsified with mild potassium soap.",
                "Apply Trichoderma viride or Bacillus bio-fungicide every 7 to 10 days."
            ],
            "chemical_treatments": [
                "Apply protective contact fungicides such as Mancozeb (75% WP) or Chlorothalonil.",
                "For active systemic control, alternate with Azoxystrobin + Difenoconazole according to label instructions."
            ],
            "chemical_disclaimer": "Rotate FRAC chemical modes of action to prevent fungal resistance development.",
            "expert_notes": "Alternaria spores germinate rapidly when leaves remain continuously wet for 4 or more hours at 24°C–29°C."
        },
        "prevention": {
            "spacing": "Stake or trellis climbing varieties to elevate foliage off ground level.",
            "sanitation": "Remove all volunteer host plants and infected crop debris after final picking.",
            "irrigation": "Water strictly in early morning so foliage dries quickly under daylight.",
            "rotation": "Practice 3-year crop rotation with non-solanaceous and non-host crops.",
            "resistant_varieties": "Select cultivars with documented tolerance or resistance to Alternaria.",
            "monitoring": "Check underside of lower canopy leaves once weekly during warm overcast periods."
        }
    },
    "Late Blight": {
        "symptoms": [
            "Irregular, rapidly expanding water-soaked dark greenish-brown lesions on leaf tips and margins",
            "Delicate white downy fungal-like sporulation visible on lesion undersides during humid mornings",
            "Rapid collapse, shriveling, and dark brown rotting of entire leaf blades and petiole stems"
        ],
        "severity": "Severe",
        "treatment": {
            "immediate_actions": [
                "Act immediately; Phytophthora infestans can destroy an entire field within 7–10 days.",
                "Eradicate and bag severely infected plant foci; do not add to open compost piles.",
                "Cease all surface flooding and overhead irrigation."
            ],
            "biological_treatments": [
                "Apply bio-protective copper sulfate or copper hydroxide formulations at first atmospheric disease alert.",
                "Foliar spray with potassium phosphite formulations to stimulate systemic acquired resistance (SAR)."
            ],
            "chemical_treatments": [
                "Apply translaminar/systemic oomycete fungicides: Metalaxyl-M + Mancozeb, Dimethomorph, or Cymoxanil.",
                "Follow up with protective Fluopicolide or Cyazofamid according to regional agricultural extension recommendations."
            ],
            "chemical_disclaimer": "Observe pre-harvest intervals (PHI) strictly before harvest. Always wear required protective PPE.",
            "expert_notes": "Late blight thrives during cool, fog-laden or cloudy periods (15°C–20°C) with prolonged relative humidity exceeding 90%."
        },
        "prevention": {
            "spacing": "Maximize inter-row distance and orient rows parallel to prevailing breezes.",
            "sanitation": "Destroy cull piles, self-sown volunteer plants, and infected residues.",
            "irrigation": "Use soil-moisture sensor-guided drip systems to avoid canopy wetting.",
            "rotation": "Avoid planting near potato or tomato fields; rotate fields for at least 3 years.",
            "resistant_varieties": "Plant certified disease-free tubers and certified late-blight-resistant cultivars.",
            "monitoring": "Subscribe to local regional late-blight forecasting and weather advisory alerts."
        }
    },
    "Rust": {
        "symptoms": [
            "Small, raised reddish-brown, orange, or golden-yellow pustules scattered across leaf surfaces",
            "Powdery rust spores rubbing off onto fingers when touched",
            "Extensive chlorosis, leaf drying, and premature leaf drop in severe infections"
        ],
        "severity": "Moderate",
        "treatment": {
            "immediate_actions": [
                "Strip off heavily pustule-laden lower leaves to curb aerial urediniospore spread.",
                "Avoid late afternoon or evening overhead irrigation."
            ],
            "biological_treatments": [
                "Apply wettable sulfur (80% WP) or micronized sulfur bio-formulation (check temperature limits).",
                "Spray bio-control agent Ampelomyces quisqualis or Bacillus subtilis."
            ],
            "chemical_treatments": [
                "Apply systemic triazole fungicides: Propiconazole (25% EC), Tebuconazole, or Hexaconazole.",
                "Alternate with strobilurin fungicides (e.g. Azoxystrobin) to manage resistance."
            ],
            "chemical_disclaimer": "Do not apply sulfur when temperatures exceed 32°C (90°F) to prevent severe leaf scorch.",
            "expert_notes": "Rust fungi are obligate parasites whose windborne spores travel tens of kilometers during breezy weather."
        },
        "prevention": {
            "spacing": "Plant at recommended density to permit good sunlight penetration through canopy.",
            "sanitation": "Eradicate alternate weed hosts in field borders that bridge fungal rust life cycles.",
            "irrigation": "Irrigate at ground level; rust spores require free moisture on leaves to germinate.",
            "rotation": "Rotate with non-susceptible cereal or broadleaf break crops.",
            "resistant_varieties": "Cultivate modern hybrid varieties with multi-gene rust resistance.",
            "monitoring": "Inspect field margins and prevailing windward rows weekly."
        }
    },
    "Powdery Mildew": {
        "symptoms": [
            "White, talcum-powder-like fungal patches appearing on upper and lower leaf surfaces",
            "Leaves becoming distorted, curling upward, yellowing, and drying prematurely",
            "Reduced photosynthesis causing stunted growth and poor fruit/grain filling"
        ],
        "severity": "Moderate",
        "treatment": {
            "immediate_actions": [
                "Prune crowded shoots to increase air circulation and reduce high humidity inside canopy.",
                "Ensure plants receive direct sunlight where feasible."
            ],
            "biological_treatments": [
                "Spray organic potassium bicarbonate (3g per liter) or diluted horticultural milk spray (1:9 ratio).",
                "Apply cold-pressed neem seed oil or organic sulfur."
            ],
            "chemical_treatments": [
                "Apply systemic fungicides: Myclobutanil, Penconazole, or Kresoxim-methyl as per label specifications."
            ],
            "chemical_disclaimer": "Never mix sulfur sprays with agricultural oils; observe a 14-day gap between oil and sulfur.",
            "expert_notes": "Unlike most fungi, powdery mildew spores can germinate in high humidity even in the absence of free standing water."
        },
        "prevention": {
            "spacing": "Avoid dense crowding; thin canopy regularly.",
            "sanitation": "Collect and burn or bury fallen mildew-infected leaves before winter.",
            "irrigation": "Avoid excessive nitrogen fertilizers which produce vulnerable succulent growth.",
            "rotation": "Practice annual rotation in vegetable gardens and annual cropping beds.",
            "resistant_varieties": "Select resistant seed varieties carrying powdery mildew resistance genes.",
            "monitoring": "Examine shaded and sheltered lower leaves where mildew usually begins."
        }
    },
    "Anthracnose": {
        "symptoms": [
            "Dark, sunken circular or irregular necrotic spots on leaves and stems",
            "Lesions coalescing into large necrotic blights with tiny pinkish or salmon-colored spore masses",
            "Severe leaf drop, twig dieback, and dark blossom blight"
        ],
        "severity": "Severe",
        "treatment": {
            "immediate_actions": [
                "Prune out blighted twigs and heavily spotted leaves during dry weather.",
                "Sterilize pruning equipment between cuts."
            ],
            "biological_treatments": [
                "Apply copper-based fungicides (Bordeaux mixture 1% or copper oxychloride).",
                "Foliar applications of Trichoderma or Pseudomonas fluorescens formulations."
            ],
            "chemical_treatments": [
                "Apply systemic fungicides such as Carbendazim, Thiophanate-methyl, or Difenoconazole."
            ],
            "chemical_disclaimer": "Adhere strictly to label rates and local agricultural regulations.",
            "expert_notes": "Anthracnose fungi (Colletotrichum spp.) are splash-dispersed and become highly aggressive in warm, wet weather."
        },
        "prevention": {
            "spacing": "Prune open canopy architecture to accelerate solar drying.",
            "sanitation": "Remove mummified fruit, fallen leaves, and diseased twigs from orchard floor.",
            "irrigation": "Avoid overhead watering during flowering and new leaf flush.",
            "rotation": "Rotate annual crops for at least 2–3 seasons.",
            "resistant_varieties": "Plant certified disease-free nursery stock.",
            "monitoring": "Monitor closely during seasonal monsoon or prolonged rain periods."
        }
    },
    "Viral Leaf Curl / Mosaic": {
        "symptoms": [
            "Upward or downward curling, puckering, and stunting of young emerging leaves",
            "Interveinal mosaic mottling with alternating light green and dark green patches",
            "Severe plant stunting, shortened internodes, and bushy compact growth"
        ],
        "severity": "Severe",
        "treatment": {
            "immediate_actions": [
                "Viruses cannot be cured once inside plant cells. Rogue and destroy infected plants immediately.",
                "Control sap-sucking insect vectors (whiteflies, aphids, thrips) to prevent spread to healthy plants."
            ],
            "biological_treatments": [
                "Deploy yellow sticky traps (15–20 per acre) to monitor and capture flying whiteflies/aphids.",
                "Spray insecticidal neem oil (10,000 ppm) or horticultural soap to suppress vector populations.",
                "Introduce natural predators such as ladybird beetles, lacewing larvae, and Encarsia parasitoids."
            ],
            "chemical_treatments": [
                "Apply systemic insecticide for vector control: Acetamiprid, Thiamethoxam, or Imidacloprid where approved.",
                "Follow local extension advice on IPM rotation of insecticides to avoid vector resistance."
            ],
            "chemical_disclaimer": "Do not apply broad-spectrum insecticides during peak pollinator foraging hours.",
            "expert_notes": "Gemini viruses and Potyviruses are transmitted primarily by Bemisia tabaci (whitefly) in as little as 15 minutes of feeding."
        },
        "prevention": {
            "spacing": "Erect 40-mesh insect-proof nylon barrier netting around nursery beds.",
            "sanitation": "Eradicate perennial weed hosts (e.g. Parthenium, nightshades) around field borders.",
            "irrigation": "Maintain robust irrigation and balanced potassium nutrition to enhance natural plant defense.",
            "rotation": "Observe a crop-free host period between seasons to break vector life cycles.",
            "resistant_varieties": "Choose certified virus-resistant hybrids (carrying Ty or ToLCV resistance genes).",
            "monitoring": "Check undersides of young leaves daily for whitefly or aphid colonization."
        }
    },
    "Chlorosis / Nutrient Deficiency": {
        "symptoms": [
            "Pale yellowing of leaf tissue while leaf veins remain distinctly green (interveinal chlorosis)",
            "Uniform pale green to light yellow discoloration starting from older leaves (Nitrogen deficiency)",
            "Absence of necrotic fungal spots or bacterial water-soaked lesions"
        ],
        "severity": "Mild",
        "treatment": {
            "immediate_actions": [
                "Perform a rapid soil or foliar tissue test to determine exact micronutrient/macronutrient levels.",
                "Check soil pH; high soil pH (> 7.5) often locks up iron, zinc, and manganese."
            ],
            "biological_treatments": [
                "Apply foliar chelated iron (Fe-EDTA 0.1%) or multi-micronutrient mixture spray.",
                "Drench soil with well-decomposed organic farmyard manure, vermicompost, and humic acid."
            ],
            "chemical_treatments": [
                "Apply balanced N-P-K (19-19-19) water-soluble fertilizer via fertigation or foliar spray (0.5%).",
                "Apply zinc sulfate (0.5%) + agricultural lime (0.25%) if zinc deficiency is confirmed."
            ],
            "chemical_disclaimer": "Do not exceed recommended foliar fertilizer concentrations to prevent leaf burn.",
            "expert_notes": "Chlorosis is a physiological condition, not a contagious biotic pathogen, and responds rapidly to corrective feeding."
        },
        "prevention": {
            "spacing": "Ensure proper root zone volume without severe root competition.",
            "sanitation": "Amend soil with organic matter regularly to improve cation exchange capacity (CEC).",
            "irrigation": "Avoid waterlogging; anaerobic root zones prevent micronutrient uptake.",
            "rotation": "Incorporate green manure leguminous cover crops (sunn hemp, dhaincha) to enrich nitrogen.",
            "resistant_varieties": "Select rootstocks adapted to local soil alkalinity or salinity conditions.",
            "monitoring": "Monitor leaf chlorophyll color after heavy rain or during rapid growth flushes."
        }
    }
}

def get_guidance_for_condition(crop: str, disease: str) -> Dict[str, Any]:
    """
    Returns robust, farmer-ready guidance for any crop and disease combination.
    Gracefully matches specific disease patterns or provides tailored universal protocol.
    """
    d_lower = disease.lower()
    
    if "healthy" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Healthy"]
    elif "bacterial" in d_lower or "angular" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Bacterial Blight"]
    elif "late blight" in d_lower or "phytophthora" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Late Blight"]
    elif "early blight" in d_lower or "spot" in d_lower or "scab" in d_lower or "canker" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Early Blight / Leaf Spot"]
    elif "rust" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Rust"]
    elif "powdery" in d_lower or "mildew" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Powdery Mildew"]
    elif "anthracnose" in d_lower or "rot" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Anthracnose"]
    elif "curl" in d_lower or "mosaic" in d_lower or "virus" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Viral Leaf Curl / Mosaic"]
    elif "chlorosis" in d_lower or "deficiency" in d_lower or "yellow" in d_lower:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Chlorosis / Nutrient Deficiency"]
    else:
        base = UNIVERSAL_PATHOLOGY_GUIDANCE["Early Blight / Leaf Spot"]

    # Customize slightly with crop name for farmer clarity
    crop_name = crop if crop and crop.lower() not in ["other", "auto"] else "Foliage"
    
    # Return structured copy
    return {
        "crop": crop_name,
        "disease": disease,
        "symptoms": [s.replace("leaf", f"{crop_name.lower()} leaf") for s in base["symptoms"]],
        "severity": base["severity"],
        "treatment": base["treatment"],
        "prevention": base["prevention"]
    }
