import os
import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import json
import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database.connection import engine, Base, SessionLocal
from database.models import User, Crop, Disease, TreatmentGuidance, PreventionGuidance, ModelVersion, Detection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

false = False
true = True

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

CROP_DATA = [
    {
        "name": "Tomato",
        "scientific_name": "Solanum lycopersicum",
        "icon": "apple",
        "description": "Widely cultivated solanaceous crop susceptible to fungal blights and bacterial spots.",
        "diseases": [
            {
                "name": "Early Blight",
                "common_name": "Target Spot Blight",
                "pathogen_type": "Fungal (Alternaria solani)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Common fungal disease causing dark brown concentric rings ('target board') on older foliage.",
                "symptoms": [
                    "Circular brown-black spots with concentric rings resembling a target board",
                    "Chlorosis (yellowing) surrounding the lesion margins",
                    "Premature lower leaf drop, progressing upward",
                    "Sunscald risk on exposed fruit due to defoliation"
                ],
                "immediate_actions": [
                    "Prune and safely dispose of heavily infected lower leaves; do not compost in the field.",
                    "Disinfect pruning shears with 70% alcohol or 10% bleach solution between cuts.",
                    "Avoid overhead irrigation immediately to keep foliage dry."
                ],
                "biological_treatments": [
                    "Apply Trichoderma harzianum or Bacillus subtilis bio-fungicide sprays early morning.",
                    "Spray copper octanoate (copper soap) or diluted neem seed oil (0.5%) for organic containment.",
                    "Mulch the base with clean straw to prevent soil-splash onto lower canopy."
                ],
                "chemical_treatments": [
                    "Chlorothalonil or Mancozeb protective sprays upon first symptom detection.",
                    "Azoxystrobin or Difenoconazole curative systemic fungicides for moderate-to-severe outbreaks."
                ],
                "chemical_disclaimer": "Chemical applications must adhere strictly to local agricultural authority guidelines, pre-harvest intervals (PHI), and safety label equipment.",
                "expert_notes": "Warm humid conditions (24-29°C) accelerate spore development. Regular field scouting is vital.",
                "spacing": "Maintain 45–60 cm between plants and 90 cm between rows to ensure rapid foliage drying.",
                "sanitation": "Burn or bury crop residue immediately post-harvest. Sterilize stakes and cages.",
                "irrigation": "Use drip irrigation instead of sprinkler/overhead systems to minimize leaf wetness duration.",
                "rotation": "Rotate non-solanaceous crops (e.g., corn, legumes) for at least 3 seasons.",
                "resistant_varieties": "Select certified resistant cultivars such as 'Mountain Supreme', 'Defiant PhR', or 'Iron Lady'.",
                "monitoring": "Inspect undersides of lowest leaves twice weekly during damp weather."
            },
            {
                "name": "Late Blight",
                "common_name": "Phytophthora Blight",
                "pathogen_type": "Oomycete (Phytophthora infestans)",
                "default_severity": "Severe",
                "is_healthy": false,
                "description": "Devastating water mold causing water-soaked pale-green lesions that rapidly turn brown/purple with white fungal fuzz.",
                "symptoms": [
                    "Large, irregular water-soaked spots turning rapidly dark brown to purplish-black",
                    "Delicate white cottony mildew under leaf surfaces during cool humid mornings",
                    "Rapid leaf collapse and foul decaying odor in the field",
                    "Firm, greasy brown rot patches developing on green and ripe fruits"
                ],
                "immediate_actions": [
                    "Immediately remove and bag entirely collapsed plants during dry midday hours.",
                    "Notify surrounding farm cooperative members as spores travel long distances on the wind.",
                    "Halt all irrigation and maintain maximum airflow around remaining plants."
                ],
                "biological_treatments": [
                    "Copper hydroxide / Bordeaux mixture application as a preventive barrier before rains.",
                    "Strengthen plant immunity with potassium phosphite foliar sprays."
                ],
                "chemical_treatments": [
                    "Metalaxyl-M (Mefenoxam) + Mancozeb combination for rapid systemic stoppage.",
                    "Cymoxanil + Famoxadone or Dimethomorph applied according to local resistance management protocols."
                ],
                "chemical_disclaimer": "Always observe resistance rotation and never repeat single-site fungicides consecutively.",
                "expert_notes": "Late blight can destroy an entire field within 7–10 days under continuous fog or rain.",
                "spacing": "Wide row spacing (100–120 cm) in flood-prone or foggy microclimates.",
                "sanitation": "Destroy volunteer tomato and potato plants in and around the farm perimeter.",
                "irrigation": "Avoid evening watering. Water only early morning via root-level drip lines.",
                "rotation": "Avoid planting directly after potatoes or peppers.",
                "resistant_varieties": "Plant triple-resistant lines: 'Plum Regal', 'Mountain Magic', 'Stupice'.",
                "monitoring": "Daily monitoring during periods of 15–22°C temperatures with relative humidity > 90%."
            },
            {
                "name": "Yellow Leaf Curl Virus",
                "common_name": "TYLCV",
                "pathogen_type": "Viral (Begomovirus transmitted by Whiteflies)",
                "default_severity": "Severe",
                "is_healthy": false,
                "description": "Vector-borne viral disease causing dramatic upward cupping, severe leaf stunting, and bushy yellowing.",
                "symptoms": [
                    "Upward curling and severe crumpling of terminal leaves",
                    "Prominent chlorosis (pale yellowing) of leaf margins and interveinal spaces",
                    "Severe plant stunting, shortened internodes creating a bonsai/bushy appearance",
                    "Flower abortion leading to near-total failure of fruit set"
                ],
                "immediate_actions": [
                    "Rogue (uproot) infected plants immediately, place in plastic bags, and destroy away from the field.",
                    "Install yellow sticky traps (1 trap per 50 sq meters) to trap whitefly vectors."
                ],
                "biological_treatments": [
                    "Release predatory biocontrol agents such as Encarsia formosa or Chrysoperla carnea.",
                    "Spray neem oil (azadirachtin 1%) weekly to deter whitefly feeding and egg oviposition."
                ],
                "chemical_treatments": [
                    "Target whitefly vectors with Imidacloprid, Acetamiprid, or Spiromesifen as prescribed.",
                    "Rotate active ingredients to prevent whitefly pesticide resistance."
                ],
                "chemical_disclaimer": "Insecticides target the vector (whitefly), not the virus itself. Wear personal protective gear.",
                "expert_notes": "Once infected, the plant cannot be cured of the virus; focus on vector control.",
                "spacing": "Ensure perimeter barriers and insect-proof 50-mesh netting in nurseries.",
                "sanitation": "Eliminate alternate weed hosts like wild nightshade, Lantana, and Parthenium.",
                "irrigation": "Balanced irrigation; avoid excessive nitrogen fertilizer which attracts whiteflies.",
                "rotation": "Fallow fields or rotate with non-host crops like cereals or brassicas.",
                "resistant_varieties": "Use TYLCV-resistant hybrids such as 'US-440', 'Abhinav', 'Ayushman', or 'Tyking'.",
                "monitoring": "Inspect undersides of young leaves for tiny white fluttering insects daily."
            },
            {
                "name": "Bacterial Spot",
                "common_name": "Bacterial Spot of Tomato",
                "pathogen_type": "Bacterial (Xanthomonas spp.)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Bacterial infection causing tiny water-soaked dark spots that enlarge into scab-like lesions.",
                "symptoms": [
                    "Small circular water-soaked spots (1-3 mm) turning dark brown with greasy margins",
                    "Yellow halo surrounding active lesions during damp weather",
                    "Shot-hole appearance where dead leaf center falls out",
                    "Raised black scabby blisters on green tomato skin"
                ],
                "immediate_actions": [
                    "Never enter or work in fields while foliage is wet from morning dew or rain.",
                    "Remove and destroy badly infected leaves during dry afternoons."
                ],
                "biological_treatments": [
                    "Apply copper oxychloride combined with Bacillus amyloliquefaciens.",
                    "Foliar applications of agricultural streptomycin only where legally certified."
                ],
                "chemical_treatments": [
                    "Fixed copper bactericides combined with Mancozeb to enhance copper efficacy."
                ],
                "chemical_disclaimer": "Do not exceed maximum seasonal copper limits to prevent soil toxicity.",
                "expert_notes": "Bacteria enter through stomata and wounds created by wind-blown sand or heavy rains.",
                "spacing": "Ensure wide spacing and staking to elevate foliage above soil splash.",
                "sanitation": "Use hot-water treated or certified disease-free seeds (50°C for 25 mins).",
                "irrigation": "Sub-surface or drip irrigation; strictly avoid sprinklers.",
                "rotation": "Rotate crops for at least 2 years without tomatoes, peppers, or eggplants.",
                "resistant_varieties": "Select tolerant varieties labeled with resistance to Xanthomonas races 1-4.",
                "monitoring": "Scout fields following wind-driven rainstorms."
            },
            {
                "name": "Septoria Leaf Spot",
                "common_name": "Septoria",
                "pathogen_type": "Fungal (Septoria lycopersici)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Prolific fungal spot distinguished by small circular lesions with grayish centers and tiny black pycnidia speckles.",
                "symptoms": [
                    "Numerous tiny circular spots (2-3 mm) with ash-grey centers and dark brown borders",
                    "Tiny black pinpoint dots (pycnidia fruiting bodies) visible in the center with a hand lens",
                    "Leaves yellow progressively and wither from the bottom upward"
                ],
                "immediate_actions": [
                    "Strip lower 30 cm of leaves (prune skirt) to stop splash transmission.",
                    "Stake and cage plants off the soil."
                ],
                "biological_treatments": [
                    "Copper soap spray every 7–10 days during warm humid intervals.",
                    "Biological foliar spray with Serenade ASO (Bacillus subtilis)."
                ],
                "chemical_treatments": [
                    "Preventive Chlorothalonil or copper fungicides; systemic Difenoconazole if spreading."
                ],
                "chemical_disclaimer": "Respect designated pre-harvest intervals (PHI) before picking tomatoes.",
                "expert_notes": "Does not directly infect fruit, but rapid defoliation drastically reduces fruit yield and causes sunscald.",
                "spacing": "60 cm plant spacing to optimize cross-canopy air circulation.",
                "sanitation": "Bury all tomato vines deep in soil or remove from site immediately after final harvest.",
                "irrigation": "Water root zone only; avoid wetting canopy.",
                "rotation": "Minimum 2-year rotation with non-solanaceous crops.",
                "resistant_varieties": "Look for moderately tolerant varieties; combine with organic mulching.",
                "monitoring": "Check lowest leaves weekly starting 3 weeks after transplanting."
            },
            {
                "name": "Healthy",
                "common_name": "Vigorous Tomato Leaf",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Vigorous, dark-green foliage free from fungal lesions, chlorosis, or bacterial spotting.",
                "symptoms": [
                    "Uniform deep green leaf blade coloration",
                    "Turgid leaves with clean serrated margins and no curling",
                    "Absence of spots, lesions, fuzz, or vector insects",
                    "Robust stem growth and normal flower development"
                ],
                "immediate_actions": [
                    "No corrective action required. Continue regular scouting routine.",
                    "Record healthy status in your digital crop log."
                ],
                "biological_treatments": [
                    "Continue prophylactic foliar seaweed extract or mycorrhizal root drenches."
                ],
                "chemical_treatments": [
                    "None required. Avoid unnecessary prophylactic chemical sprays."
                ],
                "chemical_disclaimer": "Avoid chemical treatment on healthy foliage to preserve beneficial insect populations.",
                "expert_notes": "Maintaining balanced soil organic matter and micronutrients preserves natural disease resistance.",
                "spacing": "Continue standard recommended canopy spacing.",
                "sanitation": "Keep tools clean and field borders free of weeds.",
                "irrigation": "Maintain consistent, scheduled drip irrigation.",
                "rotation": "Plan ahead for seasonal rotation.",
                "resistant_varieties": "Keep records of successful seeds.",
                "monitoring": "Routine scouting every 5–7 days."
            }
        ]
    },
    {
        "name": "Potato",
        "scientific_name": "Solanum tuberosum",
        "icon": "circle-dot",
        "description": "Tuber crop highly vulnerable to Phytophthora late blight and Alternaria leaf blights.",
        "diseases": [
            {
                "name": "Early Blight",
                "common_name": "Alternaria Leaf Spot",
                "pathogen_type": "Fungal (Alternaria solani)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Dark brown circular spots with concentric rings appearing on mature potato foliage.",
                "symptoms": [
                    "Concentric dark rings forming target pattern on older leaves",
                    "Yellow halos around spots leading to necrosis",
                    "Premature vine dying and reduced tuber bulk"
                ],
                "immediate_actions": [
                    "Maintain soil moisture to prevent plant stress which accelerates Alternaria attack.",
                    "Remove heavily blighted vines if isolated."
                ],
                "biological_treatments": [
                    "Bacillus subtilis foliar application.",
                    "Copper-based bio-friendly fungicidal sprays."
                ],
                "chemical_treatments": [
                    "Mancozeb or Metiram preventive sprays.",
                    "Boscalid, Pyraclostrobin, or Difenoconazole curative fungicides."
                ],
                "chemical_disclaimer": "Follow label instructions for harvest interval and personal safety equipment.",
                "expert_notes": "Stressed plants (nitrogen deficiency or drought) are significantly more susceptible.",
                "spacing": "30 cm within row, 75 cm between rows.",
                "sanitation": "Destroy cull piles of rejected potato tubers.",
                "irrigation": "Irrigate in morning hours to allow leaves to dry before nightfall.",
                "rotation": "Rotate with corn, wheat, or pasture grasses for 3 years.",
                "resistant_varieties": "Cultivars like 'Kennebec', 'Defender', or 'Kufri Jyoti'.",
                "monitoring": "Check lower canopy leaves every 4 days after tuber initiation."
            },
            {
                "name": "Late Blight",
                "common_name": "Irish Potato Blight",
                "pathogen_type": "Oomycete (Phytophthora infestans)",
                "default_severity": "Severe",
                "is_healthy": false,
                "description": "Rapidly destructive water-mold causing brown-black leaf necrosis and tuber rot.",
                "symptoms": [
                    "Irregular pale water-soaked spots turning blackish-brown",
                    "White mold growth on leaf undersides in morning dampness",
                    "Foul smell of decaying tissue across the field",
                    "Dry brownish-red rot in tubers under the skin"
                ],
                "immediate_actions": [
                    "Kill and remove infected vines 2 weeks prior to harvest to prevent tuber contamination.",
                    "Spray approved fungicide immediately across entire field block."
                ],
                "biological_treatments": [
                    "Bordeaux mixture or copper hydroxide preventive protection."
                ],
                "chemical_treatments": [
                    "Cymoxanil + Mancozeb or Dimethomorph + Mancozeb.",
                    "Propamocarb or Mandipropamid systemic fungicides."
                ],
                "chemical_disclaimer": "Strictly follow resistance management guidelines and local agricultural extensions.",
                "expert_notes": "Spores can wash into soil during rain and infect developing tubers.",
                "spacing": "Ensure adequate hilling of soil over tubers to create a physical spore barrier.",
                "sanitation": "Destroy all volunteer potato plants and cull piles.",
                "irrigation": "Never use sprinkler irrigation during blight weather warnings.",
                "rotation": "Do not rotate with tomatoes or eggplants.",
                "resistant_varieties": "Kufri Girdhari, Kufri Himalini, Sarpo Mira.",
                "monitoring": "Daily monitoring when temperature is 10-20°C and RH exceeds 85%."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Potato Foliage",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Vibrant, bushy potato canopy with rich green leaves and sturdy stems.",
                "symptoms": [
                    "Clean, crisp deep-green leaflets",
                    "No spots, necrotic margins, or downy mold",
                    "Sturdy vine structure with healthy budding"
                ],
                "immediate_actions": [
                    "Continue good cultural management practices.",
                    "Ensure adequate soil hilling over developing tubers."
                ],
                "biological_treatments": [
                    "Maintain soil organic matter and beneficial microflora."
                ],
                "chemical_treatments": [
                    "None needed."
                ],
                "chemical_disclaimer": "Avoid prophylactic chemical use on healthy crops.",
                "expert_notes": "Keep soil evenly moist during the critical tuber bulking stage.",
                "spacing": "Maintain standard spacing.",
                "sanitation": "Keep perimeter ditches clean.",
                "irrigation": "Uniform drip or furrow irrigation.",
                "rotation": "Plan next season's crop rotation.",
                "resistant_varieties": "Use certified seed tubers each season.",
                "monitoring": "Weekly field inspection."
            }
        ]
    },
    {
        "name": "Corn",
        "scientific_name": "Zea mays",
        "icon": "wheat",
        "description": "Major staple cereal crop prone to foliar rusts and blights.",
        "diseases": [
            {
                "name": "Common Rust",
                "common_name": "Maize Rust",
                "pathogen_type": "Fungal (Puccinia sorghi)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal rust creating powdery reddish-brown pustules scattered across both leaf surfaces.",
                "symptoms": [
                    "Oval to elongate reddish-brown cinnamon pustules on both upper and lower leaf surfaces",
                    "Pustules rupture epidermal tissue releasing rust-colored powdery spores",
                    "Chlorosis and premature leaf death in severe cases"
                ],
                "immediate_actions": [
                    "Assess whether infection is occurring before or after silking; treatment is critical prior to grain fill."
                ],
                "biological_treatments": [
                    "Bacillus pumilus bio-fungicide formulations in early stages."
                ],
                "chemical_treatments": [
                    "Triazole fungicides (Propiconazole, Tebuconazole) or Strobilurins (Azoxystrobin)."
                ],
                "chemical_disclaimer": "Consult local extension thresholds before spraying, as late-season rust rarely pays to treat.",
                "expert_notes": "Favored by cool, humid weather (16-25°C). Spores blow in from southerly regions.",
                "spacing": "Ensure proper planting density (approx 60,000 to 75,000 plants per hectare).",
                "sanitation": "Chop and incorporate corn residue to encourage decomposition.",
                "irrigation": "Avoid prolonged overhead pivot irrigation in cool evenings.",
                "rotation": "Rotate with soybeans, legumes, or cotton.",
                "resistant_varieties": "Plant hybrids with Rp gene-mediated resistance to Puccinia sorghi.",
                "monitoring": "Scout upper 4 leaves around ear leaf during tasseling."
            },
            {
                "name": "Northern Leaf Blight",
                "common_name": "Turcicum Leaf Blight",
                "pathogen_type": "Fungal (Exserohilum turcicum)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Large cigar-shaped grayish-green to tan lesions that can cause extensive leaf blighting.",
                "symptoms": [
                    "Long, elliptical, cigar-shaped grayish-green lesions (2.5 to 15 cm long)",
                    "Lesions turn tan and show dark spore dust in humid periods",
                    "Extensive blighting leaving corn field looking frosted or drought-scorched"
                ],
                "immediate_actions": [
                    "Scout the lower and ear leaves; determine if >50% of plants show lesions at silking."
                ],
                "biological_treatments": [
                    "Trichoderma viride seed treatment and foliar bio-fungicide."
                ],
                "chemical_treatments": [
                    "Foliar fungicides: Pyraclostrobin + Fluxapyroxad or Azoxystrobin + Propiconazole."
                ],
                "chemical_disclaimer": "Follow safe handling guidelines; observe mandatory harvest intervals.",
                "expert_notes": "Fungus overwinters in corn residue; no-till fields require heightened vigilance.",
                "spacing": "Optimize row spacing to maximize airflow.",
                "sanitation": "Till under heavily infected crop residues where conservation tillage permits.",
                "irrigation": "Avoid excessive wetness on foliage during overcast days.",
                "rotation": "Rotate away from continuous corn to non-host crops.",
                "resistant_varieties": "Plant certified resistant hybrids with Ht1, Ht2, or Ht3 resistance genes.",
                "monitoring": "Inspect 20 plants across 5 representative locations in the field weekly."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Corn Foliage",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Broad, vibrant green leaves with strong central midribs and clean leaf blades.",
                "symptoms": [
                    "Uniform rich emerald green leaf color",
                    "Smooth blades without pustules or lesions",
                    "Strong erect stalk development"
                ],
                "immediate_actions": ["Continue scheduled fertilization and pest scouting."],
                "biological_treatments": ["Maintain balanced nitrogen and soil biological activity."],
                "chemical_treatments": ["None required."],
                "chemical_disclaimer": "Avoid unnecessary chemical applications.",
                "expert_notes": "Healthy ear leaves contribute over 60% of grain fill carbohydrates.",
                "spacing": "Maintain uniform stand count.",
                "sanitation": "Keep row middles free from aggressive weeds.",
                "irrigation": "Maintain adequate moisture during pollination.",
                "rotation": "Plan annual corn-soybean rotation.",
                "resistant_varieties": "Use high-yielding adapted seed hybrids.",
                "monitoring": "Scout bi-weekly."
            }
        ]
    },
    {
        "name": "Apple",
        "scientific_name": "Malus domestica",
        "icon": "apple",
        "description": "High-value orchard fruit susceptible to apple scab, cedar rust, and rot fungi.",
        "diseases": [
            {
                "name": "Apple Scab",
                "common_name": "Venturia Scab",
                "pathogen_type": "Fungal (Venturia inaequalis)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal disease causing olive-green velvety spots that turn dark and corky on leaves and fruit.",
                "symptoms": [
                    "Velvety olive-green circular spots turning blackish-brown",
                    "Leaf curling, puckering, and yellowing around lesions",
                    "Premature summer leaf drop",
                    "Corky brown scabby lesions on developing apples"
                ],
                "immediate_actions": [
                    "Rake, flail-mow, or shred fallen autumn leaves to eliminate overwintering ascospore sources."
                ],
                "biological_treatments": [
                    "Sulfur or lime-sulfur sprays applied before wet infection periods.",
                    "Spray 5% agricultural urea solution onto fallen leaves in late autumn."
                ],
                "chemical_treatments": [
                    "Captan or Mancozeb protectant sprays during green tip through petal fall.",
                    "Myclobutanil, Difenoconazole, or Cyprodinil curative sprays."
                ],
                "chemical_disclaimer": "Observe strict bee safety windows; never apply insecticides/fungicides harmful to pollinators during bloom.",
                "expert_notes": "Primary infection periods coincide with spring rain showers at bud break.",
                "spacing": "Prune tree canopies to an open-vase or central-leader shape for rapid solar drying.",
                "sanitation": "Clear orchard floor of mummified fruit and debris.",
                "irrigation": "Use micro-sprinklers directed at ground level; never wet canopy.",
                "rotation": "Perennial orchard management.",
                "resistant_varieties": "Plant scab-immune cultivars: 'Liberty', 'Freedom', 'Enterprise', 'Pristine'.",
                "monitoring": "Track Mills infection periods using orchard weather stations."
            },
            {
                "name": "Black Rot",
                "common_name": "Frogeye Leaf Spot",
                "pathogen_type": "Fungal (Botryosphaeria obtusa)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Causes frogeye leaf spots, branch cankers, and dark rotting of fruit.",
                "symptoms": [
                    "Small purple leaf spots that enlarge into tan centers with purple rims ('frogeye')",
                    "Sunken, reddish-brown bark cankers on limbs",
                    "Black mummified apples clinging to branches through winter"
                ],
                "immediate_actions": [
                    "Prune out dead wood, fire blight strikes, and cankered limbs during winter dormancy.",
                    "Remove and destroy all mummified apples from trees and orchard floor."
                ],
                "biological_treatments": [
                    "Copper sprays at dormant bud swell.",
                    "Bio-fungicides based on Bacillus amyloliquefaciens."
                ],
                "chemical_treatments": [
                    "Captan or Thiophanate-methyl foliar applications."
                ],
                "chemical_disclaimer": "Adhere strictly to pre-harvest intervals and maximum seasonal dosage limits.",
                "expert_notes": "Cankers often initiate at wounds caused by winter cold injury or mechanical pruning cuts.",
                "spacing": "Open canopy pruning to maximize sunlight penetration.",
                "sanitation": "Chop and burn pruned diseased brush immediately.",
                "irrigation": "Avoid water stress.",
                "rotation": "Orchard hygiene.",
                "resistant_varieties": "Select well-adapted rootstocks and vigorous scion wood.",
                "monitoring": "Scout during early petal fall."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Apple Foliage",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Lush, serrated green apple leaves with glossy finish and vigorous shoot extension.",
                "symptoms": [
                    "Glossy deep-green leaves with clean margins",
                    "Uniform shoot extension and healthy fruit cluster development",
                    "Free of velvety patches, frogeye circles, or powdery mildew"
                ],
                "immediate_actions": ["Maintain integrated pest and disease monitoring schedule."],
                "biological_treatments": ["Apply foliar micronutrient and calcium sprays as scheduled."],
                "chemical_treatments": ["None."],
                "chemical_disclaimer": "No chemicals required.",
                "expert_notes": "Healthy foliage produces optimal carbohydrate supply for crisp fruit sizing.",
                "spacing": "Continue summer pruning for canopy aeration.",
                "sanitation": "Mow orchard floor grasses.",
                "irrigation": "Scheduled drip irrigation.",
                "rotation": "Continuous orchard management.",
                "resistant_varieties": "Maintain healthy scion vitality.",
                "monitoring": "Weekly orchard scouting."
            }
        ]
    },
    {
        "name": "Grape",
        "scientific_name": "Vitis vinifera",
        "icon": "grape",
        "description": "Vineyard crop sensitive to black rot, esca, downy mildew, and powdery mildew.",
        "diseases": [
            {
                "name": "Black Rot",
                "common_name": "Grape Black Rot",
                "pathogen_type": "Fungal (Guignardia bidwellii)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal disease causing reddish-brown circular leaf spots and black shriveled berry mummies.",
                "symptoms": [
                    "Reddish-brown circular spots on leaves with black border and black fruiting dots",
                    "Shoots display elongated black cankers",
                    "Berries turn brown, soften, and shrivel into hard black wrinkled mummies"
                ],
                "immediate_actions": [
                    "Prune out mummified berry clusters and infected shoots during winter dormancy."
                ],
                "biological_treatments": [
                    "Sulfur or copper fungicide sprays applied before rain events.",
                    "Bio-rational potassium bicarbonate applications."
                ],
                "chemical_treatments": [
                    "Mancozeb or Ziram before bloom; Myclobutanil, Tebuconazole, or Kresoxim-methyl post-bloom."
                ],
                "chemical_disclaimer": "Respect winery export withholding periods and local viticulture restrictions.",
                "expert_notes": "Berries become resistant to black rot 4–5 weeks after bloom.",
                "spacing": "Trellis and train vines to maintain an open canopy (VSP or Scott Henry system).",
                "sanitation": "Drop mummies to ground and disc or bury under soil.",
                "irrigation": "Drip irrigation below the fruiting wire.",
                "rotation": "Vineyard perennial management.",
                "resistant_varieties": "French-American hybrids (e.g., 'Norton', 'Chambourcin') have higher tolerance.",
                "monitoring": "Scout from bud break through veraison."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Grapevine Leaf",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Lobed, clean green grapevine foliage without fungal discoloration or leaf roll.",
                "symptoms": [
                    "Broad, turgid lobed green leaves",
                    "Clean veins without necrosis or speckling",
                    "Healthy tendril elongation and cluster development"
                ],
                "immediate_actions": ["Maintain canopy leaf pulling and shoot positioning."],
                "biological_treatments": ["Apply foliar seaweed or trace element formulations."],
                "chemical_treatments": ["None."],
                "chemical_disclaimer": "Avoid chemical sprays.",
                "expert_notes": "Balanced canopy-to-crop ratio ensures premium fruit sugar and polyphenol maturity.",
                "spacing": "Ensure proper shoot thinning (3–5 shoots per linear foot).",
                "sanitation": "Maintain clean vineyard rows.",
                "irrigation": "Regulated deficit irrigation (RDI) post-veraison.",
                "rotation": "Vineyard management.",
                "resistant_varieties": "Certified disease-free grafted rootstocks.",
                "monitoring": "Weekly scouting of outer and interior canopy."
            }
        ]
    },
    {
        "name": "Rice",
        "scientific_name": "Oryza sativa",
        "icon": "sprout",
        "description": "Vital global paddy cereal vulnerable to blast, bacterial leaf blight, and brown spot.",
        "diseases": [
            {
                "name": "Leaf Blast",
                "common_name": "Pyricularia Blast",
                "pathogen_type": "Fungal (Magnaporthe oryzae)",
                "default_severity": "Severe",
                "is_healthy": false,
                "description": "Severe fungal disease producing diamond/spindle-shaped lesions with grayish centers and brown borders.",
                "symptoms": [
                    "Spindle-shaped elliptical lesions with gray or whitish centers and reddish-brown borders",
                    "Lesions coalesce, causing complete blighting of the leaf blade",
                    "Neck blast causes panicle rot and complete grain filling failure"
                ],
                "immediate_actions": [
                    "Drain excess standing water temporarily if feasible and reduce topdress nitrogen.",
                    "Apply emergency fungicide spray if lesions appear on top 2 leaves before booting."
                ],
                "biological_treatments": [
                    "Seed treatment with Pseudomonas fluorescens (10g/kg seed).",
                    "Foliar spray of neem-based botanical formulations (3%)."
                ],
                "chemical_treatments": [
                    "Tricyclazole (75% WP) or Isoprothiolane (40% EC).",
                    "Azoxystrobin or Kasugamycin formulations."
                ],
                "chemical_disclaimer": "Follow safe pesticide handling procedures; prevent runoff into aquaculture ponds.",
                "expert_notes": "Excessive nitrogen fertilizer creates soft lush vegetative tissue highly prone to blast.",
                "spacing": "Maintain 20 cm x 15 cm seedling transplanting spacing.",
                "sanitation": "Burn infected stubble or incorporate deep into paddy mud.",
                "irrigation": "Avoid excessive continuous flooding; practice alternate wetting and drying (AWD).",
                "rotation": "Rotate with pulses (gram, mungbean) or green manure crops.",
                "resistant_varieties": "Cultivate resistant varieties like IR64, Swarna Sub1, or Pusa Basmati 1121.",
                "monitoring": "Daily inspection of nursery beds and tillering crops during foggy periods."
            },
            {
                "name": "Brown Spot",
                "common_name": "Helminthosporium Leaf Spot",
                "pathogen_type": "Fungal (Bipolaris oryzae)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal disease causing numerous small oval brown spots across leaf blades, linked to soil nutrient deficiency.",
                "symptoms": [
                    "Circular to oval dark-brown spots resembling sesame seeds",
                    "Spots develop light brown to yellow halo in later stages",
                    "Discoloration and black spotting on paddy grains"
                ],
                "immediate_actions": [
                    "Apply corrective topdressing of potassium and zinc fertilizers.",
                    "Ensure adequate water supply to alleviate drought stress."
                ],
                "biological_treatments": [
                    "Seed soaking in Trichoderma harzianum suspension.",
                    "Foliar spray with cow-urine + neem leaf extract."
                ],
                "chemical_treatments": [
                    "Carbendazim + Mancozeb or Edifenphos sprays."
                ],
                "chemical_disclaimer": "Adhere strictly to local agricultural ministry usage norms and intervals.",
                "expert_notes": "Associated historically with nutrient-poor or drought-stressed soils.",
                "spacing": "Standard paddy transplant spacing.",
                "sanitation": "Remove wild rice grasses from field bunds.",
                "irrigation": "Maintain consistent shallow water layer during vegetative growth.",
                "rotation": "Rotate with leguminous green manure (Sesbania/Dhaincha).",
                "resistant_varieties": "Varieties with high tolerance to physiological brown spot.",
                "monitoring": "Inspect 20 hills diagonally across the paddy field."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Rice Tiller",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Erect, clean green paddy blades with strong tillers and healthy root system.",
                "symptoms": [
                    "Uniform light-to-medium green erect leaves",
                    "Absence of spindle lesions or bacterial streaking",
                    "Strong active tillering with healthy white roots"
                ],
                "immediate_actions": ["Maintain recommended water management and nutrient schedule."],
                "biological_treatments": ["Apply balanced organic compost / bio-fertilizers."],
                "chemical_treatments": ["None."],
                "chemical_disclaimer": "No chemicals required.",
                "expert_notes": "Healthy canopy optimizes photosynthetic efficiency during the critical panicle initiation phase.",
                "spacing": "Maintain uniform hill spacing.",
                "sanitation": "Keep field bunds neatly weeded.",
                "irrigation": "Implement Alternate Wetting and Drying (AWD).",
                "rotation": "Seasonal crop rotation.",
                "resistant_varieties": "Use certified foundation seed.",
                "monitoring": "Weekly paddy scouting."
            }
        ]
    },
    {
        "name": "Wheat",
        "scientific_name": "Triticum aestivum",
        "icon": "wheat",
        "description": "Major cool-season cereal crop vulnerable to leaf rust, stripe rust, and powdery mildew.",
        "diseases": [
            {
                "name": "Leaf Rust",
                "common_name": "Brown Rust",
                "pathogen_type": "Fungal (Puccinia triticina)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal disease producing small, round orange-brown pustules scattered erratically on leaf surfaces.",
                "symptoms": [
                    "Small circular to oval reddish-orange pustules scattered on upper leaf surface",
                    "Dusty orange-brown spore powder rubs off onto fingers",
                    "Premature leaf drying leading to shriveled grains"
                ],
                "immediate_actions": [
                    "Assess rust prevalence on the flag leaf (the topmost leaf feeding grain development)."
                ],
                "biological_treatments": [
                    "Early application of botanical extracts or bio-fungicide formulations."
                ],
                "chemical_treatments": [
                    "Propiconazole (25% EC) or Tebuconazole sprays upon reaching economic threshold."
                ],
                "chemical_disclaimer": "Do not spray within 30 days of wheat harvest.",
                "expert_notes": "Rust spores travel hundreds of miles on high-altitude winds.",
                "spacing": "Sow with seed drill at 20 cm row spacing.",
                "sanitation": "Destroy volunteer wheat plants that serve as summer green bridges.",
                "irrigation": "Irrigate at critical stages (crown root initiation, booting, grain filling).",
                "rotation": "Rotate with mustard, chickpea, or legumes.",
                "resistant_varieties": "Plant multi-rust resistant varieties like HD-2967, HD-3086, or PBW-550.",
                "monitoring": "Scout field weekly starting in early spring or winter warming spells."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Wheat Plant",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Vibrant blue-green upright wheat leaves with robust tillers and sturdy stems.",
                "symptoms": [
                    "Clean, upright flag leaves with uniform coloration",
                    "No orange pustules, yellow stripes, or powdery mold",
                    "Vigorous head/spike development"
                ],
                "immediate_actions": ["Maintain scheduled nitrogen split applications and irrigation."],
                "biological_treatments": ["Apply balanced micronutrients (zinc, iron) if soil test indicates deficiency."],
                "chemical_treatments": ["None."],
                "chemical_disclaimer": "Avoid chemical usage on healthy wheat.",
                "expert_notes": "Protecting the flag leaf is paramount for maximizing bushel weight and yield.",
                "spacing": "Maintain 20–22.5 cm row spacing.",
                "sanitation": "Clean combine harvesters between fields.",
                "irrigation": "Timely irrigation without field lodging.",
                "rotation": "Maintain wheat-rice or wheat-legume rotations.",
                "resistant_varieties": "Certified rust-tolerant seed lines.",
                "monitoring": "Fortnightly field scouting."
            }
        ]
    },
    {
        "name": "Cotton",
        "scientific_name": "Gossypium hirsutum",
        "icon": "flower",
        "description": "Major fiber crop sensitive to bacterial blight, target spot, and boll rots.",
        "diseases": [
            {
                "name": "Bacterial Blight",
                "common_name": "Angular Leaf Spot",
                "pathogen_type": "Bacterial (Xanthomonas citri pv. malvacearum)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Bacterial disease causing angular water-soaked leaf spots bounded by small veins, progressing to systemic black arm.",
                "symptoms": [
                    "Angular water-soaked spots on leaves bounded by leaf veinlets",
                    "Lesions turn dark brown to black and dry out",
                    "Black arm symptoms on petioles and stems causing breakage",
                    "Water-soaked oily spots on cotton bolls"
                ],
                "immediate_actions": [
                    "Avoid entering cotton fields when canopy is damp with dew.",
                    "Rogue severely blighted seedlings early."
                ],
                "biological_treatments": [
                    "Seed treatment with Pseudomonas fluorescens or Trichoderma."
                ],
                "chemical_treatments": [
                    "Copper oxychloride + Streptocycline sulfate foliar spray."
                ],
                "chemical_disclaimer": "Follow national agricultural regulations regarding antibiotic use.",
                "expert_notes": "Bacteria overwinter in seed and unburied crop debris.",
                "spacing": "Ensure proper spacing (90 cm x 60 cm) for canopy aeration.",
                "sanitation": "Deep summer plowing to bury crop residue.",
                "irrigation": "Use drip or furrow irrigation; avoid overhead irrigation.",
                "rotation": "Rotate with sorghum, corn, or pulses.",
                "resistant_varieties": "Plant certified resistant Bt cotton hybrids.",
                "monitoring": "Inspect undersides of leaves following rainstorms."
            },
            {
                "name": "Target Spot",
                "common_name": "Corynespora Leaf Spot",
                "pathogen_type": "Fungal (Corynespora cassiicola)",
                "default_severity": "Moderate",
                "is_healthy": false,
                "description": "Fungal foliar disease causing circular to irregular brown lesions with concentric rings ('target board') and chlorotic yellow halos, causing premature defoliation.",
                "symptoms": [
                    "Circular to irregular brown necrotic spots with concentric target-board rings",
                    "Dark brown borders surrounded by noticeable yellow chlorotic halos",
                    "Premature shedding of lower-to-mid canopy foliage during boll filling",
                    "Lesions coalesce causing large sections of leaf blade to dry out"
                ],
                "immediate_actions": [
                    "Prune or remove severely blighted lower canopy leaves to reduce airborne spore load.",
                    "Halt excessive nitrogen applications that promote rank, humid vegetative growth.",
                    "Ensure field ditches drain standing water promptly after heavy rain."
                ],
                "biological_treatments": [
                    "Apply foliar bio-fungicide containing Bacillus amyloliquefaciens or Trichoderma viride.",
                    "Spray copper octanoate soap or neem-based botanical formulations early morning."
                ],
                "chemical_treatments": [
                    "Pyraclostrobin (Headline) or Fluxapyroxad + Pyraclostrobin (Priaxor) applied at early bloom.",
                    "Trifloxystrobin + Tebuconazole fungicide spray according to local agricultural threshold."
                ],
                "chemical_disclaimer": "Fungicide timing is critical; applications must occur prior to 25% canopy defoliation for yield protection.",
                "expert_notes": "Warm humid conditions (25-30°C) with dense closed canopies create optimal infection microclimates.",
                "spacing": "Ensure proper row spacing (90-100 cm) and avoid excessive plant populations.",
                "sanitation": "Shred and deep-till cotton crop debris post-harvest to speed decomposition.",
                "irrigation": "Avoid late-day overhead sprinkler irrigation; irrigate early morning.",
                "rotation": "Rotate with non-host crops like corn or grain sorghum for at least 2 seasons.",
                "resistant_varieties": "Select moderately tolerant commercial cotton cultivars.",
                "monitoring": "Scout interior and lower canopy leaves weekly beginning at third week of bloom."
            },
            {
                "name": "Healthy",
                "common_name": "Healthy Cotton Canopy",
                "pathogen_type": "None",
                "default_severity": "Healthy",
                "is_healthy": true,
                "description": "Deep green, broad 3–5 lobed cotton leaves with sturdy main stem and healthy square development.",
                "symptoms": [
                    "Broad, pliable deep green leaves",
                    "No angular water-soaked lesions or target circles",
                    "Healthy squaring and sympodial branch development"
                ],
                "immediate_actions": ["Maintain IPM scouting for bollworms and sucking pests."],
                "biological_treatments": ["Apply balanced potassium and boron foliar sprays."],
                "chemical_treatments": ["None."],
                "chemical_disclaimer": "No chemicals required.",
                "expert_notes": "Healthy canopy supports maximum boll retention and premium fiber staple length.",
                "spacing": "Maintain recommended plant density.",
                "sanitation": "Keep field perimeters weed-free.",
                "irrigation": "Scheduled furrow or drip irrigation.",
                "rotation": "Cotton-cereal rotation.",
                "resistant_varieties": "High-germination certified seed.",
                "monitoring": "Weekly crop scouting."
            }
        ]
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # 1. Seed Users if not present
        if db.query(User).count() == 0:
            admin_user = User(
                name="Agronomist Admin",
                email="admin@example.com",
                hashed_password=hash_password("Admin@123"),
                phone="+1 555-0199",
                preferred_language="en",
                role="admin",
                is_active=True
            )
            farmer_user = User(
                name="Ramesh Patel",
                email="farmer@example.com",
                hashed_password=hash_password("Farmer@123"),
                phone="+91 98765 43210",
                preferred_language="en",
                role="farmer",
                is_active=True
            )
            db.add(admin_user)
            db.add(farmer_user)
            db.flush()

        # 2. Seed Model Version if not present
        model_version = db.query(ModelVersion).filter_by(version_tag="v1.0.0-mobilenetv2").first()
        if not model_version:
            model_version = ModelVersion(
                version_tag="v1.0.0-mobilenetv2",
                architecture="MobileNetV2-CropNet",
                input_shape="224x224x3",
                num_classes=32,
                accuracy=0.964,
                is_active=True
            )
            db.add(model_version)
            db.flush()

        # 3. Seed Crops, Diseases, Treatments, and Preventions
        for c_data in CROP_DATA:
            crop = db.query(Crop).filter_by(name=c_data["name"]).first()
            if not crop:
                crop = Crop(
                    name=c_data["name"],
                    scientific_name=c_data["scientific_name"],
                    icon=c_data["icon"],
                    description=c_data["description"],
                    is_active=True
                )
                db.add(crop)
                db.flush()

            for d_data in c_data["diseases"]:
                disease = db.query(Disease).filter_by(name=d_data["name"], crop_id=crop.id).first()
                if not disease:
                    disease = Disease(
                        crop_id=crop.id,
                        name=d_data["name"],
                        common_name=d_data.get("common_name"),
                        pathogen_type=d_data.get("pathogen_type", "Fungal"),
                        default_severity=d_data.get("default_severity", "Moderate"),
                        is_healthy=d_data.get("is_healthy", False),
                        description=d_data["description"],
                        symptoms=json.dumps(d_data["symptoms"])
                    )
                    db.add(disease)
                    db.flush()

                treatment = db.query(TreatmentGuidance).filter_by(disease_id=disease.id).first()
                if not treatment:
                    treatment = TreatmentGuidance(
                        disease_id=disease.id,
                        immediate_actions=json.dumps(d_data.get("immediate_actions", [])),
                        biological_treatments=json.dumps(d_data.get("biological_treatments", [])),
                        chemical_treatments=json.dumps(d_data.get("chemical_treatments", [])),
                        chemical_disclaimer=d_data.get("chemical_disclaimer", "Follow local regulations and certified product labels."),
                        expert_notes=d_data.get("expert_notes", "")
                    )
                    db.add(treatment)

                prevention = db.query(PreventionGuidance).filter_by(disease_id=disease.id).first()
                if not prevention:
                    prevention = PreventionGuidance(
                        disease_id=disease.id,
                        spacing=d_data.get("spacing", "Maintain recommended plant density."),
                        sanitation=d_data.get("sanitation", "Keep field clean."),
                        irrigation=d_data.get("irrigation", "Irrigate at root zone."),
                        rotation=d_data.get("rotation", "Rotate crops seasonally."),
                        resistant_varieties=d_data.get("resistant_varieties", "Select certified seeds."),
                        monitoring=d_data.get("monitoring", "Scout crop weekly.")
                    )
                    db.add(prevention)

        # 4. Seed initial historical detections for Ramesh Patel if none exist
        if db.query(Detection).count() == 0:
            farmer_user = db.query(User).filter_by(email="farmer@example.com").first()
            tomato = db.query(Crop).filter_by(name="Tomato").first()
            early_blight = db.query(Disease).filter_by(name="Early Blight", crop_id=tomato.id).first()
            healthy_tomato = db.query(Disease).filter_by(name="Healthy", crop_id=tomato.id).first()
            potato = db.query(Crop).filter_by(name="Potato").first()
            late_blight_potato = db.query(Disease).filter_by(name="Late Blight", crop_id=potato.id).first()
            corn = db.query(Crop).filter_by(name="Corn").first()
            corn_rust = db.query(Disease).filter_by(name="Common Rust", crop_id=corn.id).first()

            if farmer_user and model_version:
                sample_detections = [
                    Detection(
                        user_id=farmer_user.id,
                crop_id=tomato.id,
                disease_id=early_blight.id,
                model_version_id=model_version.id,
                confidence=0.942,
                confidence_level="High",
                severity="Moderate",
                image_path="sample_tomato_early_blight.jpg",
                thumbnail_path="sample_tomato_early_blight.jpg",
                status="Completed",
                notes="Observed on lower leaves following 3 days of rain.",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2, hours=3)
            ),
            Detection(
                user_id=farmer_user.id,
                crop_id=tomato.id,
                disease_id=healthy_tomato.id,
                model_version_id=model_version.id,
                confidence=0.985,
                confidence_level="High",
                severity="Healthy",
                image_path="sample_tomato_healthy.jpg",
                thumbnail_path="sample_tomato_healthy.jpg",
                status="Completed",
                notes="Young upper growth looks clean and vigorous.",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1, hours=5)
            ),
            Detection(
                user_id=farmer_user.id,
                crop_id=potato.id,
                disease_id=late_blight_potato.id,
                model_version_id=model_version.id,
                confidence=0.918,
                confidence_level="High",
                severity="Severe",
                image_path="sample_potato_late_blight.jpg",
                thumbnail_path="sample_potato_late_blight.jpg",
                status="Completed",
                notes="North section of potato field showing water-soaked lesions.",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=14)
            ),
            Detection(
                user_id=farmer_user.id,
                crop_id=corn.id,
                disease_id=corn_rust.id,
                model_version_id=model_version.id,
                confidence=0.887,
                confidence_level="High",
                severity="Moderate",
                image_path="sample_corn_rust.jpg",
                thumbnail_path="sample_corn_rust.jpg",
                status="Completed",
                notes="Scattered orange pustules on ear leaf.",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            )
                ]
                db.add_all(sample_detections)

        db.commit()
        print("Database seeded and synced successfully with crops, diseases, guidance, and sample detections!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
