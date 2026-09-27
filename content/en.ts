// English content for boards.json (PRD §12). Translated from the Thai, facts unchanged.
// Thai stays the source of truth; keep ids in sync with content/boards.json.

export type CellEn = {
  title: string;
  clue: string;
  hints: [string, string, string];
  guess?: { question: string; choices: [string, string, string] };
  story: string;
};

export type AreaEn = { getting_there: string; tagline: string };

export const AREAS_EN: Record<string, AreaEn> = {
  "talat-noi": {
    getting_there: "Boat · Si Phraya or Marine Dept pier · MRT Hua Lamphong",
    tagline: "Riverside Chinese quarter of scrap-metal shops and street art",
  },
  yaowarat: {
    getting_there: "MRT Wat Mangkon · Boat · Ratchawong pier",
    tagline: "Gold shops, neon signs and Bangkok's best street food",
  },
  "tha-tien": {
    getting_there: "Boat · Tha Tien pier · MRT Sanam Chai",
    tagline: "The Reclining Buddha, stone giants and a 24-hour flower market",
  },
  "kudi-chin": {
    getting_there: "Walk over Memorial Bridge, follow the river · MRT Itsaraphap",
    tagline: "A Portuguese-Catholic village with Chinese and Muslim neighbors",
  },
  banglamphu: {
    getting_there: "Boat · Phra Arthit pier",
    tagline: "Old forts, canals and the street backpackers made famous",
  },
  "charoen-krung": {
    getting_there: "Boat · Oriental pier · BTS Saphan Taksin",
    tagline: "Bangkok's first paved road, consulates and a creative district",
  },
};

