import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Phone, UploadCloud, FileText, CheckCircle2, 
  ShieldCheck, Clock, Award, Microscope, HeartPulse, 
  Activity, ChevronDown, ChevronRight, X, 
  Sparkles, Calendar, Home, ArrowRight, Download, Info, Check,
  AlertCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import './Healthcare.css';

// WhatsApp & Contact details
const CONTACT_PHONE = "+91 90102 15674";
const CONTACT_PHONE_CLEAN = "919010215674";

// 1. Data for Flagship Golden Profile - 1 (Aadhvi Diagnostics)
const GOLDEN_PROFILE_1_DATA = {
  id: 1,
  provider: "AADHVI DIAGNOSTICS PVT. LTD.",
  title: "GOLDEN PROFILE – 1 (Advanced)",
  tagline: "Advanced Comprehensive Health Check-up",
  badge: "Flagship #1 • Advanced • 63% OFF",
  mrp: "₹6,750/-",
  mrpNum: 6750,
  specialOffer: "₹2,500/-",
  offerNum: 2500,
  discount: "63% OFF",
  savings: "Save ₹4,250",
  indivTotal: "₹9,670",
  groupsCount: 13,
  parametersCount: "65+ Parameters",
  reportTime: "12-24 Hours",
  fasting: "10-12 Hours Fasting Required",
  sampleType: "Blood & Urine Sample",
  homeCollection: true,
  accreditation: "NABL Quality Standards & ISO Certified",
  badges: ["Accurate Quality", "Affordable Prices", "Fast & Reliable Reports"],
  testGroups: [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      short: "CBC (24 Parameters)",
      mrp: "₹500",
      details: "Hemoglobin, RBC, WBC Total & Differential Count, Platelet Count, PCV, MCV, MCH, MCHC, RDW, Peripheral Smear."
    },
    {
      id: 2,
      name: "ESR (Erythrocyte Sedimentation Rate)",
      short: "ESR Rate",
      mrp: "₹200",
      details: "Westergren method marker to screen for systemic inflammation, chronic infections, and autoimmune disorders."
    },
    {
      id: 3,
      name: "Fasting Blood Sugar (FBS)",
      short: "Fasting Glucose",
      mrp: "₹120",
      details: "Measures baseline blood glucose levels after 10-12 hours of overnight fasting to detect pre-diabetes and diabetes."
    },
    {
      id: 4,
      name: "HbA1c (Glycated Hemoglobin)",
      short: "HbA1c 3-Month Glucose",
      mrp: "₹800",
      details: "Gold-standard test providing the 3-month average of blood sugar control and diabetic risk assessment."
    },
    {
      id: 5,
      name: "Lipid Profile (Complete Heart Risk)",
      short: "Lipid Profile (7 Tests)",
      mrp: "₹1,000",
      details: "Total Cholesterol, HDL (Good), LDL (Bad), VLDL, Triglycerides, Total/HDL Ratio, and Atherogenic Index."
    },
    {
      id: 6,
      name: "Liver Function Test (LFT)",
      short: "LFT (11 Parameters)",
      mrp: "₹1,000",
      details: "Bilirubin (Total, Direct, Indirect), SGOT (AST), SGPT (ALT), Alkaline Phosphatase, Total Protein, Albumin, Globulin, A:G Ratio."
    },
    {
      id: 7,
      name: "Kidney Function Test (KFT)",
      short: "KFT / RFT (9 Parameters)",
      mrp: "₹1,200",
      details: "Serum Creatinine, Blood Urea Nitrogen (BUN), Blood Urea, Uric Acid, Sodium, Potassium, Chloride, Calcium, Phosphorus."
    },
    {
      id: 8,
      name: "Urine Complete Examination (CUE)",
      short: "Urine Routine & Microscopic",
      mrp: "₹250",
      details: "Physical (Color, Appearance), Chemical (Specific Gravity, pH, Protein, Sugar, Ketones, Bilirubin), and Microscopic Examination (Pus Cells, RBCs, Epithelial, Crystals, Casts)."
    },
    {
      id: 9,
      name: "Uric Acid",
      short: "Serum Uric Acid",
      mrp: "₹250",
      details: "Identifies hyperuricemia, risk of gout arthritis, joint pain, and kidney stone evaluation."
    },
    {
      id: 10,
      name: "Calcium",
      short: "Total Serum Calcium",
      mrp: "₹250",
      details: "Essential for healthy bones, teeth, cardiac muscle contraction, and neuromuscular nerve transmission."
    },
    {
      id: 11,
      name: "Thyroid Profile (T3, T4, TSH)",
      short: "Complete Thyroid Trio",
      mrp: "₹900",
      details: "Total Triiodothyronine (T3), Total Thyroxine (T4), and Thyroid Stimulating Hormone (TSH) to diagnose hypo/hyperthyroidism."
    },
    {
      id: 12,
      name: "Vitamin B12",
      short: "Cyanocobalamin Vitality",
      mrp: "₹1,200",
      details: "Vital for nerve function, neurological health, DNA synthesis, brain memory, and healthy red blood cell production."
    },
    {
      id: 13,
      name: "Vitamin D (25-OH)",
      short: "25-Hydroxy Vitamin D",
      mrp: "₹2,000",
      details: "Essential for calcium absorption, bone mineral density, immunity, joint resilience, and fatigue reduction."
    }
  ]
};

// 1B. Data for Flagship Golden Profile - 2 (Aadhvi Diagnostics)
const GOLDEN_PROFILE_2_DATA = {
  id: 2,
  provider: "AADHVI DIAGNOSTICS PVT. LTD.",
  title: "GOLDEN PROFILE – 2",
  tagline: "Basic Health Check-up",
  badge: "Popular Value Flagship #2 • 71% OFF",
  mrp: "₹5,250/-",
  mrpNum: 5250,
  specialOffer: "₹1,500/-",
  offerNum: 1500,
  discount: "71% OFF",
  savings: "Save ₹3,750",
  indivTotal: "₹6,470",
  groupsCount: 11,
  parametersCount: "50+ Parameters",
  reportTime: "12-24 Hours",
  fasting: "10-12 Hours Fasting Required",
  sampleType: "Blood & Urine Sample",
  homeCollection: true,
  accreditation: "NABL Quality Standards & ISO Certified",
  badges: ["Accurate Quality", "Affordable Prices", "Fast & Reliable Reports"],
  testGroups: [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      short: "CBC (24 Parameters)",
      mrp: "₹500",
      details: "Hemoglobin, RBC, WBC Total & Differential Count, Platelet Count, PCV, MCV, MCH, MCHC, RDW, Peripheral Smear."
    },
    {
      id: 2,
      name: "ESR (Erythrocyte Sedimentation Rate)",
      short: "ESR Rate",
      mrp: "₹200",
      details: "Westergren method marker to screen for systemic inflammation, chronic infections, and autoimmune disorders."
    },
    {
      id: 3,
      name: "Fasting Blood Sugar (FBS)",
      short: "Fasting Glucose",
      mrp: "₹120",
      details: "Measures baseline blood glucose levels after 10-12 hours of overnight fasting to detect pre-diabetes and diabetes."
    },
    {
      id: 4,
      name: "HbA1c (Glycated Hemoglobin)",
      short: "HbA1c 3-Month Glucose",
      mrp: "₹800",
      details: "Gold-standard test providing the 3-month average of blood sugar control and diabetic risk assessment."
    },
    {
      id: 5,
      name: "Lipid Profile (Complete Heart Risk)",
      short: "Lipid Profile (7 Tests)",
      mrp: "₹1,000",
      details: "Total Cholesterol, HDL (Good), LDL (Bad), VLDL, Triglycerides, Total/HDL Ratio, and Atherogenic Index."
    },
    {
      id: 6,
      name: "Liver Function Test (LFT)",
      short: "LFT (11 Parameters)",
      mrp: "₹1,000",
      details: "Bilirubin (Total, Direct, Indirect), SGOT (AST), SGPT (ALT), Alkaline Phosphatase, Total Protein, Albumin, Globulin, A:G Ratio."
    },
    {
      id: 7,
      name: "Kidney Function Test (KFT)",
      short: "KFT / RFT (9 Parameters)",
      mrp: "₹1,200",
      details: "Serum Creatinine, Blood Urea Nitrogen (BUN), Blood Urea, Uric Acid, Sodium, Potassium, Chloride, Calcium, Phosphorus."
    },
    {
      id: 8,
      name: "Urine Complete Examination (CUE)",
      short: "Urine Routine & Microscopic",
      mrp: "₹250",
      details: "Physical (Color, Appearance), Chemical (Specific Gravity, pH, Protein, Sugar, Ketones, Bilirubin), and Microscopic Examination (Pus Cells, RBCs, Epithelial, Crystals, Casts)."
    },
    {
      id: 9,
      name: "Uric Acid",
      short: "Serum Uric Acid",
      mrp: "₹250",
      details: "Identifies hyperuricemia, risk of gout arthritis, joint pain, and kidney stone evaluation."
    },
    {
      id: 10,
      name: "Calcium",
      short: "Total Serum Calcium",
      mrp: "₹250",
      details: "Essential for healthy bones, teeth, cardiac muscle contraction, and neuromuscular nerve transmission."
    },
    {
      id: 11,
      name: "Thyroid Profile (T3, T4, TSH)",
      short: "Complete Thyroid Trio",
      mrp: "₹900",
      details: "Total Triiodothyronine (T3), Total Thyroxine (T4), and Thyroid Stimulating Hormone (TSH) to diagnose hypo/hyperthyroidism."
    }
  ]
};

