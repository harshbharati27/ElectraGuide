const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
app.use(express.json());

// Knowledge base — keyword-based smart matching
const knowledge = {
  en: {
    greetings: ["hello", "hi", "hey", "good morning", "good evening", "namaste"],
    greetingReply: "Hello! 👋 I'm ElectraGuide, your election process assistant for India. Ask me anything about voting, registration, or elections!",

    topics: [
      {
        keywords: ["step", "process", "how election work", "stages"],
        answer: "The election process in India involves 5 key steps:\n\n1️⃣ Registration — Verify your name on the Electoral Roll via the NVSP portal.\n2️⃣ Campaigning — Candidates hold rallies and release manifestos.\n3️⃣ Voting Day — Citizens cast votes at assigned polling booths using EVMs.\n4️⃣ Counting — Secure counting of EVM votes under strict supervision.\n5️⃣ Results — Official declaration by the Election Commission of India."
      },
      {
        keywords: ["how to vote", "voting procedure", "cast vote", "evm", "how do i vote"],
        answer: "How to vote in India:\n\n1️⃣ Go to your assigned polling booth with your Voter ID (EPIC) or Aadhaar/PAN.\n2️⃣ Get your name verified by the polling officer.\n3️⃣ Go inside the EVM compartment and press the blue button next to your chosen candidate.\n4️⃣ Check the VVPAT slip displayed for 7 seconds to confirm your vote.\n\n💡 Tip: You can find your polling booth at eci.gov.in!"
      },
      {
        keywords: ["what is election", "definition", "meaning of election", "election kya"],
        answer: "An election is a democratic process where citizens collectively choose their representatives. In India, elections are held for:\n\n• Lok Sabha (Parliament)\n• Vidhan Sabha (State Assembly)\n• Local bodies (Panchayat, Municipal)\n\nThe Election Commission of India (ECI) oversees free and fair elections across the country."
      },
      {
        keywords: ["timeline", "when", "schedule", "phases", "dates"],
        answer: "India Election Timeline:\n\n📅 Pre-Election — Registration deadlines, candidate nominations, and campaigning period.\n📅 Election Day(s) — Voting happens in multiple phases across states.\n📅 Post-Election — Counting day, result announcements, and government formation.\n\n💡 Elections are often held in 7 phases to manage India's massive voter population!"
      },
      {
        keywords: ["nota", "none of the above", "reject all"],
        answer: "NOTA (None of the Above) 🚫\n\nNOTA is a special option on the EVM that lets you officially reject all candidates in your constituency. It was introduced in India in 2013 after a Supreme Court ruling.\n\n💡 Note: Even if NOTA gets the most votes, the candidate with the highest votes among the contenders still wins."
      },
      {
        keywords: ["register", "registration", "voter id", "new voter", "nvsp", "epic", "enroll", "eligible", "eligibility", "age criteria", "minimum age", "who can vote", "can i vote", "qualify", "requirement"],
        answer: "How to Register as a Voter:\n\n📌 Eligibility: You must be an Indian citizen and at least 18 years old on the qualifying date.\n\n1️⃣ Visit the NVSP portal: voters.eci.gov.in\n2️⃣ Fill out Form 6 (for new voters) or Form 6B (for overseas voters).\n3️⃣ Upload documents: Proof of age + Proof of address.\n4️⃣ Submit and track your application online.\n\n💡 The minimum voting age in India is 18 years."
      },
      {
        keywords: ["lost", "misplace", "forgot id", "no voter id"],
        answer: "Lost your Voter ID? Don't panic! 🛡️\n\nYou can still vote if your name is on the Electoral Roll. Carry any of these alternative IDs:\n• Aadhaar Card\n• PAN Card\n• Driving License\n• Passport\n• MGNREGA Job Card\n\n💡 To get a duplicate Voter ID, apply on the NVSP portal using Form 002."
      },
      {
        keywords: ["miss", "missed", "deadline", "too late", "couldn't register"],
        answer: "Missed the registration deadline? ⏰\n\nUnfortunately, you cannot vote if your name isn't on the Electoral Roll for this election. But here's what you can do:\n\n1️⃣ Register NOW on the NVSP portal so you're ready for the next election.\n2️⃣ Check your registration status at electoralsearch.eci.gov.in\n3️⃣ Set reminders for the next registration window.\n\n💡 Registration usually opens months before an election."
      },
      {
        keywords: ["first time", "new voter", "never voted", "18", "young voter", "beginner", "freshly", "just turned"],
        answer: "First-Time Voter? Welcome! 🎉\n\nHere's your quick checklist:\n\n✅ Make sure you're 18+ on the qualifying date.\n✅ Register at voters.eci.gov.in using Form 6.\n✅ Check the voter list for your name before election day.\n✅ Locate your polling booth using the Voter Helpline App.\n✅ Carry your EPIC card or Aadhaar on voting day.\n\n💡 Tip: The Voter Helpline App (available on Android/iOS) is your best friend!"
      },
      {
        keywords: ["booth", "polling station", "where to vote", "location"],
        answer: "Finding Your Polling Booth:\n\n1️⃣ Visit electoralsearch.eci.gov.in\n2️⃣ Enter your details or EPIC number.\n3️⃣ Your assigned polling station will be displayed.\n\nAlternatively, download the 'Voter Helpline' app and search there.\n\n💡 Polling booths are usually within 2 km of your registered address."
      },
      {
        keywords: ["eci", "election commission", "who conducts"],
        answer: "The Election Commission of India (ECI) 🏛️\n\nThe ECI is an autonomous constitutional body responsible for conducting elections in India. It was established on 25th January, 1950.\n\n• Headed by the Chief Election Commissioner (CEC).\n• Ensures free, fair, and transparent elections.\n• Enforces the Model Code of Conduct during elections.\n\n🌐 Official website: eci.gov.in"
      },
      {
        keywords: ["document", "id proof", "what to bring", "carry"],
        answer: "Documents Accepted at the Polling Booth:\n\n✅ Voter ID Card (EPIC)\n✅ Aadhaar Card\n✅ PAN Card\n✅ Driving License\n✅ Passport\n✅ MGNREGA Job Card\n✅ Bank/Post Office Passbook with Photo\n\n💡 At least one valid photo ID is mandatory to vote."
      }
    ],
    fallback: "I'm not sure about that. Try asking me about:\n• Election process & steps\n• How to vote\n• Voter registration\n• NOTA\n• Required documents\n• Finding your polling booth\n• Election Commission of India"
  },
  hi: {
    greetings: ["hello", "hi", "hey", "namaste", "नमस्ते", "हेलो"],
    greetingReply: "नमस्ते! 👋 मैं ElectraGuide हूँ, भारत की चुनाव प्रक्रिया के लिए आपका सहायक। मुझसे मतदान, पंजीकरण या चुनाव के बारे में कुछ भी पूछें!",
    topics: [
      { keywords: ["step", "process", "प्रक्रिया", "चरण"], answer: "भारत में चुनाव प्रक्रिया:\n\n1️⃣ पंजीकरण — मतदाता सूची में नाम जांचें।\n2️⃣ प्रचार — रैलियां और घोषणापत्र।\n3️⃣ मतदान — मतदान केंद्रों पर EVM से वोट।\n4️⃣ मतगणना — सुरक्षित गिनती।\n5️⃣ परिणाम — निर्वाचन आयोग द्वारा आधिकारिक घोषणा।" },
      { keywords: ["vote", "कैसे", "वोट", "मतदान"], answer: "भारत में वोट कैसे डालें:\n\n1️⃣ वोटर आईडी (EPIC) या आधार लेकर मतदान केंद्र जाएं।\n2️⃣ अधिकारी से नाम सत्यापित कराएं।\n3️⃣ EVM पर उम्मीदवार के बगल वाला नीला बटन दबाएं।\n4️⃣ 7 सेकंड VVPAT पर्ची देखें।\n\n💡 अपना मतदान केंद्र eci.gov.in पर खोजें!" },
      { keywords: ["election", "चुनाव", "definition", "क्या है"], answer: "चुनाव एक लोकतांत्रिक प्रक्रिया है जहां नागरिक अपने प्रतिनिधि चुनते हैं।\n\n• लोकसभा (संसद)\n• विधानसभा (राज्य)\n• स्थानीय निकाय (पंचायत, नगरपालिका)\n\nभारत निर्वाचन आयोग (ECI) स्वतंत्र और निष्पक्ष चुनाव सुनिश्चित करता है।" },
      { keywords: ["nota", "नोटा"], answer: "नोटा (NOTA) 🚫\n\nEVM पर एक विशेष विकल्प जो आपको सभी उम्मीदवारों को खारिज करने की अनुमति देता है। 2013 में सुप्रीम कोर्ट के आदेश से शुरू हुआ।\n\n💡 नोटा को सबसे ज्यादा वोट मिलने पर भी बाकी उम्मीदवारों में से विजेता घोषित होता है।" },
      { keywords: ["register", "पंजीकरण", "voter id", "नया", "eligible", "eligibility", "पात्रता", "आयु", "उम्र", "age", "कौन वोट"], answer: "मतदाता पंजीकरण:\n\n📌 पात्रता: भारतीय नागरिक और न्यूनतम 18 वर्ष आयु आवश्यक।\n\n1️⃣ NVSP पोर्टल: voters.eci.gov.in पर जाएं।\n2️⃣ फॉर्म 6 भरें।\n3️⃣ आयु और पता प्रमाण अपलोड करें।\n4️⃣ आवेदन ट्रैक करें।" },
      { keywords: ["lost", "खो", "भूल", "हरवला"], answer: "वोटर आईडी खो गया? 🛡️\n\nमतदाता सूची में नाम है तो इनमें से कोई भी ID लाएं:\n• आधार\n• पैन\n• ड्राइविंग लाइसेंस\n• पासपोर्ट\n\n💡 डुप्लिकेट के लिए NVSP पर फॉर्म 002 भरें।" },
      { keywords: ["first", "पहली बार", "नया मतदाता", "18"], answer: "पहली बार वोट? स्वागत है! 🎉\n\n✅ 18+ आयु सुनिश्चित करें।\n✅ voters.eci.gov.in पर फॉर्म 6 से पंजीकरण।\n✅ चुनाव से पहले मतदाता सूची में नाम जांचें।\n✅ वोटर हेल्पलाइन ऐप डाउनलोड करें।\n✅ EPIC या आधार साथ रखें।" },
      { keywords: ["document", "id", "दस्तावेज", "लाना"], answer: "मतदान केंद्र पर स्वीकार्य दस्तावेज:\n\n✅ वोटर आईडी (EPIC)\n✅ आधार कार्ड\n✅ पैन कार्ड\n✅ ड्राइविंग लाइसेंस\n✅ पासपोर्ट\n\n💡 कम से कम एक फोटो ID अनिवार्य है।" }
    ],
    fallback: "मुझे यह समझ नहीं आया। इस बारे में पूछें:\n• चुनाव प्रक्रिया\n• वोट कैसे डालें\n• मतदाता पंजीकरण\n• नोटा\n• आवश्यक दस्तावेज"
  },
  bn: {
    greetings: ["hello", "hi", "নমস্কার", "হ্যালো"],
    greetingReply: "নমস্কার! 👋 আমি ElectraGuide, ভারতের নির্বাচন প্রক্রিয়ার জন্য আপনার সহায়ক। ভোটদান বা নিবন্ধন সম্পর্কে প্রশ্ন করুন!",
    topics: [
      { keywords: ["step", "process", "প্রক্রিয়া"], answer: "ভারতে নির্বাচন প্রক্রিয়া:\n\n1️⃣ নিবন্ধন — ভোটার তালিকায় নাম যাচাই।\n2️⃣ প্রচার — সমাবেশ ও ইশতেহার।\n3️⃣ ভোটদান — ভোটকেন্দ্রে EVM-এ ভোট।\n4️⃣ গণনা — নিরাপদ EVM গণনা।\n5️⃣ ফলাফল।" },
      { keywords: ["vote", "ভোট", "কিভাবে"], answer: "কিভাবে ভোট দেবেন:\n\n1️⃣ ভোটার আইডি (EPIC) বা আধার নিয়ে ভোটকেন্দ্রে যান।\n2️⃣ অফিসারের কাছে নাম যাচাই করুন।\n3️⃣ EVM-এ প্রার্থীর পাশের নীল বোতাম টিপুন।\n4️⃣ ৭ সেকেন্ড VVPAT স্লিপ চেক করুন।" },
      { keywords: ["nota", "নোটা"], answer: "নোটা (NOTA) 🚫\n\nEVM-এর একটি বিকল্প যা আপনাকে সমস্ত প্রার্থীকে প্রত্যাখ্যান করার অনুমতি দেয়।" },
      { keywords: ["register", "নিবন্ধন", "নতুন"], answer: "ভোটার নিবন্ধন:\n\n1️⃣ NVSP পোর্টাল: voters.eci.gov.in\n2️⃣ ফর্ম 6 পূরণ করুন।\n3️⃣ নথি আপলোড করুন।\n\n📌 ১৮+ বয়স এবং ভারতীয় নাগরিক হতে হবে।" }
    ],
    fallback: "দুঃখিত, আমি বুঝতে পারিনি। চেষ্টা করুন:\n• নির্বাচন প্রক্রিয়া\n• কিভাবে ভোট দেবেন\n• ভোটার নিবন্ধন\n• নোটা"
  },
  mr: {
    greetings: ["hello", "hi", "नमस्कार", "हॅलो"],
    greetingReply: "नमस्कार! 👋 मी ElectraGuide, भारतातील निवडणूक प्रक्रियेसाठी तुमचा सहायक. मतदान, नोंदणी यासंबंधी प्रश्न विचारा!",
    topics: [
      { keywords: ["step", "process", "प्रक्रिया"], answer: "निवडणूक प्रक्रिया:\n\n1️⃣ नोंदणी — मतदार यादीत नाव तपासा.\n2️⃣ प्रचार — रॅली आणि जाहीरनामे.\n3️⃣ मतदान — EVM वर मतदान.\n4️⃣ मतमोजणी.\n5️⃣ निकाल." },
      { keywords: ["vote", "मतदान", "कसे"], answer: "मतदान कसे करावे:\n\n1️⃣ मतदार ओळखपत्र (EPIC) किंवा आधार घेऊन मतदान केंद्रावर जा.\n2️⃣ अधिकाऱ्याकडे नाव पडताळा.\n3️⃣ EVM वर उमेदवारासमोरील निळे बटण दाबा.\n4️⃣ ७ सेकंद VVPAT स्लिप तपासा." },
      { keywords: ["nota", "नोटा"], answer: "नोटा (NOTA) 🚫\n\nEVM वरील एक पर्याय जो सर्व उमेदवारांना नाकारण्याची परवानगी देतो." },
      { keywords: ["register", "नोंदणी", "नवा"], answer: "मतदार नोंदणी:\n\n1️⃣ NVSP पोर्टल: voters.eci.gov.in\n2️⃣ फॉर्म 6 भरा.\n3️⃣ कागदपत्रे अपलोड करा.\n\n📌 १८+ वय आणि भारतीय नागरिक असणे आवश्यक." }
    ],
    fallback: "क्षमस्व, मला समजले नाही. विचारून पहा:\n• निवडणूक प्रक्रिया\n• मतदान कसे करावे\n• मतदार नोंदणी\n• नोटा"
  }
};

