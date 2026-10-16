export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  heroBadge: string;
  heroHeading: string;
  heroSubheading: string;
  ctaAnalyze: string;
  ctaHowItWorks: string;
  floatingAiAnalysis: string;
  floatingDiseaseDetected: string;
  floatingConfidence: string;
  howItWorksHeading: string;
  howItWorksSubheading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  supportedCropsHeading: string;
  supportedCropsSubheading: string;
  featuresHeading: string;
  featuresSubheading: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  finalCtaHeading: string;
  finalCtaSubheading: string;
  finalCtaBtn: string;
  uploadTitle: string;
  uploadSubtitle: string;
  dragDropText: string;
  orClickToBrowse: string;
  takePhotoBtn: string;
  selectCropLabel: string;
  analyzeBtn: string;
  analyzingText: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  totalScans: string;
  healthyCrops: string;
  diseasedCrops: string;
  mostCommonThreat: string;
  recentScans: string;
  analyzeNewLeaf: string;
  historyTitle: string;
  historySubtitle: string;
  filterByCrop: string;
  filterByDisease: string;
  filterBySeverity: string;
  searchPlaceholder: string;
  viewDetails: string;
  deleteBtn: string;
  noScansFound: string;
  safetyNotice: string;
  symptoms: string;
  immediateActions: string;
  biologicalTreatment: string;
  chemicalGuidance: string;
  preventionGuide: string;
  scanAnother: string;
  printReport: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "AI Crop Disease Detection",
    tagline: "Detect crop diseases early. Protect your harvest smarter.",
    heroBadge: "AI-Powered Crop Health",
    heroHeading: "Identify Crop Diseases Before They Spread",
    heroSubheading: "Upload a photo of an affected leaf to receive instant, deep learning disease diagnosis, symptom verification, and agronomist-verified treatment plans.",
    ctaAnalyze: "Analyze a Leaf",
    ctaHowItWorks: "How It Works",
    floatingAiAnalysis: "AI Neural Analysis",
    floatingDiseaseDetected: "Early Blight Detected",
    floatingConfidence: "98% Confidence",
    howItWorksHeading: "How It Works",
    howItWorksSubheading: "A simple 4-step workflow engineered for farmers in the field",
    step1Title: "01 — Upload",
    step1Desc: "Take or upload a clear photo of the affected plant foliage directly from your smartphone or computer.",
    step2Title: "02 — Analyze",
    step2Desc: "Our computer vision neural network inspects lesion patterns, discoloration, and structural texture.",
    step3Title: "03 — Detect",
    step3Desc: "Receive an immediate identification with confidence score, severity rating, and verified symptoms.",
    step4Title: "04 — Treat",
    step4Desc: "Access targeted immediate actions, biological alternatives, and cautious chemical management advice.",
    supportedCropsHeading: "Agricultural Crops & Universal Leaf Coverage",
    supportedCropsSubheading: "Supports all major cash crops, fruit trees, vegetables, and any plant foliage with zero restrictions",
    featuresHeading: "Advanced Agronomic AI Technology",
    featuresSubheading: "Engineered specifically to solve real-world farm disease challenges",
    feature1Title: "MobileNetV2 CNN Architecture",
    feature1Desc: "High-accuracy transfer learning model optimized for rapid inference even on rural mobile network speeds.",
    feature2Title: "Multi-Tiered Confidence Scoring",
    feature2Desc: "We never guess blindly. Predictions are categorized into High, Medium, or Low confidence tiers with expert review flags.",
    feature3Title: "Integrated IPM Guidance",
    feature3Desc: "Holistic pest management pairing non-toxic biological remedies with cautious, regulatory-compliant chemical options.",
    feature4Title: "Digital Field Scan History",
    feature4Desc: "Track your fields over time, spot recurrent pathogens, and share diagnosis records with local agricultural agents.",
    finalCtaHeading: "Protect Your Crops With Smarter Detection",
    finalCtaSubheading: "Early diagnosis can save up to 40% of harvest yield loss. Start screening your crop fields today.",
    finalCtaBtn: "Start Detection",
    uploadTitle: "Upload an Affected Leaf",
    uploadSubtitle: "Upload a clear photograph of the affected crop leaf for AI analysis.",
    dragDropText: "Drag & drop a leaf photo here, or browse files",
    orClickToBrowse: "Supports JPG, JPEG, PNG, WebP (up to 10MB)",
    takePhotoBtn: "Take Photo with Camera",
    selectCropLabel: "Select Crop Type",
    analyzeBtn: "Analyze Leaf",
    analyzingText: "Running AI Diagnosis...",
    dashboardTitle: "Farmer Field Dashboard",
    dashboardSubtitle: "Monitor your crop health scans, disease distributions, and recent field diagnostics.",
    totalScans: "Total Scans",
    healthyCrops: "Healthy Leaves",
    diseasedCrops: "Diseased Crops",
    mostCommonThreat: "Frequent Pathogen",
    recentScans: "Recent Crop Scans",
    analyzeNewLeaf: "+ Analyze New Leaf",
    historyTitle: "Field Scan History",
    historySubtitle: "Review, filter, and export all previous leaf analyses and management records.",
    filterByCrop: "Filter Crop",
    filterByDisease: "Filter Disease",
    filterBySeverity: "Filter Severity",
    searchPlaceholder: "Search crop, disease or notes...",
    viewDetails: "View Full Diagnosis",
    deleteBtn: "Delete",
    noScansFound: "No scans found matching your criteria.",
    safetyNotice: "AI predictions are intended as an initial screening aid. For significant crop loss, uncertain results, or chemical application decisions, always consult a certified agricultural officer and follow local product labels.",
    symptoms: "Observed Diagnostic Symptoms",
    immediateActions: "Immediate Containment Actions",
    biologicalTreatment: "Organic & Biological Management",
    chemicalGuidance: "Chemical Control & Regulatory Guidance",
    preventionGuide: "Long-Term Prevention Strategy",
    scanAnother: "Scan Another Leaf",
    printReport: "Print Diagnostic Report"
  },
  hi: {
    appName: "एआई फसल रोग पहचान",
    tagline: "फसल के रोगों को समय रहते पहचानें। अपनी फसल सुरक्षित रखें।",
    heroBadge: "एआई-संचालित फसल स्वास्थ्य",
    heroHeading: "फसल के रोगों को फैलने से पहले पहचानें",
    heroSubheading: "प्रभावित पत्ती की फोटो अपलोड करें और तुरंत सटीक रोग निदान, लक्षण पुष्टि और उपचार की सलाह प्राप्त करें।",
    ctaAnalyze: "पत्ती की जाँच करें",
    ctaHowItWorks: "यह कैसे काम करता है",
    floatingAiAnalysis: "एआई विश्लेषण",
    floatingDiseaseDetected: "रोग पहचाना गया",
    floatingConfidence: "98% सटीकता",
    howItWorksHeading: "यह कैसे काम करता है",
    howItWorksSubheading: "खेतों में काम करने वाले किसान भाइयों के लिए सरल 4-चरणीय प्रक्रिया",
    step1Title: "01 — फोटो अपलोड करें",
    step1Desc: "प्रभावित पत्ती की स्पष्ट फोटो सीधे अपने मोबाइल या कंप्यूटर से अपलोड करें।",
    step2Title: "02 — एआई विश्लेषण",
    step2Desc: "हमारा एआई मॉडल पत्ती के धब्बों, रंग और लक्षणों की गहराई से जांच करता है।",
    step3Title: "03 — रोग पहचान",
    step3Desc: "सटीकता प्रतिशत, गंभीरता और लक्षणों के साथ तत्काल रोग की जानकारी पाएं।",
    step4Title: "04 — उपचार व रोकथाम",
    step4Desc: "तुरंत करने योग्य उपाय, जैविक उपचार और सुरक्षित रासायनिक सलाह प्राप्त करें।",
    supportedCropsHeading: "प्रमुख फसलें एवं सभी प्रकार की पत्तियां",
    supportedCropsSubheading: "टमाटर, आलू, मक्का, धान, कपास के साथ-साथ किसी भी फसल अथवा पेड़-पौधों की पत्तियों की स्वचालित पहचान",
    featuresHeading: "उन्नत कृषि एआई तकनीक",
    featuresSubheading: "किसानों की वास्तविक जरूरतों को ध्यान में रखकर तैयार किया गया",
    feature1Title: "सटीक न्यूरल नेटवर्क",
    feature1Desc: "धीमे ग्रामीण इंटरनेट पर भी तेजी से काम करने वाला हल्का और सटीक मॉडल।",
    feature2Title: "विश्वसनीयता स्तर",
    feature2Desc: "बिना पुख्ता जानकारी के अनुमान नहीं। उच्च, मध्यम या कम विश्वसनीयता की स्पष्ट जानकारी।",
    feature3Title: "एकीकृत कीट प्रबंधन (IPM)",
    feature3Desc: "रासायनिक दवाओं के साथ-साथ प्राकृतिक और जैविक उपचारों का संतुलन।",
    feature4Title: "डिजिटल जांच इतिहास",
    feature4Desc: "अपने सभी पुराने स्कैन का रिकॉर्ड रखें और कृषि विशेषज्ञों के साथ साझा करें।",
    finalCtaHeading: "अपनी फसलों को सुरक्षित बनाएं",
    finalCtaSubheading: "समय पर जांच से फसल के नुकसान को 40% तक रोका जा सकता है।",
    finalCtaBtn: "जाँच शुरू करें",
    uploadTitle: "प्रभावित पत्ती की फोटो अपलोड करें",
    uploadSubtitle: "एआई द्वारा सटीक जांच के लिए पत्ती की साफ फोटो चुनें।",
    dragDropText: "फोटो यहाँ खींचें या फाइल चुनें",
    orClickToBrowse: "JPG, JPEG, PNG, WebP (10MB तक)",
    takePhotoBtn: "कैमरे से फोटो खींचें",
    selectCropLabel: "फसल चुनें",
    analyzeBtn: "पत्ती का विश्लेषण करें",
    analyzingText: "रोग की जांच हो रही है...",
    dashboardTitle: "किसान डैशबोर्ड",
    dashboardSubtitle: "अपनी सभी फसलों की स्वास्थ्य स्थिति और पिछले स्कैन की समीक्षा करें।",
    totalScans: "कुल जांच",
    healthyCrops: "स्वस्थ पत्तियां",
    diseasedCrops: "रोगग्रस्त फसलें",
    mostCommonThreat: "प्रमुख रोग",
    recentScans: "हाल की जांचें",
    analyzeNewLeaf: "+ नई पत्ती की जांच करें",
    historyTitle: "जांच का इतिहास",
    historySubtitle: "पुराने सभी स्कैन देखें, खोजें और रिपोर्ट डाउनलोड करें।",
    filterByCrop: "फसल अनुसार",
    filterByDisease: "रोग अनुसार",
    filterBySeverity: "गंभीरता अनुसार",
    searchPlaceholder: "फसल या रोग खोजें...",
    viewDetails: "पूरी रिपोर्ट देखें",
    deleteBtn: "हटाएं",
    noScansFound: "कोई रिकॉर्ड नहीं मिला।",
    safetyNotice: "एआई सुझाव प्रारंभिक जांच के लिए हैं। किसी भी रासायनिक दवा के प्रयोग से पहले स्थानीय कृषि अधिकारी या विशेषज्ञ से सलाह अवश्य लें।",
    symptoms: "देखे गए रोग लक्षण",
    immediateActions: "तुरंत करने योग्य कदम",
    biologicalTreatment: "जैविक और प्राकृतिक उपचार",
    chemicalGuidance: "रासायनिक दवाएं और सावधानी",
    preventionGuide: "भविष्य में रोकथाम के उपाय",
    scanAnother: "अन्य पत्ती की जांच करें",
    printReport: "रिपोर्ट प्रिंट करें"
  }
};