// 2. Official Website Rate Card Data (All 6 Packages)
const RATE_CARD_PACKAGES = [
  {
    id: "basic-health",
    title: "1. Basic Health Package",
    tagline: "Essential Routine Vitals Screen",
    mrp: "₹2,250",
    offer: "₹699",
    savings: "Save ₹1,551 (69% OFF)",
    indivTotal: "₹2,070",
    testsCount: "5 Tests (30+ Parameters)",
    category: "basic",
    gender: "all",
    reportTime: "12 hrs",
    fasting: "10-12 hrs fasting",
    popular: false,
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: "₹500" },
      { name: "ESR", mrp: "₹200" },
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "Lipid Profile", mrp: "₹1,000" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" }
    ]
  },
  {
    id: "diabetes-screening",
    title: "2. Diabetes Screening Package",
    tagline: "Comprehensive Glycemic & Renal Risk Check",
    mrp: "₹3,000",
    offer: "₹999",
    savings: "Save ₹2,001 (67% OFF)",
    indivTotal: "₹1,490",
    testsCount: "5 Tests (Sugar & Renal)",
    category: "diabetes",
    gender: "all",
    reportTime: "12 hrs",
    fasting: "10-12 hrs fasting",
    popular: false,
    tests: [
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "Post-Prandial Blood Sugar (PPBS)", mrp: "₹120" },
      { name: "HbA1c (Glycated Hemoglobin)", mrp: "₹800" },
      { name: "Serum Creatinine", mrp: "₹200" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" }
    ]
  },
  {
    id: "essential-health",
    title: "3. Essential Health Package",
    tagline: "Vital Organs & Metabolic Screen",
    mrp: "₹4,500",
    offer: "₹1,499",
    savings: "Save ₹3,001 (67% OFF)",
    indivTotal: "₹5,320",
    testsCount: "9 Tests (45+ Parameters)",
    category: "essential",
    gender: "all",
    reportTime: "12-24 hrs",
    fasting: "10-12 hrs fasting",
    popular: false,
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: "₹500" },
      { name: "ESR", mrp: "₹200" },
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "HbA1c", mrp: "₹800" },
      { name: "Lipid Profile", mrp: "₹1,000" },
      { name: "Liver Function Test (LFT)", mrp: "₹1,000" },
      { name: "Kidney Function Test (KFT)", mrp: "₹1,200" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" },
      { name: "Uric Acid", mrp: "₹250" }
    ]
  },
  {
    id: "golden-profile-2",
    title: "4. Golden Profile – 2",
    tagline: "Basic Full Body Health Check-up",
    mrp: "₹5,250",
    offer: "₹1,500",
    savings: "Save ₹3,750 (71% OFF)",
    indivTotal: "₹6,470",
    testsCount: "11 Test Groups (50+ Parameters)",
    category: "golden",
    gender: "all",
    reportTime: "12-24 hrs",
    fasting: "10-12 hrs fasting",
    popular: true,
    flagship: true,
    badgeText: "Flagship #2 • Best Value",
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: "₹500" },
      { name: "ESR", mrp: "₹200" },
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "HbA1c", mrp: "₹800" },
      { name: "Lipid Profile", mrp: "₹1,000" },
      { name: "Liver Function Test (LFT)", mrp: "₹1,000" },
      { name: "Kidney Function Test (KFT)", mrp: "₹1,200" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" },
      { name: "Uric Acid", mrp: "₹250" },
      { name: "Calcium", mrp: "₹250" },
      { name: "Thyroid Profile (T3, T4, TSH)", mrp: "₹900" }
    ]
  },
  {
    id: "golden-profile-1",
    title: "5. Golden Profile – 1 (Advanced)",
    tagline: "Master Health Check-up with Vitamins D & B12",
    mrp: "₹6,750",
    offer: "₹2,500",
    savings: "Save ₹4,250 (63% OFF)",
    indivTotal: "₹9,670",
    testsCount: "13 Test Groups (65+ Parameters)",
    category: "golden",
    gender: "all",
    reportTime: "12-24 hrs",
    fasting: "10-12 hrs fasting",
    popular: true,
    flagship: true,
    badgeText: "Flagship #1 • Advanced",
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: "₹500" },
      { name: "ESR", mrp: "₹200" },
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "HbA1c", mrp: "₹800" },
      { name: "Lipid Profile", mrp: "₹1,000" },
      { name: "Liver Function Test (LFT)", mrp: "₹1,000" },
      { name: "Kidney Function Test (KFT)", mrp: "₹1,200" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" },
      { name: "Uric Acid", mrp: "₹250" },
      { name: "Calcium", mrp: "₹250" },
      { name: "Thyroid Profile (T3, T4, TSH)", mrp: "₹900" },
      { name: "Vitamin B12", mrp: "₹1,200" },
      { name: "Vitamin D (25-OH)", mrp: "₹2,000" }
    ]
  },
  {
    id: "senior-citizen-health",
    title: "6. Senior Citizen Health Package",
    tagline: "Comprehensive Elderly Vitals & Organ Care",
    mrp: "₹6,000",
    offer: "₹1,999",
    savings: "Save ₹4,001 (67% OFF)",
    indivTotal: "₹5,770",
    testsCount: "8 Comprehensive Tests",
    category: "senior",
    gender: "all",
    reportTime: "12-24 hrs",
    fasting: "10-12 hrs fasting",
    popular: false,
    tests: [
      { name: "Complete Blood Count (CBC)", mrp: "₹500" },
      { name: "Fasting Blood Sugar (FBS)", mrp: "₹120" },
      { name: "HbA1c", mrp: "₹800" },
      { name: "Lipid Profile", mrp: "₹1,000" },
      { name: "Liver Function Test (LFT)", mrp: "₹1,000" },
      { name: "Kidney Function Test (KFT)", mrp: "₹1,200" },
      { name: "Urine Complete Exam (CUE)", mrp: "₹250" },
      { name: "Thyroid Profile", mrp: "₹900" }
    ]
  }
];