export const CELLS_EN: Record<string, CellEn> = {
  // ---------- Talat Noi ----------
  "tn-1": {
    title: "Car parts stacked to the ceiling",
    clue: "This quarter gave birth to a trade Bangkok still calls by a Chinese name. Find a shop with old car parts piled high.",
    hints: [
      "Listen for welding and metal being hammered.",
      "Look for old engines sitting on the pavement outside a shop.",
      "Walk deep into the lanes off Charoen Krung on the Talat Noi side.",
    ],
    guess: {
      question: "Where does “Siang Kong”, the name for used car-part shops, come from?",
      choices: ["A Chinese shrine in the area", "The first shop owner's name", "The Chinese word for engine"],
    },
    story: "Talat Noi is the birthplace of “Siang Kong”, the used car-parts trade. The name comes from a Chinese shrine nearby, and the quarter has been Bangkok's hub for repairing and selling second-hand car parts for over 70 years.",
  },
  "tn-2": {
    title: "The Chinese house with a dive pool",
    clue: "This house is about 200 years old and hides something you'd never expect inside an old Chinese home.",
    hints: [
      "It's a wooden Hokkien house built around a central courtyard.",
      "It's in a small lane near the Chao Sue Kong shrine.",
      "The house is called “So Heng Tai” (small entry fee).",
    ],
    guess: {
      question: "What is this old house used for today?",
      choices: ["A state museum", "A dive school and café", "A luxury hotel"],
    },
    story: "So Heng Tai is a Hokkien courtyard house about 200 years old, built in the early Rattanakosin period. Its teak rooms form a square under traditional Chinese roofs. Today it is both a scuba-diving school and a café.",
  },
  "tn-3": {
    title: "A lane sign that names an old trade",
    clue: "One alley's name tells you what people here used to do for a living. Find that sign.",
    hints: [
      "The alley is full of wall paintings.",
      "At its end is a riverside Chinese shrine.",
      "The name starts with “Trok San Chao…”.",
    ],
    guess: {
      question: "What was once made at “Rong Kueak” in Trok San Chao Rong Kueak?",
      choices: ["Shoes", "Horseshoes", "It was a horse stable"],
    },
    story: "The riverside Hakka shrine at the end of this alley is known as San Chao Rong Kueak, because the area was once where horseshoes were made.",
  },
  "tn-4": {
    title: "Any Chinese shrine",
    clue: "This small quarter has many Chinese shrines, built by different Chinese communities. Find any one of them.",
    hints: [
      "Look for red roofs decorated with dragons.",
      "Many of the shrines are by the river.",
      "If you smell incense, you're close.",
    ],
    story: "After King Rama I moved the capital to the east bank in 1782, Chinese families from Kudi Chin and Khlong Bang Luang resettled in Talat Noi. The first were likely Hokkien, who built Chao Sue Kong, the oldest shrine in the quarter, recorded as founded in 1804.",
  },
  "tn-5": {
    title: "Siam's first Thai bank",
    clue: "This Western-style riverside building is over a hundred years old, yet it still opens every working day.",
    hints: [
      "It's right on the Chao Phraya river and easy to see from a boat.",
      "It's almost next door to the Holy Rosary Church.",
      "Look for a purple bank sign.",
    ],
    guess: {
      question: "Why did Thailand's first bank open in Talat Noi?",
      choices: ["It was a port full of Chinese money changers", "It was near the Grand Palace", "The land was the cheapest"],
    },
    story: "The Siam Commercial Bank Talat Noi branch was the bank's first permanent office and is the oldest bank branch still operating in Thailand. It was designed by Italian architect Annibale Rigotti. Before banks, Chinese merchants changed money along Wanit Road, and this was the first pier where Chinese immigrants came ashore.",
  },
  "tn-6": {
    title: "Chinese characters on a shophouse",
    clue: "Many old shophouses still carry Chinese signs or characters that tell you who once lived there.",
    hints: [
      "Look up at the upper floors of the shophouses.",
      "Look for wooden or red signs above the doors.",
      "Check door frames with red good-luck paper.",
    ],
    guess: {
      question: "Which Chinese groups were among the first to settle in Talat Noi?",
      choices: ["Hokkien and Hakka", "Teochew", "Hainanese"],
    },
    story: "Historians suggest the Chinese came to Talat Noi in waves: first Hokkien and Hakka, then Hainanese after Siam opened to foreign trade. Most Teochew lived around the Holy Rosary Church and were Christian.",
  },
  "tn-7": {
    title: "A Western church in the Chinese quarter",
    clue: "This old Chinese quarter hides a spired church by the river that still holds Mass in Chinese.",
    hints: [
      "Look for a Gothic spire above the shophouse roofs.",
      "It's by the river, near the Siam Commercial Bank Talat Noi branch.",
      "Locals call it “Wat Kalawar”.",
    ],
    guess: {
      question: "Which language does the name “Kalawar” come from?",
      choices: ["Portuguese", "French", "Latin"],
    },
    story: "After Ayutthaya fell in 1767, a group of Portuguese moved across the river to today's Talat Noi and founded the Holy Rosary Church in 1787. “Kalawar” comes from the Portuguese word for Calvary. Mass is still held in Chinese.",
  },
  "tn-8": {
    title: "A mural in a narrow lane",
    clue: "Old walls in a small lane have become an open-air gallery. Find the one you like most and take a photo.",
    hints: [
      "Start in front of the café in Trok San Chao Rong Kueak.",
      "The paintings run along about 100 m of wall.",
      "Some are on warehouse walls and abandoned houses.",
    ],
    story: "The concrete walls along this roughly 100-metre lane became the canvas of Talat Noi street art. Artists use abandoned houses, repair shops and the riverside path to tell the community's story.",
  },
  "tn-9": {
    title: "Mission: taste a Thai-Chinese snack",
    clue: "Try a snack with Chinese roots and Thai flavors, like fried radish cake (khanom phakkad) or steamed rice cups with pickled radish.",
    hints: [
      "Look for a street cart or a tiny shop in a lane.",
      "Ask a local which stall has been selling the longest.",
      "Snap the snack before you eat it.",
    ],
    story: "This quarter's food mixes Chinese and Thai influences, like radish cake and Chinese-style steamed rice cups, a reflection of a riverside Chinese community more than 200 years old.",
  },

  // ---------- Yaowarat–Sampheng ----------
  "yw-1": {
    title: "A red-and-gold gold shop",
    clue: "This street is lined with red shops selling gold. Some have been open since the reign of King Rama V.",
    hints: [
      "Walk along the main Yaowarat Road.",
      "Look for gold display cases and Chinese signs.",
      "The shops stand side by side in long rows.",
    ],
    story: "Yaowarat is famous for its gold shops, among them Tang To Kang, the oldest gold shop in Thailand, founded in the reign of King Rama V.",
  },
  "yw-2": {
    title: "The temple inside a shophouse",
    clue: "There is only one temple on Yaowarat Road, and it hides inside a five-storey shophouse.",
    hints: [
      "It's right on Yaowarat Road, not in a side lane.",
      "It looks like an ordinary shophouse, but has a temple name sign.",
      "It's called “Wat Bamphen Chin Phrot”.",
    ],
    guess: {
      question: "Who granted the name plaque that hangs above the entrance?",
      choices: ["King Rama I", "King Rama V", "The Emperor of China"],
    },
    story: "Wat Bamphen Chin Phrot is a Chinese temple older than Wat Mangkon Kamalawat. It is the only temple on Yaowarat Road and is considered the smallest in the country, being a five-storey shophouse. It began as a shrine to Guanyin in 1795 and later received a royal name from King Rama V, whose plaque still hangs today.",
  },
  "yw-3": {
    title: "A Chinese medicine shop",
    clue: "Find a shop with walls of tiny wooden drawers and a smell of herbs drifting out.",
    hints: [
      "Use your nose: the herbal smell is strong.",
      "Look for glass jars of roots and dried herbs.",
      "They're often in lanes off Yaowarat Road.",
    ],
    story: "Beyond gold and food, Chinatown's lanes hold traditional Chinese herbal medicine shops and herb markets, part of Chinese life in Bangkok for over 200 years.",
  },
  "yw-4": {
    title: "The Sampheng street sign",
    clue: "Before Yaowarat Road existed, a narrow lane was the main street here. Find its official name sign.",
    hints: [
      "It's a very narrow lane packed with wholesale shops.",
      "People call it “Sampheng”.",
      "The official name on the sign is “Wanit 1”.",
    ],
    guess: {
      question: "In which reign was Yaowarat Road built?",
      choices: ["King Rama III", "King Rama V", "King Rama VII"],
    },
    story: "Sampheng Lane, officially Wanit 1 Road today, was the quarter's main street until King Rama V had Yaowarat Road built in 1892.",
  },
  "yw-5": {
    title: "The Buddha hidden in plaster",
    clue: "This Buddha was once covered in plaster so it looked ordinary, until one day an accident happened.",
    hints: [
      "It's at the end of Yaowarat Road by the Odeon Circle.",
      "Look for a white marble building with a golden top.",
      "The temple is “Wat Traimit Withayaram”.",
    ],
    guess: {
      question: "What is this Buddha made of?",
      choices: ["Solid gold", "Gilded bronze", "Gold-painted plaster"],
    },
    story: "This 5.5-tonne gold Buddha was covered in plaster for a long time. It came to Wat Traimit in 1935, and in 1955, while being moved to a new hall, it fell and the plaster cracked, revealing gold inside. The building's second floor also houses the Yaowarat Heritage Center.",
  },
  "yw-6": {
    title: "Dragons on a temple roof",
    clue: "Find the roof of a Chinese temple or shrine with a dragon crawling along the top.",
    hints: [
      "Look up at Chinese-style tiled roofs.",
      "Bangkok's biggest Chinese temple is near MRT Wat Mangkon.",
      "Check doors and walls too: dragons are everywhere.",
    ],
    guess: {
      question: "What does “Mangkon Kamalawat”, the name given by King Rama V, mean?",
      choices: ["Golden Dragon Temple", "Dragon Lotus Temple", "Flying Dragon Temple"],
    },
    story: "Wat Mangkon Kamalawat, or Wat Leng Noei Yi, is the largest and most important Chinese Mahayana Buddhist temple in Bangkok, founded around 1871 by the Chinese monk Wang Samathiwat. King Rama V later gave it a new name meaning “Dragon Lotus Temple”.",
  },
  "yw-7": {
    title: "The shrine said to be the oldest",
    clue: "This small shrine in an old market is believed to be the oldest Chinese shrine in Thailand.",
    hints: [
      "It's in the old market, Soi Yaowarat 6.",
      "Look for entrance pillars wrapped in tiled dragons.",
      "It's called “Leng Buai Ia”.",
    ],
    story: "Leng Buai Ia Shrine, in the old market on Soi Yaowarat 6, is believed to be the oldest Teochew Chinese shrine in Thailand, about 300 years old, though this has not been firmly proven. Its entrance pillars are wrapped in tiled dragons and inside hang many old plaques.",
  },
  "yw-8": {
    title: "Stacked Chinese neon signs",
    clue: "At night this street is lined on both sides with Chinese and Thai neon signs. Snap your favorite.",
    hints: [
      "Play this square in the evening; it looks best after dark.",
      "Stand on the pavement and look down Yaowarat Road.",
      "Pick a sign with both Chinese and Thai on it.",
    ],
    story: "Yaowarat Road is packed with overlapping Chinese and Thai signs. Bangkok has newer business districts like Sathorn, Silom and Sukhumvit, but Yaowarat has been the center of Chinese culture and food in Thailand since 1782.",
  },
  "yw-9": {
    title: "Mission: eat street food after dark",
    clue: "After 6 pm Yaowarat turns into one long food street. Eat something from a cart or a roadside stall.",
    hints: [
      "Stalls set up after sunset.",
      "The longest queues are usually the oldest stalls.",
      "Snap your food with the stall's sign.",
    ],
    story: "At night Yaowarat becomes one of Bangkok's longest food streets, with everything from noodles and braised pork leg to toasted buns.",
  },

  // ---------- Tha Tien–Pak Khlong Talat ----------
  "tt-1": {
    title: "Chinese stone guardians",
    clue: "The Chinese-looking stone statues in this temple travelled a long way, and weren't meant to be decorations at all.",
    hints: [
      "They're in Wat Pho (ticket required).",
      "Look at the gates and the courtyard around the ordination hall.",
      "They look like officials, warriors or Chinese lions.",
    ],
    guess: {
      question: "How did these Chinese stone figures get to Siam?",
      choices: ["As ballast on Chinese junks", "As gifts from the Emperor of China", "Carved in Thailand in Chinese style"],
    },
    story: "These Chinese stone figures came to Siam as ballast on Chinese junks, and were then set up to guard the gates of Wat Pho and other temples.",
  },
  "tt-2": {
    title: "The 46-metre Reclining Buddha",
    clue: "This Buddha fills its hall from wall to wall. It's almost impossible to fit it all in one photo.",
    hints: [
      "It's in Wat Pho, near Tha Tien.",
      "Look for the hall with the longest queue.",
      "Walk to the feet at the far end of the hall.",
    ],
    guess: {
      question: "About how long is the Reclining Buddha at Wat Pho?",
      choices: ["16 m", "46 m", "96 m"],
    },
    story: "The Reclining Buddha at Wat Pho is 46 m long and 15 m high, covered entirely in gold leaf. Wat Pho is one of Bangkok's oldest temples; its original name, Wat Photharam, was shortened to the “Wat Pho” people use today.",
  },
  "tt-3": {
    title: "Stone tablets of knowledge",
    clue: "Before Thailand had universities, this temple carved knowledge into stone for anyone to read.",
    hints: [
      "They're in Wat Pho.",
      "Look along the cloister walls and pavilions.",
      "Some show human figures with dots on the body.",
    ],
    guess: {
      question: "What did UNESCO recognise Wat Pho's inscriptions as?",
      choices: ["Natural World Heritage", "Memory of the World", "Intangible Cultural Heritage"],
    },
    story: "Wat Pho is considered Thailand's first public place of learning. Its inscriptions and pictures on medicine, massage and literature were added to UNESCO's Memory of the World Register on 21 February 2008.",
  },
  "tt-4": {
    title: "The stretching hermits",
    clue: "Find statues of hermits stretching in strange poses. Copy a pose and take a photo together.",
    hints: [
      "They're in Wat Pho.",
      "Look around the rock gardens.",
      "The statues are life-size, each in a different pose.",
    ],
    story: "Wat Pho has statues of hermits in stretching poses and is still the national center for teaching Thai traditional medicine and massage, building on knowledge carved into the temple in the reign of King Rama III.",
  },
  "tt-5": {
    title: "The ministry that became a museum",
    clue: "This century-old yellow Western building was once a government ministry. Now it's a museum about what “being Thai” means.",
    hints: [
      "It's near MRT Sanam Chai.",
      "A short walk south of Wat Pho.",
      "It's called “Museum Siam”.",
    ],
    guess: {
      question: "Which ministry used to work in this building?",
      choices: ["Ministry of Defence", "Ministry of Commerce", "Ministry of Education"],
    },
    story: "Museum Siam opened in 2007 in the former Ministry of Commerce building, completed in 1922 under King Rama VI and designed by Italian architect Mario Tamagno.",
  },
  "tt-6": {
    title: "A chedi covered in colored tiles",
    clue: "Find a chedi covered in broken tiles and bright porcelain arranged into patterns.",
    hints: [
      "It's in Wat Pho.",
      "Chedis of many sizes are spread across the temple.",
      "Up close, the flowers are made from pieces of plates.",
    ],
    guess: {
      question: "About how many chedis does Wat Pho have?",
      choices: ["9", "31", "91"],
    },
    story: "Wat Pho has 91 chedis of different sizes, decorated with brightly colored porcelain, one of the temple's most striking sights.",
  },
  "tt-7": {
    title: "The flower market that never sleeps",
    clue: "This market is open 24 hours. Before it was full of flowers, it sold something else.",
    hints: [
      "It's near Memorial Bridge by the Chao Phraya.",
      "Follow the smell of jasmine and roses.",
      "It's called “Pak Khlong Talat”.",
    ],
    guess: {
      question: "Where does the name “Pak Khlong Talat” come from?",
      choices: ["The market at the canal's mouth", "The market of the canal people", "The chatty market"],
    },
    story: "Pak Khlong Talat sits on the Chao Phraya near the end of the old city moat, hence “the market at the canal's mouth”. It began as a floating market, became a fish market, then a vegetable and flower market. Today it's Bangkok's largest flower market, open 24 hours.",
  },
  "tt-8": {
    title: "The Tha Tien pier sign",
    clue: "Legends explain this pier's name, but nobody really knows where it came from. Find the pier sign.",
    hints: [
      "Walk to the riverside behind Wat Pho.",
      "Look for the Chao Phraya Express Boat pier sign.",
      "From here you can see Wat Arun across the river.",
    ],
    guess: {
      question: "What is the famous legend behind the name “Tha Tien” (flattened pier)?",
      choices: ["The giants of Wat Pho and Wat Arun fought", "Elephants trampled the ground flat", "A merchant called Tien"],
    },
    story: "No one knows for sure where the name Tha Tien comes from. Some say a great fire under King Rama IV left the area flattened, though there's no firm evidence. The best-known legend says the giant of Wat Pho borrowed money from the giant of Wat Arun and never paid it back, and their fight flattened the area.",
  },
  "tt-9": {
    title: "Mission: buy or snap a flower garland",
    clue: "Pak Khlong Talat is full of hand-threaded garlands. Buy one, or ask a vendor if you can photograph them threading.",
    hints: [
      "It's busiest before dawn.",
      "Look for stalls with mountains of jasmine.",
      "Always ask before photographing people.",
    ],
    story: "Garlands (phuang malai) are part of daily Thai life, offered to the Buddha, at shrines and in ceremonies. Pak Khlong Talat is busiest just before sunrise, when vendors come to buy flowers to sell.",
  },

  // ---------- Kudi Chin ----------
  "kc-1": {
    title: "The Kudi Chin community sign",
    clue: "This is a Portuguese-Catholic community, yet its name includes the word “Chinese”. Find the community sign.",
    hints: [
      "Walk the riverside path on the Thonburi side.",
      "It's between Wat Kalayanamit and Santa Cruz Church.",
      "Look for a community or lane sign.",
    ],
    guess: {
      question: "What does “Kudi Chin” mean?",
      choices: ["Chinese monks' lodgings", "Chinese merchants' houses", "The Chinese pier"],
    },
    story: "“Kudi Chin” (or “Kadi Chin”) means lodgings of Chinese monks. Catholics, Buddhists and Muslims live close together here. In 2014 about 1,850 Thais of Portuguese descent lived around Santa Cruz Church.",
  },
  "kc-2": {
    title: "A 200-year-old riverside shrine",
    clue: "This Chinese shrine was built by people fleeing war in Ayutthaya, and it still stands by the river.",
    hints: [
      "It's by the river, next to Wat Kalayanamit.",
      "Bright roof, finely carved details.",
      "It's called “Kian Un Keng Shrine”.",
    ],
    guess: {
      question: "Which deity is mainly worshipped here?",
      choices: ["Guanyin", "Guan Yu", "The god of fortune"],
    },
    story: "Kian Un Keng Shrine was built by Hokkien Chinese who followed King Taksin from Ayutthaya in the late 1700s. It's one of the oldest shrines on the Thonburi side and is dedicated to Guanyin.",
  },
  "kc-3": {
    title: "A symbol of Islam",
    clue: "This one community has a church, a shrine and a mosque. Find an Islamic symbol or building.",
    hints: [
      "Look for a dome or a crescent and star.",
      "It's in the same neighborhood as Wat Kalayanamit.",
      "A few minutes' walk from the shrine.",
    ],
    story: "Under King Taksin this area welcomed people of many origins and faiths, so Buddhists, Christians and Muslims live within walking distance of each other. The neighborhood includes the Kudi Khao (Bang Luang) Mosque.",
  },
  "kc-4": {
    title: "A Wat Arun view from the river path",
    clue: "Follow the river on this side until you see the spire of Wat Arun. A king's palace once stood near here.",
    hints: [
      "Use the Thonburi riverside walkway.",
      "Look north, upstream.",
      "Take the photo where the spire is clearest.",
    ],
    guess: {
      question: "Whose palace did the Portuguese from Ayutthaya settle near?",
      choices: ["King Taksin", "King Rama I", "King Narai"],
    },
    story: "After Ayutthaya fell, the Portuguese who moved here settled near King Taksin's palace, next to Wat Arun, which was then the palace temple.",
  },
  "kc-5": {
    title: "The church named after a land-grant day",
    clue: "This cream church with a red dome was named after a special day more than 250 years ago.",
    hints: [
      "It's by the river, at the entrance to Kudi Chin.",
      "Look for an octagonal dome above the trees.",
      "It's called “Santa Cruz Church”.",
    ],
    guess: {
      question: "Why is the church called “Santa Cruz” (Holy Cross)?",
      choices: ["The land was granted on the Feast of the Holy Cross", "It holds an old cross from Portugal", "It's named after its founding priest"],
    },
    story: "King Taksin granted land to the Portuguese on 14 September 1769, the Feast of the Exaltation of the Holy Cross, so the church was named Santa Cruz. Today's building is the third, completed in 1916 and designed by Italian architects Annibale Rigotti and Mario Tamagno.",
  },
  "kc-6": {
    title: "A Christian symbol on a house",
    clue: "Many homes in this community's narrow lanes display a symbol of faith. Find one.",
    hints: [
      "Walk the narrow lanes around Santa Cruz Church.",
      "Look above doors or beside windows.",
      "It could be a cross or an image of the Virgin Mary.",
    ],
    story: "The community around Santa Cruz Church is Catholic, mostly descendants of the Portuguese, the first Westerners to reach Siam in the early 1500s.",
  },
  "kc-7": {
    title: "The giant seated Buddha",
    clue: "This riverside temple has a huge seated Buddha that both Thai and Chinese people worship, each by a different name.",
    hints: [
      "It's next to Kian Un Keng Shrine.",
      "It's the biggest riverside temple around here.",
      "The temple is “Wat Kalayanamit”.",
    ],
    guess: {
      question: "What do Chinese worshippers call this great Buddha?",
      choices: ["Sam Po Kong", "Chao Sue Kong", "Leng Buai Ia"],
    },
    story: "Wat Kalayanamit Woramahawihan stands out on the river. It houses Luang Pho To, a huge seated Buddha that Hokkien Chinese call “Sam Po Kong”, revered by Thai and Chinese alike.",
  },
  "kc-8": {
    title: "Mission: taste Kudi Chin cake",
    clue: "This community has cakes influenced by the Portuguese. Find a shop and try one.",
    hints: [
      "It's in the lanes near Kian Un Keng Shrine and the church.",
      "Look for a shophouse with baked cakes out front.",
      "Ask locals which shop is the oldest.",
    ],
    story: "Khanom farang Kudi Chin is a baked cake handed down from the community's Portuguese ancestors. Several Portuguese-influenced bakeries still sell it in the lanes around the church.",
  },
  "kc-9": {
    title: "Mission: talk to a local",
    clue: "Ask someone in the community how many generations their family has lived here.",
    hints: [
      "A bakery or shop in the lanes is a good place to start.",
      "Smile, say hi, and explain you're playing a neighborhood game.",
      "If they'd rather not chat, that's fine: try someone else.",
    ],
    story: "Some Portuguese fought alongside King Taksin to drive out the Burmese after Ayutthaya fell, so he granted them land. Their descendants still live here today.",
  },

  // ---------- Banglamphu–Phra Athit ----------
  "bl-1": {
    title: "The Khao San Road sign",
    clue: "This street is known to backpackers worldwide, and its name tells you what used to be traded here.",
    hints: [
      "Walk about 15 minutes east from Santichaiprakan Park.",
      "Look for the blue street sign at the end of the road.",
      "It's liveliest at night.",
    ],
    guess: {
      question: "What does “Khao San” in the street name reflect?",
      choices: ["It was a rice-trading street", "It had a royal rice mill", "A famous dish"],
    },
    story: "“Khao san” means milled rice. The name comes from the street's past role in the rice trade.",
  },
  "bl-2": {
    title: "The surviving octagonal fort",
    clue: "This white fort once had 13 siblings around the city. Only 2 are left.",
    hints: [
      "It's by the river, near Phra Arthit pier.",
      "It stands in a small riverside park.",
      "It's called “Phra Sumen Fort”.",
    ],
    guess: {
      question: "What is Phra Sumen Fort named after?",
      choices: ["Mount Meru, sacred in Buddhist-Hindu belief", "The noble who built it", "A warship"],
    },
    story: "Phra Sumen Fort was built in 1783 under King Rama I to guard against attack by water. The octagonal fort was one of 14 along the old city wall; only Phra Sumen and Mahakan forts remain.",
  },
  "bl-3": {
    title: "The Khlong Rop Krung sign",
    clue: "This canal was once Bangkok's city moat. Find its name sign.",
    hints: [
      "It flows into the Chao Phraya near Phra Sumen Fort.",
      "Look for a sign on a bridge over the canal.",
      "Most signs still say “Khlong Rop Krung”.",
    ],
    guess: {
      question: "How many forts originally stood along this canal line?",
      choices: ["4", "14", "40"],
    },
    story: "Phra Sumen Fort sits where Khlong Bang Lamphu meets the Chao Phraya. The canal was once the city moat and the boundary of Rattanakosin Island; most signs still call it Khlong Rop Krung.",
  },
  "bl-4": {
    title: "A sign that says “Bang Lamphu”",
    clue: "This area is named after a tree that once lined the water. Find any sign with the words “Bang Lamphu”.",
    hints: [
      "A shop, market or museum sign all count.",
      "Try along Phra Sumen Road.",
      "Lots of markets and clothes shops use the name.",
    ],
    guess: {
      question: "What happened to the last lamphu tree in Santichaiprakan Park?",
      choices: ["It died in 2012 after the 2011 floods", "It was cut down for a road", "It was moved to a museum"],
    },
    story: "“Bang Lamphu” means the place of lamphu trees. The last lamphu tree in Santichaiprakan Park died in 2012 after the great 2011 floods, but the name still lives on.",
  },
  "bl-5": {
    title: "The old press that tells local stories",
    clue: "This old building at the head of the road used to print books. Now it tells the story of Banglamphu life.",
    hints: [
      "It's at the start of Phra Sumen Road, on the fort side.",
      "An old building with a restored façade.",
      "It's called “Pipit Banglamphu”.",
    ],
    guess: {
      question: "What was this building before?",
      choices: ["The Kurusapha printing house", "A post office", "A primary school"],
    },
    story: "At the head of Phra Sumen Road by the fort stands the old Kurusapha printing house, once the Wat Sangwet school press. Its façade has been restored and it is now Pipit Banglamphu, a museum of the neighborhood's history and way of life.",
  },
  "bl-6": {
    title: "A clothes shop in Banglamphu market",
    clue: "Before it was a tourist area, Thais knew Banglamphu for selling one thing. Find that kind of shop.",
    hints: [
      "Walk around Phra Sumen Road and Banglamphu market.",
      "Look for shops with fabric hanging all over the front.",
      "Some old shops sell school uniforms or rolls of cloth.",
    ],
    story: "Banglamphu is an old trading area long known to Thais as a center of the clothing trade. The shophouses on Phra Sumen Road now mix old shops, restaurants, cafés, galleries and bookshops.",
  },
  "bl-7": {
    title: "The temple at the end of Phra Sumen Road",
    clue: "This important temple is the center of one of Thailand's Buddhist orders, and it sits at the end of the road that starts at the fort.",
    hints: [
      "Follow Phra Sumen Road to the very end.",
      "Look for a long temple wall.",
      "The temple is “Wat Bowonniwet Vihara”.",
    ],
    story: "Wat Bowonniwet Vihara, or Wat Bowon, was founded in 1826 and is the center of the Dhammayuttika Nikaya, a reform order founded in Thailand.",
  },
  "bl-8": {
    title: "The riverside walkway",
    clue: "The little riverside park by the fort used to be a factory. Find the walkway along the river and photograph the view.",
    hints: [
      "Start from Santichaiprakan Park.",
      "The path runs south along the river.",
      "In the evening people do aerobics here.",
    ],
    guess: {
      question: "What was this site before it became a park?",
      choices: ["A sugar factory", "A sawmill", "A shipyard"],
    },
    story: "Santichaiprakan Park was once the site of a sugar factory. Its name, “Fort of Victory for Peace”, was given by the King in 1999, when the fort and its grounds became a public park.",
  },
  "bl-9": {
    title: "Mission: watch the sunset by the river",
    clue: "In the evening locals and travelers hang out in the riverside park. Watch the sunset or join one aerobics song.",
    hints: [
      "Come after 5 pm.",
      "Find a seat by the river in front of the fort.",
      "Snap the river as the sky changes color.",
    ],
    story: "In the evening, locals and travelers staying around Khao San Road love spending time in Santichaiprakan Park, with its lovely view of the Chao Phraya.",
  },

  // ---------- Charoen Krung–Bang Rak ----------
  "ck-1": {
    title: "The Charoen Krung Road sign",
    clue: "This was Thailand's first modern road. In English it's still called “New Road”, though it's over 160 years old.",
    hints: [
      "Look for a road sign at the start of a lane.",
      "Some signs say New Road.",
      "Lane signs here start with “Soi Charoen Krung”.",
    ],
    guess: {
      question: "Who asked for Charoen Krung Road to be built?",
      choices: ["Western consuls who wanted to ride and take carriages", "Chinese merchants moving goods", "Soldiers wanting faster marches"],
    },
    story: "In 1861 Western consuls complained they were falling ill with no roads for riding or carriages, and asked for one to be built. Construction began in 1862 and the road opened on 16 March 1864. In 1888 Bangkok's first tram line ran on it, horse-drawn at first, then electric from 1894.",
  },
  "ck-2": {
    title: "Siam's riverside gateway",
    clue: "Every merchant once had to stop at this old riverside building to pay duty before entering or leaving Siam.",
    hints: [
      "It's by the river in Bang Rak.",
      "A Palladian-style building completed in 1890.",
      "It's the “Old Customs House”.",
    ],
    guess: {
      question: "Where did Siam's first bank (1888) open?",
      choices: ["In the old Customs House", "In the Grand Palace", "In Talat Noi"],
    },
    story: "The Customs House was completed in 1890 in Palladian style. It collected duty from merchants trading in and out of Siam and became a symbol of free trade in the 19th century. The Hongkong and Shanghai Bank, the first bank in Siam, first opened in the old customs building in 1888.",
  },
  "ck-3": {
    title: "The Captain Bush Lane sign",
    clue: "One lane here still goes by a Westerner's nickname. Find that sign.",
    hints: [
      "Its official name is Soi Charoen Krung 30.",
      "It's near the start of Si Phraya Road.",
      "Look for the old buildings left in the lane.",
    ],
    story: "Captain Bush Lane, or Soi Charoen Krung 30, lies in an area that once held many foreign consulates, which Charoen Krung Road was built to serve. Historic buildings remain, such as No. 1, the former office of a French liquor company.",
  },
  "ck-4": {
    title: "A mosque in the old foreign quarter",
    clue: "Bang Rak has temples, churches, shrines and mosques. Find a mosque.",
    hints: [
      "Look for a dome or a minaret.",
      "Some are tucked into small lanes by the river.",
      "Ask a local where the Haroon Mosque is.",
    ],
    story: "Bang Rak has a long-standing Muslim community. The Haroon Mosque was first built of wood by the son of Haroon Bafadel, an Arab-Indonesian merchant who settled in Bang Rak in the reign of King Rama I.",
  },
  "ck-5": {
    title: "The red-brick church two Popes visited",
    clue: "This red-brick church survived a war and has welcomed two Popes.",
    hints: [
      "It's in Soi Charoen Krung 40.",
      "It's across from the Mandarin Oriental hotel.",
      "It's “Assumption Cathedral”.",
    ],
    guess: {
      question: "What happened to the church's original stained glass?",
      choices: ["Destroyed in World War II", "Moved to a museum in France", "Still all in place"],
    },
    story: "The new Assumption Cathedral was begun in 1909, took nine years and was consecrated on 15 August 1919. It was badly damaged in World War II and all its original stained glass was destroyed. It welcomed Pope John Paul II in 1984 and Pope Francis in 2019.",
  },
  "ck-6": {
    title: "Street art in a lane",
    clue: "Bangkok's first creative district hides murals in its lanes. Find one and take a photo.",
    hints: [
      "Try walking into Soi Charoen Krung 32.",
      "Look at old building and warehouse walls.",
      "Some are painted high above eye level.",
    ],
    story: "Charoen Krung is called Bangkok's first “creative district”, with street art in many spots, especially Soi Charoen Krung 32, mixed with old buildings like the Customs House.",
  },
  "ck-7": {
    title: "The house frozen in 1937",
    clue: "This wooden house keeps its living room, bedroom and belongings as if a Bangkok family just left for work.",
    hints: [
      "It's in Soi Charoen Krung 43.",
      "House number 273.",
      "It's “The Bangkokian Museum”.",
    ],
    guess: {
      question: "Which era of Bangkok life does this museum show?",
      choices: ["King Rama I's reign", "World War II and after (1937–1957)", "The 1980s"],
    },
    story: "The Bangkokian Museum, 273 Soi Charoen Krung 43, shows the life of a well-off Bangkok family during and after World War II (1937–1957). The main house was built in 1937 and still has its original wooden louvres and polished floors.",
  },
  "ck-8": {
    title: "An antique shop on the road",
    clue: "Near the Oriental hotel the road is lined with antique and jewelry shops. Find one with antiques in the window.",
    hints: [
      "Walk Charoen Krung near Soi Oriental.",
      "Look for windows with antiques, clocks or blue-and-white porcelain.",
      "Take your photo from outside without disturbing anyone.",
    ],
    story: "Charoen Krung near the Mandarin Oriental has many antique and jewelry shops. This was the city's largest main road until the early 20th century.",
  },
  "ck-9": {
    title: "Mission: take a boat from Oriental pier",
    clue: "Take a boat from the pier where a world-famous writer came ashore more than 130 years ago.",
    hints: [
      "The pier is at the end of Soi Oriental.",
      "Take the Chao Phraya Express Boat to any pier.",
      "Snap the pier sign before you board.",
    ],
    guess: {
      question: "Which writer came ashore at Oriental pier in 1888?",
      choices: ["Joseph Conrad", "Mark Twain", "Charles Dickens"],
    },
    story: "In 1888 the writer Joseph Conrad moored at Oriental pier and stayed at the old Oriental Hotel, and probably strolled along this stretch of Charoen Krung.",
  },
};