// Smart keyword matcher (returns null if no confident match)
function findLocalAnswer(question, lang) {
  const db = knowledge[lang] || knowledge['en'];
  const q = question.toLowerCase().trim();

  // Check greetings
  if (db.greetings.some(g => q.includes(g))) {
    return db.greetingReply;
  }

  // Score each topic by keyword matches
  let bestScore = 0;
  let bestAnswer = null;

  for (const topic of db.topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = topic.answer;
    }
  }

  return bestAnswer; // null if nothing matched
}

// Wikipedia fallback search
async function searchWikipedia(query) {
  try {
    // Scope the search to Indian elections
    const scopedQuery = query + ' India election';
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(scopedQuery)}&limit=3&format=json`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const titles = searchData[1];
    if (!titles || titles.length === 0) return null;

    // Try each result until we find one that's relevant
    const relevanceKeywords = ['election', 'vote', 'voting', 'voter', 'india', 'parliament', 'lok sabha', 'democracy', 'political', 'constituency', 'ballot', 'commission', 'candidate', 'party', 'government', 'minister', 'legislature', 'assembly', 'rajya', 'sabha'];

    for (const title of titles) {
      const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const summaryRes = await fetch(summaryUrl);
      const summaryData = await summaryRes.json();

      if (summaryData.extract) {
        const lowerExtract = summaryData.extract.toLowerCase();
        const isRelevant = relevanceKeywords.some(kw => lowerExtract.includes(kw));

        if (!isRelevant) continue; // skip irrelevant articles

        let extract = summaryData.extract;
        if (extract.length > 600) {
          extract = extract.substring(0, 597) + '...';
        }
        return `🌐 From Wikipedia:\n\n${extract}\n\n📖 Source: ${summaryData.content_urls?.desktop?.page || 'wikipedia.org'}`;
      }
    }
    return null; // nothing relevant found
  } catch (err) {
    console.error('Wikipedia search failed:', err.message);
    return null;
  }
}

app.post('/chat', async (req, res) => {
  const { message = '', lang = 'en' } = req.body;
  const db = knowledge[lang] || knowledge['en'];

  // Try local knowledge first
  const localAnswer = findLocalAnswer(message, lang);
  if (localAnswer) {
    return res.json({ answer: localAnswer });
  }

  // Fallback: search Wikipedia
  const wikiAnswer = await searchWikipedia(message);
  if (wikiAnswer) {
    return res.json({ answer: wikiAnswer });
  }

  // Nothing found anywhere
  res.json({ answer: db.fallback });
});

// Quiz data
const quizData = {
  en: [
    { q: "What is the minimum voting age in India?", options: ["16", "18", "21", "25"], correct: 1 },
    { q: "What does EVM stand for?", options: ["Electronic Voting Machine", "Election Verification Module", "Electoral Vote Manager", "Electronic Vote Monitor"], correct: 0 },
    { q: "Who conducts elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India", "President"], correct: 2 },
    { q: "When was NOTA introduced in Indian elections?", options: ["2009", "2011", "2013", "2015"], correct: 2 },
    { q: "What is VVPAT?", options: ["Voter Video Authentication Process", "Voter Verifiable Paper Audit Trail", "Virtual Vote Authentication Tool", "Verified Voting Paper Trail"], correct: 1 },
    { q: "How many Lok Sabha seats are there in India?", options: ["435", "500", "543", "600"], correct: 2 },
    { q: "Which article of the Indian Constitution deals with elections?", options: ["Article 324", "Article 356", "Article 370", "Article 21"], correct: 0 },
    { q: "What is the symbol of NOTA on the EVM?", options: ["A red cross", "A ballot box with a cross", "A thumbs down", "A blank square"], correct: 1 },
    { q: "Who appoints the Chief Election Commissioner?", options: ["Prime Minister", "Parliament", "President of India", "Supreme Court"], correct: 2 },
    { q: "Which was the first general election held in India?", options: ["1947", "1950", "1951-52", "1955"], correct: 2 }
  ],
  hi: [
    { q: "भारत में मतदान की न्यूनतम आयु कितनी है?", options: ["16", "18", "21", "25"], correct: 1 },
    { q: "EVM का पूरा नाम क्या है?", options: ["इलेक्ट्रॉनिक वोटिंग मशीन", "इलेक्शन वेरिफिकेशन मॉड्यूल", "इलेक्टोरल वोट मैनेजर", "इलेक्ट्रॉनिक वोट मॉनिटर"], correct: 0 },
    { q: "भारत में चुनाव कौन करवाता है?", options: ["सुप्रीम कोर्ट", "संसद", "भारत निर्वाचन आयोग", "राष्ट्रपति"], correct: 2 },
    { q: "NOTA कब शुरू हुआ?", options: ["2009", "2011", "2013", "2015"], correct: 2 },
    { q: "लोकसभा में कुल कितनी सीटें हैं?", options: ["435", "500", "543", "600"], correct: 2 }
  ],
  bn: [
    { q: "ভারতে ভোট দেওয়ার ন্যূনতম বয়স কত?", options: ["16", "18", "21", "25"], correct: 1 },
    { q: "EVM-এর পূর্ণ রূপ কী?", options: ["ইলেকট্রনিক ভোটিং মেশিন", "ইলেকশন ভেরিফিকেশন মডিউল", "ইলেক্টোরাল ভোট ম্যানেজার", "ইলেকট্রনিক ভোট মনিটর"], correct: 0 },
    { q: "ভারতে নির্বাচন কে পরিচালনা করে?", options: ["সুপ্রিম কোর্ট", "সংসদ", "ভারতের নির্বাচন কমিশন", "রাষ্ট্রপতি"], correct: 2 }
  ],
  mr: [
    { q: "भारतात मतदानाचे किमान वय किती?", options: ["16", "18", "21", "25"], correct: 1 },
    { q: "EVM चा पूर्ण अर्थ काय?", options: ["इलेक्ट्रॉनिक व्होटिंग मशीन", "इलेक्शन व्हेरिफिकेशन मॉड्यूल", "इलेक्टोरल व्होट मॅनेजर", "इलेक्ट्रॉनिक व्होट मॉनिटर"], correct: 0 },
    { q: "भारतात निवडणुका कोण घेतो?", options: ["सर्वोच्च न्यायालय", "संसद", "भारत निवडणूक आयोग", "राष्ट्रपती"], correct: 2 }
  ]
};

app.get('/quiz', (req, res) => {
  const lang = req.query.lang || 'en';
  const questions = quizData[lang] || quizData['en'];
  // Set explicit cache headers for efficiency score
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  
  // Shuffle and pick 5 questions
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
  res.json({ questions: shuffled });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = { app };