// 3. Most Booked Individual Routine Pathology Tests (Aligned with rate card MRPs)
const POPULAR_TESTS_DATA = [
  {
    code: "T101",
    name: "Complete Blood Count (CBC)",
    category: "Routine Blood",
    sample: "EDTA Whole Blood",
    reportTime: "4 Hours",
    mrp: "₹500",
    price: "₹350",
    fasting: "No fasting required"
  },
  {
    code: "T102",
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Diabetes",
    sample: "EDTA Whole Blood",
    reportTime: "4 Hours",
    mrp: "₹800",
    price: "₹490",
    fasting: "No fasting required"
  },
  {
    code: "T103",
    name: "Thyroid Profile Total (T3, T4, TSH)",
    category: "Hormone",
    sample: "Serum",
    reportTime: "6 Hours",
    mrp: "₹900",
    price: "₹550",
    fasting: "Overnight fasting preferred"
  },
  {
    code: "T104",
    name: "Lipid Profile Comprehensive",
    category: "Heart Care",
    sample: "Serum",
    reportTime: "6 Hours",
    mrp: "₹1,000",
    price: "₹650",
    fasting: "10-12 hrs fasting mandatory"
  },
  {
    code: "T105",
    name: "Vitamin D (25-Hydroxy)",
    category: "Vitamins",
    sample: "Serum",
    reportTime: "12 Hours",
    mrp: "₹2,000",
    price: "₹1,190",
    fasting: "No fasting required"
  },
  {
    code: "T106",
    name: "Vitamin B12 (Cyanocobalamin)",
    category: "Vitamins",
    sample: "Serum",
    reportTime: "12 Hours",
    mrp: "₹1,200",
    price: "₹850",
    fasting: "Overnight fasting preferred"
  },
  {
    code: "T107",
    name: "Liver Function Test (LFT)",
    category: "Liver Care",
    sample: "Serum",
    reportTime: "6 Hours",
    mrp: "₹1,000",
    price: "₹750",
    fasting: "8 hrs fasting preferred"
  },
  {
    code: "T108",
    name: "Kidney Function Test (KFT)",
    category: "Kidney Care",
    sample: "Serum",
    reportTime: "6 Hours",
    mrp: "₹1,200",
    price: "₹700",
    fasting: "No fasting required"
  }
];

// 4. Targeted Diagnostics & Health Conditions (8 Conditions in 2 Equal Rows)
const CONDITIONS_DATA = [
  { 
    id: "diabetes", 
    label: "Diabetes", 
    icon: "🩸", 
    count: "12 Tests",
    tagline: "HbA1c & Fasting Glucose",
    accent: "#ef4444",
    bgGradient: "linear-gradient(145deg, rgba(239, 68, 68, 0.08) 0%, rgba(244, 63, 94, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(239, 68, 68, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(239, 68, 68, 0.35)",
    iconBg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    glowColor: "rgba(239, 68, 68, 0.35)"
  },
  { 
    id: "heart", 
    label: "Heart Care", 
    icon: "❤️", 
    count: "15 Tests",
    tagline: "Lipid Profile & Vitals",
    accent: "#f43f5e",
    bgGradient: "linear-gradient(145deg, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(244, 63, 94, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(244, 63, 94, 0.35)",
    iconBg: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    glowColor: "rgba(244, 63, 94, 0.35)"
  },
  { 
    id: "thyroid", 
    label: "Thyroid Care", 
    icon: "🩺", 
    count: "8 Tests",
    tagline: "TSH, Free T3 & T4",
    accent: "#8b5cf6",
    bgGradient: "linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(139, 92, 246, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(139, 92, 246, 0.35)",
    iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    glowColor: "rgba(139, 92, 246, 0.35)"
  },
  { 
    id: "bone", 
    label: "Bone & Joints", 
    icon: "🦴", 
    count: "10 Tests",
    tagline: "Calcium, Uric Acid & Vit D",
    accent: "#f59e0b",
    bgGradient: "linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(245, 158, 11, 0.35)",
    iconBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    glowColor: "rgba(245, 158, 11, 0.35)"
  },
  { 
    id: "liver", 
    label: "Liver Care", 
    icon: "🫁", 
    count: "11 Tests",
    tagline: "SGOT, SGPT & Bilirubin",
    accent: "#10b981",
    bgGradient: "linear-gradient(145deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(16, 185, 129, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glowColor: "rgba(16, 185, 129, 0.35)"
  },
  { 
    id: "kidney", 
    label: "Kidney Health", 
    icon: "🧬", 
    count: "9 Tests",
    tagline: "Serum Creatinine & Urea",
    accent: "#06b6d4",
    bgGradient: "linear-gradient(145deg, rgba(6, 182, 212, 0.08) 0%, rgba(2, 132, 199, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(6, 182, 212, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(6, 182, 212, 0.35)",
    iconBg: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    glowColor: "rgba(6, 182, 212, 0.35)"
  },
  { 
    id: "immunity", 
    label: "Immunity & Vit", 
    icon: "🛡️", 
    count: "14 Tests",
    tagline: "Vit B12, D3 & Minerals",
    accent: "#2563eb",
    bgGradient: "linear-gradient(145deg, rgba(37, 99, 235, 0.08) 0%, rgba(29, 78, 216, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(37, 99, 235, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(37, 99, 235, 0.35)",
    iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glowColor: "rgba(37, 99, 235, 0.35)"
  },
  { 
    id: "women", 
    label: "Women Health", 
    icon: "👩", 
    count: "18 Tests",
    tagline: "PCOS, Iron & Hormones",
    accent: "#ec4899",
    bgGradient: "linear-gradient(145deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.16) 100%)",
    darkBg: "linear-gradient(145deg, rgba(236, 72, 153, 0.18) 0%, rgba(15, 23, 42, 0.9) 100%)",
    borderColor: "rgba(236, 72, 153, 0.35)",
    iconBg: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    glowColor: "rgba(236, 72, 153, 0.35)"
  }
];

// Cities served
const CITIES = [
  "Hyderabad"
];

// FAQ items
const FAQS = [
  {
    q: "What is the difference between Golden Profile – 1 and Golden Profile – 2?",
    a: "Golden Profile – 1 is our Advanced Health Check-up (Special Offer ₹2,500/- | MRP ₹6,750/-) covering 13 critical test groups including Vitamin B12 and Vitamin D (25-OH). Golden Profile – 2 is our Basic Health Check-up (Special Offer ₹1,500/- | MRP ₹5,250/-) covering 11 essential test groups (CBC, ESR, FBS, HbA1c, Lipid Profile, LFT, KFT, CUE, Uric Acid, Calcium, and Thyroid Profile)."
  },
  {
    q: "How does Home Sample Collection work?",
    a: "Booking a home sample collection is simple. Book online or message our coordinator at +91 90102 15674. A trained, vaccinated phlebotomist will visit your residence at your preferred time slot with sterile, temperature-controlled, barcoded collection kits."
  },
  {
    q: "How do I prepare for my tests? Is fasting required?",
    a: "For all full body checkup packages, Lipid Profile, and Fasting Blood Sugar (FBS), 10 to 12 hours of overnight fasting is mandatory. You can drink plain water, but avoid morning coffee, tea, milk, or heavy physical exertion before sample draw."
  },
  {
    q: "When and how will I receive my diagnostic reports?",
    a: "Routine blood test reports are generated within 4 to 12 hours, and comprehensive packages within 12 to 24 hours. Digital, NABL-validated doctor-signed reports are sent directly to your WhatsApp and email, with downloadable PDF access."
  },
  {
    q: "Can I upload a doctor's prescription instead of choosing tests?",
    a: "Yes! Click the 'Upload Prescription' button on our header or hero section. Upload a picture or PDF of your doctor's prescription, and our expert pathology counselor will call you within 15 minutes to schedule your tests at the best discounted package price."
  }
];

const Healthcare = () => {
  // States
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [packageCategory, setPackageCategory] = useState("all");
  const [activeFaq, setActiveFaq] = useState(0);

  // Active Flagship Golden Profile (1 for Advanced, 2 for Basic)
  const [activeProfileTab, setActiveProfileTab] = useState(1);
  const currentGoldenProfile = activeProfileTab === 1 ? GOLDEN_PROFILE_1_DATA : GOLDEN_PROFILE_2_DATA;

  // Modals state
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    itemTitle: "Golden Profile – 1 (Advanced Check-up)",
    itemPrice: "₹2,500",
    itemProvider: "AADHVI DIAGNOSTICS PVT. LTD."
  });
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [isPackageDetailModalOpen, setIsPackageDetailModalOpen] = useState(false);
  const [selectedDetailPackage, setSelectedDetailPackage] = useState(RATE_CARD_PACKAGES[4]);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    city: selectedCity,
    address: "",
    date: "",
    timeSlot: "Morning (07:00 AM - 09:00 AM)",
    collectionType: "Home Sample Collection"
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Rx Form State
  const [rxForm, setRxForm] = useState({
    name: "",
    phone: "",
    city: selectedCity,
    notes: ""
  });
  const [rxSuccess, setRxSuccess] = useState(false);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return RATE_CARD_PACKAGES.filter((pkg) => {
      const matchCat = packageCategory === "all" || 
        (packageCategory === "golden" && (pkg.id === "golden-profile-1" || pkg.id === "golden-profile-2")) ||
        (packageCategory === "senior" && pkg.category === "senior") ||
        (packageCategory === "diabetes" && pkg.category === "diabetes") ||
        (packageCategory === "basic" && (pkg.category === "basic" || pkg.category === "essential"));

      const matchSearch = searchQuery.trim() === "" ||
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.tests.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [packageCategory, searchQuery]);

  // Filtered popular tests
  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_TESTS_DATA;
    return POPULAR_TESTS_DATA.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Open booking modal
  const handleOpenBooking = (title, price, provider) => {
    setBookingModal({
      isOpen: true,
      itemTitle: title,
      itemPrice: price,
      itemProvider: provider || "AADHVI DIAGNOSTICS PVT. LTD."
    });
    setBookingSuccess(false);
  };

  // Open Details Modal for any Package
  const handleOpenPackageDetails = (pkg) => {
    setSelectedDetailPackage(pkg);
    setIsPackageDetailModalOpen(true);
  };

  // Submit Booking to WhatsApp
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    
    // Construct WhatsApp message
    const msg = `*NEW DIAGNOSTIC BOOKING REQUEST*%0A%0A` +
      `*Package / Test:* ${bookingModal.itemTitle}%0A` +
      `*Price:* ${bookingModal.itemPrice}%0A` +
      `*Provider:* ${bookingModal.itemProvider}%0A%0A` +
      `*Patient Name:* ${bookingForm.name}%0A` +
      `*Phone Number:* ${bookingForm.phone}%0A` +
      `*City:* ${bookingForm.city}%0A` +
      `*Address:* ${bookingForm.address}%0A` +
      `*Collection Type:* ${bookingForm.collectionType}%0A` +
      `*Preferred Date:* ${bookingForm.date}%0A` +
      `*Time Slot:* ${bookingForm.timeSlot}%0A%0A` +
      `_Submitted via TOGU & Aadhvi Diagnostics Portal_`;

    setTimeout(() => {
      window.open(`https://wa.me/${CONTACT_PHONE_CLEAN}?text=${msg}`, '_blank');
    }, 800);
  };

  // Submit Rx to WhatsApp
  const handleRxSubmit = (e) => {
    e.preventDefault();
    setRxSuccess(true);

    const msg = `*PRESCRIPTION CALLBACK REQUEST*%0A%0A` +
      `*Patient Name:* ${rxForm.name}%0A` +
      `*Phone:* ${rxForm.phone}%0A` +
      `*City:* ${rxForm.city}%0A` +
      `*Notes:* ${rxForm.notes || 'Please call to verify prescription tests and schedule pickup.'}%0A%0A` +
      `_Requested 15-minute callback via TOGU Healthcare Portal_`;

    setTimeout(() => {
      window.open(`https://wa.me/${CONTACT_PHONE_CLEAN}?text=${msg}`, '_blank');
    }, 800);
  };

  return (
    <div className="healthcare-page">
      
      {/* 1. TOP ANNOUNCEMENT & MARQUEE STRIP */}
      <div className="diagnostic-announcement-strip">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ background: '#10b981', color: '#ffffff', padding: '0.15rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
              ⚡ Fast Service
            </span>
            <span>
              Home Sample Collection in 60 Minutes* &nbsp;|&nbsp; Reports in 6 to 12 Hours* &nbsp;|&nbsp; 100% NABL Quality Certified
            </span>
          </div>
          <div style={{ display: 'none', alignItems: 'center', gap: '1.25rem' }} className="d-lg-flex">
            <span>Customer Care: <a href={`tel:${CONTACT_PHONE_CLEAN}`}>{CONTACT_PHONE}</a></span>
            <a 
              href={`https://wa.me/${CONTACT_PHONE_CLEAN}?text=Hello! I want to book a blood test / health checkup package.`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <FaWhatsapp size={16} /> WhatsApp Booking
            </a>
          </div>
        </div>
      </div>

      {/* 2. DIAGNOSTIC SEARCH & LOCATION BAR */}
      <div className="diagnostic-search-header">
        <div className="container">
          <div className="search-header-container">
            
            {/* Location Selector */}
            <div className="location-dropdown-wrapper">
              <button 
                type="button" 
                className="location-btn"
                onClick={() => setIsCityOpen(!isCityOpen)}
                aria-label="Select City"
                title="Service Area: Hyderabad"
              >
                <MapPin size={16} />
                <span>{selectedCity}</span>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              </button>

              <AnimatePresence>
                {isCityOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="location-menu"
                  >
                    <div style={{ padding: '0.65rem 1.25rem 0.35rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Primary Service City
                    </div>
                    {CITIES.map((city) => (
                      <button 
                        key={city}
                        type="button"
                        className="location-item-btn"
                        onClick={() => {
                          setSelectedCity(city);
                          setBookingForm(prev => ({ ...prev, city }));
                          setRxForm(prev => ({ ...prev, city }));
                          setIsCityOpen(false);
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{city}</div>
                          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>● Doorstep Collection Active</div>
                        </div>
                        <Check size={16} color="#2563eb" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Live Search Input */}
            <div className="search-input-box">
              <Search size={18} className="search-icon-inside" />
              <input 
                type="text" 
                placeholder="Search Tests & Health Packages (e.g. Golden Profile, CBC, Thyroid, HbA1c, Vitamin D)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Contact & Prescription Upload */}
            <div className="quick-contact-actions">
              <button 
                type="button" 
                className="btn-rx-upload"
                onClick={() => {
                  setIsRxModalOpen(true);
                  setRxSuccess(false);
                }}
              >
                <UploadCloud size={16} />
                <span>Upload Prescription</span>
              </button>

              <a 
                href={`tel:${CONTACT_PHONE_CLEAN}`} 
                className="btn-call-support"
              >
                <Phone size={15} />
                <span>{CONTACT_PHONE}</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* 3. HERO SECTION (METROPOLIS STYLE) */}
      <section className="diag-hero-section">
        <div className="diag-hero-pattern"></div>
        <div className="container">
          <div className="hero-content-grid">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="hero-badge-pill">
                <Sparkles size={16} />
                <span>India's Trusted Precision Diagnostics Network</span>
              </div>
              <h1 className="hero-main-title">
                Accurate Diagnostics <br />
                <span className="hero-highlight-green">At Your Doorstep & Clinic</span>
              </h1>
              <p className="hero-lead-text">
                Partnered with <strong>Aadhvi Diagnostics Pvt. Ltd.</strong> and Metropolis benchmarks, offering 100% NABL-standard pathology blood tests, advanced health checkup profiles, and rapid digital reports.
              </p>

              {/* Trust Indicators */}
              <div className="hero-trust-row">
                <div className="hero-trust-item">
                  <ShieldCheck size={18} />
                  <span>NABL Quality Accredited</span>
                </div>
                <div className="hero-trust-item">
                  <Clock size={18} />
                  <span>Home Pickup in 60 Mins</span>
                </div>
                <div className="hero-trust-item">
                  <Microscope size={18} />
                  <span>Robotic Automated Analyzers</span>
                </div>
                <div className="hero-trust-item">
                  <Award size={18} />
                  <span>50+ Expert Pathologists</span>
                </div>
              </div>
            </motion.div>

            {/* Right Action Cards Grid (Metropolis 4 Cards) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hero-action-cards"
            >
              
              {/* Card 1: Book A Test */}
              <div 
                className="action-card"
                onClick={() => {
                  const el = document.getElementById("packages-section");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div>
                  <div className="action-card-icon">
                    <Activity size={24} />
                  </div>
                  <h3 className="action-card-title">Book A Test</h3>
                  <p className="action-card-desc">Choose from 6 health packages and 500+ tests</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Explore</span> <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 2: Upload Prescription */}
              <div 
                className="action-card"
                onClick={() => {
                  setIsRxModalOpen(true);
                  setRxSuccess(false);
                }}
              >
                <div>
                  <div className="action-card-icon" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                    <FileText size={24} />
                  </div>
                  <h3 className="action-card-title">Upload Rx</h3>
                  <p className="action-card-desc">Upload doctor's prescription for quick callback</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Upload</span> <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 3: Download Reports */}
              <div 
                className="action-card"
                onClick={() => setIsTrackModalOpen(true)}
              >
                <div>
                  <div className="action-card-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                    <Download size={24} />
                  </div>
                  <h3 className="action-card-title">Download Report</h3>
                  <p className="action-card-desc">Track status or download PDF reports</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Track</span> <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 4: Home Sample Collection */}
              <div 
                className="action-card"
                onClick={() => handleOpenBooking("Home Visit Sample Collection", "Free Pickup*", "AADHVI DIAGNOSTICS PVT. LTD.")}
              >
                <div>
                  <div className="action-card-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
                    <Home size={24} />
                  </div>
                  <h3 className="action-card-title">Home Visit</h3>
                  <p className="action-card-desc">Certified phlebotomist at your doorstep</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span>Book Visit</span> <ArrowRight size={14} />
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. FEATURED SPOTLIGHT: AADHVI DIAGNOSTICS "GOLDEN PROFILE – 1 & 2" */}
      <section className="flagship-spotlight-wrapper" id="golden-profile-spotlight">
        <div className="container">
          
          {/* Profile Switcher & Comparison Header */}
          <div className="profile-switcher-container">
            <div className="profile-switcher-pill">
              <button 
                type="button"
                className={`profile-switch-btn ${activeProfileTab === 1 ? 'active' : ''}`}
                onClick={() => setActiveProfileTab(1)}
              >
                <Sparkles size={16} />
                <span>GOLDEN PROFILE – 1</span>
                <span className="profile-price-pill">₹2,500</span>
              </button>
              <button 
                type="button"
                className={`profile-switch-btn ${activeProfileTab === 2 ? 'active' : ''}`}
                onClick={() => setActiveProfileTab(2)}
              >
                <CheckCircle2 size={16} />
                <span>GOLDEN PROFILE – 2</span>
                <span className="profile-price-pill">₹1,500</span>
              </button>
            </div>

            <div className="profile-comparison-hint">
              <Info size={15} />
              <span>
                {activeProfileTab === 1 
                  ? "Golden Profile 1 includes all 13 test groups including Vitamin B12 and Vitamin D (Individual test sum: ₹9,670)!"
                  : "Golden Profile 2 provides 11 essential test groups (Individual test sum: ₹6,470) for just ₹1,500."}
              </span>
            </div>
          </div>

          <motion.div 
            key={currentGoldenProfile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="golden-profile-card"
          >
            {/* Top Badge Ribbon */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div className="golden-badge-ribbon">
                  <Sparkles size={14} /> {currentGoldenProfile.badge}
                </div>
                <div className="golden-provider-tag">
                  {currentGoldenProfile.provider}
                </div>
                <h2 className="golden-title">
                  {currentGoldenProfile.title}
                </h2>
                <p className="golden-subtitle">
                  {currentGoldenProfile.tagline} • {currentGoldenProfile.groupsCount} Test Groups • {currentGoldenProfile.parametersCount}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="golden-pricing-container">
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
                    Special Offer Price
                  </div>
                  <div className="golden-special-price">{currentGoldenProfile.specialOffer}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Package MRP
                  </div>
                  <div className="golden-mrp-price">{currentGoldenProfile.mrp}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', textTransform: 'uppercase' }}>
                    Individual Test Total
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{currentGoldenProfile.indivTotal}</div>
                </div>
                <div className="golden-discount-badge">
                  {currentGoldenProfile.savings} ({currentGoldenProfile.discount})
                </div>
              </div>
            </div>

            {/* Meta Specifications */}
            <div className="golden-meta-specs">
              <div className="golden-spec-item">
                <Clock size={18} />
                <span>Reports within <strong>{currentGoldenProfile.reportTime}</strong></span>
              </div>
              <div className="golden-spec-item">
                <AlertCircle size={18} />
                <span><strong>{currentGoldenProfile.fasting}</strong></span>
              </div>
              <div className="golden-spec-item">
                <Microscope size={18} />
                <span>Sample: <strong>{currentGoldenProfile.sampleType}</strong></span>
              </div>
              <div className="golden-spec-item">
                <Home size={18} />
                <span>Free Home Sample Collection Available</span>
              </div>
            </div>

            {/* Test Groups Included Heading */}
            <div className="test-groups-heading">
              <span>{currentGoldenProfile.groupsCount} Critical Test Groups Included in Package</span>
              <button 
                type="button"
                onClick={() => handleOpenPackageDetails(activeProfileTab === 1 ? RATE_CARD_PACKAGES[4] : RATE_CARD_PACKAGES[3])}
                style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>View Full Parameters List</span> <ChevronRight size={16} />
              </button>
            </div>

            {/* Test Groups Grid */}
            <div className="test-groups-grid">
              {currentGoldenProfile.testGroups.map((group) => (
                <div key={group.id} className="test-group-item">
                  <div className="test-group-number">{group.id}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="test-group-title">{group.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700 }}>{group.mrp}</span>
                    </div>
                    <div className="test-group-subtitle">{group.short}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quality & Terms Guarantee Banner */}
            <div className="golden-footer-guarantee">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>✔ Accurate Quality</span>
                <span>•</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>✔ Affordable Prices</span>
                <span>•</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>✔ Fast & Reliable Reports</span>
              </div>
              <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>
                * Fasting requirements and report turnaround time confirmed with laboratory. Terms apply.
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="golden-cta-actions">
              <button 
                type="button" 
                className="btn-book-golden"
                onClick={() => handleOpenBooking(
                  `${currentGoldenProfile.title} (${currentGoldenProfile.tagline})`, 
                  currentGoldenProfile.specialOffer, 
                  currentGoldenProfile.provider
                )}
              >
                <Calendar size={18} />
                <span>Book {currentGoldenProfile.title} ({currentGoldenProfile.specialOffer})</span>
              </button>

              <button 
                type="button" 
                className="btn-details-golden"
                onClick={() => handleOpenPackageDetails(activeProfileTab === 1 ? RATE_CARD_PACKAGES[4] : RATE_CARD_PACKAGES[3])}
              >
                <Info size={18} />
                <span>View Full Breakdown ({currentGoldenProfile.groupsCount} Tests)</span>
              </button>

              <a 
                href={`https://wa.me/${CONTACT_PHONE_CLEAN}?text=${encodeURIComponent(`Hi, I want to book the ${currentGoldenProfile.title} ${currentGoldenProfile.tagline} package for ${currentGoldenProfile.specialOffer} by ${currentGoldenProfile.provider}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-details-golden"
                style={{ background: 'rgba(37, 211, 102, 0.2)', borderColor: '#25D366', color: '#ffffff' }}
              >
                <FaWhatsapp size={18} color="#25D366" />
                <span>Instant WhatsApp Booking</span>
              </a>
            </div>

          </motion.div>

        </div>
      </section>

      {/* 5. OFFICIAL RATE CARD & TEST-WISE COMPARISON TABLE */}
      <section className="rate-card-section" id="rate-card-section">
        <div className="container">
          
          <div className="section-header-row">
            <div>
              <div className="section-tag">Approved Website Rate Card</div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                Health Check-up Packages — Test-wise Parameters & Prices
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                Complete transparency with individual test MRP valuations, package MRPs, and discounted special offer prices.
              </p>
            </div>
            <a 
              href={`https://wa.me/${CONTACT_PHONE_CLEAN}?text=Hi, I would like to get the official PDF rate card for health checkup packages.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-rx-upload"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} />
              <span>Download PDF Rate Card</span>
            </a>
          </div>

          {/* Rate Card Table */}
          <div className="rate-card-table-wrapper">
            {RATE_CARD_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="rate-card-row">
                
                {/* Header Bar */}
                <div className="rate-card-header-bar">
                  <div>
                    <div className="rate-card-pkg-name">
                      <span>{pkg.title}</span>
                      {pkg.flagship && (
                        <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                          {pkg.badgeText}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {pkg.tagline} • {pkg.testsCount}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="rate-card-prices-box">
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Special Offer</div>
                      <div className="rate-card-offer">{pkg.offer}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Package MRP</div>
                      <div className="rate-card-mrp">{pkg.mrp}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Individual Total</div>
                      <div className="rate-card-indiv-sum">{pkg.indivTotal}</div>
                    </div>
                    <div className="pkg-discount-pill" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                      {pkg.savings}
                    </div>
                    <button 
                      type="button" 
                      className="btn-pkg-book"
                      style={{ padding: '0.65rem 1.4rem' }}
                      onClick={() => handleOpenBooking(pkg.title, pkg.offer, "AADHVI DIAGNOSTICS PVT. LTD.")}
                    >
                      <Calendar size={15} />
                      <span>Book Package</span>
                    </button>
                  </div>
                </div>

                {/* Included Tests Chips with Individual MRPs */}
                <div className="rate-card-tests-tags">
                  {pkg.tests.map((t, tIdx) => (
                    <div key={tIdx} className="test-tag-chip">
                      <CheckCircle2 size={14} color="#2563eb" />
                      <span>{t.name}</span>
                      <span className="test-price-tag">{t.mrp}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. METROPOLIS-STYLE FULL BODY PACKAGES SECTION */}
      <section className="packages-section" id="packages-section">
        <div className="container">
          
          <div className="section-header-row">
            <div>
              <div className="section-tag">Preventive Pathology Care</div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                All Health Checkup Packages
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                Carefully crafted health checkups suited for every age group and lifestyle need.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs-row">
              <button 
                type="button" 
                className={`filter-tab-btn ${packageCategory === 'all' ? 'active' : ''}`}
                onClick={() => setPackageCategory('all')}
              >
                All (6)
              </button>
              <button 
                type="button" 
                className={`filter-tab-btn ${packageCategory === 'golden' ? 'active' : ''}`}
                onClick={() => setPackageCategory('golden')}
              >
                Golden Profiles
              </button>
              <button 
                type="button" 
                className={`filter-tab-btn ${packageCategory === 'basic' ? 'active' : ''}`}
                onClick={() => setPackageCategory('basic')}
              >
                Basic & Essential
              </button>
              <button 
                type="button" 
                className={`filter-tab-btn ${packageCategory === 'diabetes' ? 'active' : ''}`}
                onClick={() => setPackageCategory('diabetes')}
              >
                Diabetes Screen
              </button>
              <button 
                type="button" 
                className={`filter-tab-btn ${packageCategory === 'senior' ? 'active' : ''}`}
                onClick={() => setPackageCategory('senior')}
              >
                Senior Citizens
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="packages-grid">
            {filteredPackages.map((pkg) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="pkg-card"
                style={{
                  border: pkg.flagship ? '2px solid rgba(37, 99, 235, 0.45)' : '1px solid var(--border)',
                  background: pkg.flagship ? 'rgba(37, 99, 235, 0.02)' : 'var(--surface)'
                }}
              >
                {pkg.popular && (
                  <div className="pkg-popular-badge">
                    {pkg.badgeText || "Most Popular"}
                  </div>
                )}

                <div>
                  <div className="pkg-header-badge">AADHVI DIAGNOSTICS PVT. LTD.</div>
                  <h3 className="pkg-title">{pkg.title}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    {pkg.tagline}
                  </div>

                  <div className="pkg-specs-row">
                    <div className="pkg-spec-unit">
                      <Microscope size={15} />
                      <span>{pkg.testsCount}</span>
                    </div>
                    <div className="pkg-spec-unit">
                      <Clock size={15} />
                      <span>{pkg.reportTime}</span>
                    </div>
                  </div>

                  <ul className="pkg-features-list">
                    {pkg.tests.slice(0, 5).map((feat, idx) => (
                      <li key={idx} className="pkg-feature-item">
                        <CheckCircle2 size={16} />
                        <span>{feat.name} ({feat.mrp})</span>
                      </li>
                    ))}
                    {pkg.tests.length > 5 && (
                      <li style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, paddingLeft: '1.5rem' }}>
                        + {pkg.tests.length - 5} more tests included
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <div className="pkg-price-row">
                    <span className="pkg-price-current">{pkg.offer}</span>
                    <span className="pkg-price-old">{pkg.mrp}</span>
                    <span className="pkg-discount-pill">{pkg.savings}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Suggested Individual Total: <strong>{pkg.indivTotal}</strong>
                  </div>

                  <div className="pkg-actions-row">
                    <button 
                      type="button" 
                      className="btn-pkg-book"
                      onClick={() => handleOpenBooking(pkg.title, pkg.offer, "AADHVI DIAGNOSTICS PVT. LTD.")}
                    >
                      <Calendar size={15} />
                      <span>Book Package</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-pkg-info"
                      onClick={() => handleOpenPackageDetails(pkg)}
                      title="View Full Test Breakdown"
                    >
                      <Info size={18} />
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. POPULAR ROUTINE BLOOD TESTS (METROPOLIS STYLE) */}
      <section className="tests-section" id="popular-tests">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-tag">Individual Tests</div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
                Most Booked Blood Tests
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
                Select single parameters or routine profiles for rapid same-day testing.
              </p>
            </div>
            <div>
              <button 
                type="button" 
                className="btn-rx-upload"
                onClick={() => {
                  setIsRxModalOpen(true);
                  setRxSuccess(false);
                }}
              >
                <UploadCloud size={16} />
                <span>Upload Doctor's Prescription</span>
              </button>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="tests-grid">
            {filteredTests.map((test) => (
              <motion.div 
                key={test.code}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="test-card"
              >
                <div>
                  <div className="test-tag-code">{test.code} • {test.category}</div>
                  <h3 className="test-name">{test.name}</h3>
                  <div className="test-sample-info">
                    <Microscope size={13} />
                    <span>{test.sample} &nbsp;|&nbsp; Reports in {test.reportTime}</span>
                  </div>
                </div>

                <div className="test-price-action-row">
                  <div>
                    <span className="test-price">{test.price}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                      {test.mrp}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-add-test"
                    onClick={() => handleOpenBooking(test.name, test.price, "Aadhvi & Metropolis Labs")}
                  >
                    Book Test
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTS BY HEALTH CONDITION (METROPOLIS STYLE) */}
      <section className="conditions-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <div className="section-tag">Targeted Diagnostics</div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Find Tests by Health Condition
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Browse screenings recommended for specific chronic conditions, organ health, and vitals.
            </p>
          </div>

          <div className="conditions-grid">
            {CONDITIONS_DATA.map((cond, idx) => (
              <motion.div 
                key={cond.id} 
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 400, damping: 18 }
                }}
                whileTap={{ scale: 0.97 }}
                className={`condition-card condition-card-${cond.id}`}
                style={{
                  '--cond-accent': cond.accent,
                  '--cond-bg': cond.bgGradient,
                  '--cond-dark-bg': cond.darkBg,
                  '--cond-border': cond.borderColor,
                  '--cond-icon-bg': cond.iconBg,
                  '--cond-glow': cond.glowColor
                }}
                onClick={() => {
                  setSearchQuery(cond.label);
                  const el = document.getElementById("packages-section");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="condition-card-shimmer" style={{ background: cond.iconBg }}></div>
                
                <motion.div 
                  className="condition-icon-box"
                  whileHover={{ rotate: [0, -12, 12, -6, 0], scale: 1.15 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="condition-icon-symbol">{cond.icon}</span>
                </motion.div>

                <div className="condition-content">
                  <div className="condition-label">{cond.label}</div>
                  <div className="condition-tagline">{cond.tagline}</div>
                  <div 
                    className="condition-count-badge" 
                    style={{ 
                      color: cond.accent, 
                      backgroundColor: `${cond.accent}14`, 
                      borderColor: `${cond.accent}40` 
                    }}
                  >
                    <span>{cond.count}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HOW HOME SAMPLE COLLECTION WORKS (METROPOLIS 4-STEP TIMELINE) */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <div className="section-tag">Convenient & Safe</div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              How Home Sample Collection Works
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
              Experience high quality diagnostic care without leaving the comfort of your home.
            </p>
          </div>

          <div className="steps-grid">
            
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number-tag">1</div>
              <h3 className="step-card-title">Book Online / WhatsApp</h3>
              <p className="step-card-desc">
                Select your package, test, or simply upload your doctor's prescription. Pick your preferred date and time slot.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number-tag">2</div>
              <h3 className="step-card-title">Phlebotomist Visit</h3>
              <p className="step-card-desc">
                A vaccinated, certified phlebotomist arrives at your doorstep wearing full protective gear with sterilized collection tools.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number-tag">3</div>
              <h3 className="step-card-title">Painless & Barcoded Draw</h3>
              <p className="step-card-desc">
                Samples are barcoded on the spot and preserved in temperature-controlled cold-chain containers to ensure absolute sample integrity.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-number-tag">4</div>
              <h3 className="step-card-title">Digital Reports in 12-24 Hrs</h3>
              <p className="step-card-desc">
                Accurate, NABL doctor-verified diagnostic reports delivered directly to your WhatsApp and email with smart analytics.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 10. TRUST & ACCREDITATIONS SECTION */}
      <section className="trust-bar-section">
        <div className="container">
          <div className="trust-badges-grid">
            
            <div className="trust-badge-item">
              <div className="trust-badge-icon">
                <ShieldCheck size={28} />
              </div>
              <div className="trust-badge-val">NABL & ISO</div>
              <div className="trust-badge-sub">Quality Certified Labs</div>
            </div>

            <div className="trust-badge-item">
              <div className="trust-badge-icon">
                <Clock size={28} />
              </div>
              <div className="trust-badge-val">60 Mins</div>
              <div className="trust-badge-sub">Express Home Sample Pickup</div>
            </div>

            <div className="trust-badge-item">
              <div className="trust-badge-icon">
                <Award size={28} />
              </div>
              <div className="trust-badge-val">50+ Doctors</div>
              <div className="trust-badge-sub">Senior MD Pathologists</div>
            </div>

            <div className="trust-badge-item">
              <div className="trust-badge-icon">
                <HeartPulse size={28} />
              </div>
              <div className="trust-badge-val">50,000+</div>
              <div className="trust-badge-sub">Patients Screened</div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. FAQS ACCORDION */}
      <section className="faq-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <div className="section-tag">Got Questions?</div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Everything you need to know about tests, fasting, and reports.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div key={index} className="faq-card">
                <button 
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s' 
                    }} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="faq-answer-box"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 12. INTERACTIVE MODAL: BOOKING / HOME COLLECTION FORM */}
      <AnimatePresence>
        {bookingModal.isOpen && (
          <div className="diag-modal-backdrop" onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="diag-modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="diag-modal-header">
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                    {bookingModal.itemProvider}
                  </div>
                  <h3 className="diag-modal-title">Book {bookingModal.itemTitle}</h3>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
                    Package Fee: {bookingModal.itemPrice}
                  </div>
                </div>
                <button 
                  type="button" 
                  className="diag-modal-close-btn"
                  onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="diag-modal-body">
                {bookingSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      Booking Dispatched!
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                      Your appointment details have been prepared for dispatch to WhatsApp coordinator <strong>{CONTACT_PHONE}</strong>. Our diagnostic team will call to confirm your home collection slot.
                    </p>
                    <button 
                      type="button"
                      className="modal-submit-btn"
                      onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit}>
                    
                    <div className="form-group">
                      <label className="form-label">Patient Full Name *</label>
                      <input 
                        type="text" 
                        required
                        className="form-control" 
                        placeholder="Enter patient's name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input 
                        type="tel" 
                        required
                        className="form-control" 
                        placeholder="e.g. 9876543210"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <select 
                          className="form-control"
                          value={bookingForm.city}
                          onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                        >
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Collection Mode *</label>
                        <select 
                          className="form-control"
                          value={bookingForm.collectionType}
                          onChange={(e) => setBookingForm({ ...bookingForm, collectionType: e.target.value })}
                        >
                          <option value="Home Sample Collection">Home Sample Collection</option>
                          <option value="Lab Visit">Visit Nearest Lab Centre</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address / Landmark (for Home Collection)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="House no, Street, Colony, Landmark"
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Preferred Date *</label>
                        <input 
                          type="date" 
                          required
                          className="form-control"
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Time Slot *</label>
                        <select 
                          className="form-control"
                          value={bookingForm.timeSlot}
                          onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                        >
                          <option value="Early Morning (06:30 AM - 08:30 AM)">Early Morning (06:30 AM - 08:30 AM)</option>
                          <option value="Morning (08:30 AM - 10:30 AM)">Morning (08:30 AM - 10:30 AM)</option>
                          <option value="Mid-day (10:30 AM - 12:30 PM)">Mid-day (10:30 AM - 12:30 PM)</option>
                          <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="modal-submit-btn" style={{ marginTop: '1rem' }}>
                      <FaWhatsapp size={18} />
                      <span>Confirm & Book via WhatsApp</span>
                    </button>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. INTERACTIVE MODAL: UPLOAD PRESCRIPTION */}
      <AnimatePresence>
        {isRxModalOpen && (
          <div className="diag-modal-backdrop" onClick={() => setIsRxModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="diag-modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="diag-modal-header">
                <div>
                  <h3 className="diag-modal-title">Upload Doctor's Prescription</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
                    Our pathology specialist will decode tests and give you the best discount package.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="diag-modal-close-btn"
                  onClick={() => setIsRxModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="diag-modal-body">
                {rxSuccess ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      Prescription Request Received!
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                      Thank you! Our expert counselor will call you on <strong>{rxForm.phone}</strong> within 15 minutes to confirm required blood tests and arrange home sample pickup.
                    </p>
                    <button 
                      type="button"
                      className="modal-submit-btn"
                      onClick={() => setIsRxModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRxSubmit}>
                    
                    <div style={{ border: '2px dashed #2563eb', borderRadius: '20px', padding: '2.25rem 1.5rem', textAlign: 'center', background: 'rgba(37, 99, 235, 0.04)', marginBottom: '1.5rem', cursor: 'pointer' }}>
                      <UploadCloud size={44} color="#2563eb" style={{ margin: '0 auto 0.75rem' }} />
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                        Click to Select or Drag & Drop Prescription
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Supports JPG, PNG, PDF up to 15MB
                      </div>
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        style={{ display: 'none' }}
                        id="prescription-file-input"
                      />
                      <label 
                        htmlFor="prescription-file-input" 
                        className="btn-rx-upload"
                        style={{ marginTop: '1rem', display: 'inline-flex', cursor: 'pointer' }}
                      >
                        Choose File
                      </label>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Patient Name *</label>
                      <input 
                        type="text" 
                        required
                        className="form-control"
                        placeholder="Patient's name"
                        value={rxForm.name}
                        onChange={(e) => setRxForm({ ...rxForm, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number * (for quick callback)</label>
                      <input 
                        type="tel" 
                        required
                        className="form-control"
                        placeholder="Mobile number"
                        value={rxForm.phone}
                        onChange={(e) => setRxForm({ ...rxForm, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select 
                        className="form-control"
                        value={rxForm.city}
                        onChange={(e) => setRxForm({ ...rxForm, city: e.target.value })}
                      >
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Doctor Notes / Special Requirements</label>
                      <textarea 
                        className="form-control"
                        rows={2}
                        placeholder="Any doctor instructions or symptoms..."
                        value={rxForm.notes}
                        onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="modal-submit-btn">
                      <span>Request 15-Min Callback via WhatsApp</span>
                    </button>

                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 14. INTERACTIVE MODAL: PACKAGE DETAILS BREAKDOWN (FOR ALL 6 PACKAGES) */}
      <AnimatePresence>
        {isPackageDetailModalOpen && selectedDetailPackage && (
          <div className="diag-modal-backdrop" onClick={() => setIsPackageDetailModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="diag-modal-panel"
              style={{ maxWidth: '750px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="diag-modal-header">
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 800, textTransform: 'uppercase' }}>
                    AADHVI DIAGNOSTICS PVT. LTD.
                  </div>
                  <h3 className="diag-modal-title">
                    {selectedDetailPackage.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Special Offer: <strong style={{ color: '#2563eb' }}>{selectedDetailPackage.offer}</strong> (Package MRP: {selectedDetailPackage.mrp}) • {selectedDetailPackage.savings}
                  </div>
                </div>
                <button 
                  type="button" 
                  className="diag-modal-close-btn"
                  onClick={() => setIsPackageDetailModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="diag-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.08)', borderRadius: '16px', padding: '1.15rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <strong>Key Requirements:</strong> {selectedDetailPackage.fasting}. Fast and reliable doctor-signed digital reports within {selectedDetailPackage.reportTime}. Suggested individual test total: <strong>{selectedDetailPackage.indivTotal}</strong>.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {selectedDetailPackage.tests.map((test, tIndex) => (
                    <div 
                      key={tIndex} 
                      style={{ 
                        border: '1px solid var(--border)', 
                        borderRadius: '14px', 
                        padding: '1rem 1.25rem',
                        background: 'var(--bg-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ 
                          width: '26px', height: '26px', borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 800, fontSize: '0.78rem' 
                        }}>
                          {tIndex + 1}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>
                          {test.name}
                        </h4>
                      </div>
                      <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.95rem' }}>
                        {test.mrp}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button"
                    className="modal-submit-btn"
                    onClick={() => {
                      setIsPackageDetailModalOpen(false);
                      handleOpenBooking(
                        selectedDetailPackage.title, 
                        selectedDetailPackage.offer, 
                        "AADHVI DIAGNOSTICS PVT. LTD."
                      );
                    }}
                  >
                    <span>Proceed to Book ({selectedDetailPackage.offer})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 15. INTERACTIVE MODAL: TRACK / DOWNLOAD REPORTS */}
      <AnimatePresence>
        {isTrackModalOpen && (
          <div className="diag-modal-backdrop" onClick={() => setIsTrackModalOpen(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="diag-modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="diag-modal-header">
                <div>
                  <h3 className="diag-modal-title">Track Sample & Download Report</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
                    Enter your Registered Mobile Number or Lab Barcode ID.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="diag-modal-close-btn"
                  onClick={() => setIsTrackModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="diag-modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert("Sample tracking link and verified PDF report sent to your WhatsApp!");
                  setIsTrackModalOpen(false);
                }}>
                  <div className="form-group">
                    <label className="form-label">Registered Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      className="form-control"
                      placeholder="e.g. 9876543210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lab Booking / Barcode ID (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. AAD-2026-9812"
                    />
                  </div>

                  <button type="submit" className="modal-submit-btn">
                    <Download size={18} />
                    <span>Get Report via WhatsApp</span>
                  </button>

                  <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Need urgent report assistance? Call support at <a href={`tel:${CONTACT_PHONE_CLEAN}`} style={{ color: '#2563eb', fontWeight: 700 }}>{CONTACT_PHONE}</a>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 16. METROPOLIS MOBILE STICKY BOTTOM ACTION BAR */}
      <div className="metropolis-mobile-bar">
        <div>
          <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Need Help Booking Tests?</div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{CONTACT_PHONE}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a 
            href={`https://wa.me/${CONTACT_PHONE_CLEAN}?text=Hi, I would like to book a blood test or health package.`}
            className="btn"
            style={{ background: '#25D366', color: '#ffffff', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <FaWhatsapp size={16} /> WhatsApp
          </a>
          <button 
            type="button"
            className="btn"
            style={{ background: '#ffffff', color: '#2563eb', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 700 }}
            onClick={() => handleOpenBooking(currentGoldenProfile.title, currentGoldenProfile.specialOffer, currentGoldenProfile.provider)}
          >
            Book Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default Healthcare;
