let step = 1;
let diagnoses = [];

// --------------
// Validation rules (define before usage)
// --------------
function isValidCombo(combo) {
  const {
    sagittal,
    coronal,
    transverse,
    bodypart,
    action,
    description1,
    description2,
    specaction,
    specmethod,
    method_of_ailment_onset
  } = combo;

  // Rule 1
  if ((sagittal?.startsWith("anterior") || sagittal?.startsWith("posterior")) &&
      ["buttocks", "groin", "calf", "shin", "chest", "back", "wrist", "face", "upper abdomen", "lower abdomen"].includes(bodypart)) {
    return false;
  }

  // Rule 2
  if ((sagittal?.startsWith("lateral side of their") || sagittal?.startsWith("medial side of their")) &&
      ["hip", "groin", "buttocks", "upper abdomen", "lower abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 3
  if ((coronal === "upper" || coronal === "lower") &&
      (sagittal?.startsWith("top of their") || sagittal?.startsWith("bottom of their"))) {
    return false;
  }

  // Rule 4
  if ((transverse === "left" || transverse === "right") &&
      ["head", "neck", "face"].includes(bodypart)) {
    return false;
  }

  // Rule 5
  if ((action === "dorsiflexing" || action === "plantarflexing") &&
      !["foot", "ankle"].includes(bodypart)) {
    return false;
  }

  // Rule 6
  if ((action === "externally rotating" || action === "internally rotating") &&
      ["shin", "calf", "upper abdomen", "lower abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 7
  if (action === "twisting" &&
      !["upper abdomen", "lower abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 8
  if (description1 && description2 && description1 === description2) {
    return false;
  }

    // Rule 9 - Correction for hand/palm
  if (combo.bodypart === "hand" && combo.sagittal === "front of their") {
    combo.sagittal = "palm of their";
  }

  if (["forearm", "arm", "elbow", "wrist"].includes(combo.bodypart)) {
    if (combo.sagittal === "anterior") combo.sagittal = "ventral";
    if (combo.sagittal === "posterior") combo.sagittal = "dorsal";
  }

  // Rule 10 - Coronal shouldn't describe these bodyparts
  if ((coronal === "upper" || coronal === "lower") &&
      ["foot", "ankle", "knee", "shoulder", "elbow", "hand", "wrist", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 11 - Contradictory pain descriptions
  const sharpGroup = ["sharp", "shooting", "stabbing"];
  const dullGroup = ["dull", "throbbing", "aching"];

  if (sharpGroup.includes(description1) && dullGroup.includes(description2)) {
    return false;
  }

  if (dullGroup.includes(description1) && sharpGroup.includes(description2)) {
    return false;
  }

  // Rule 12
  const specactionRules = {
    ankle: ["walk up stairs", "walk down stairs", "run", "point my toes down", "squat", "lunge", "jump", "bend my knees", "stand up from a seated position"],
    shin: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "bend my knees", "stand up from a seated position", "try to touch my toes"],
    calf: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "bend my knees", "stand up from a seated position", "try to touch my toes"],
    knee: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "bend my knees", "bend my knees inwards", "stand up from a seated position", "bend down to pick something up", "try to touch my toes"],
    thigh: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "bend my knees", "stand up from a seated position", "bend down to pick something up", "try to touch my toes"],
    hip: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "stand up from a seated position", "bend down to pick something up", "try to touch my toes"],
    buttocks: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "stand up from a seated position", "bend down to pick something up", "try to touch my toes"],
    groin: ["walk up stairs", "walk down stairs", "run", "squat", "lunge", "jump", "stand up from a seated position", "bend down to pick something up", "try to touch my toes"],
    upper_abdomen: ["stand up from a seated position", "bend down to pick something up", "try to touch my toes", "pull open a heavy door", "lift something above my head", "carry my groceries into the house", "do a sit-up"],
    lower_abdomen: ["stand up from a seated position", "bend down to pick something up", "try to touch my toes", "pull open a heavy door", "lift something above my head", "carry my groceries into the house", "do a sit-up"],
    back: ["stand up from a seated position", "bend down to pick something up", "try to touch my toes", "pull open a heavy door", "lift something above my head", "carry my groceries into the house", "do a sit-up", "do a pull-up", "squat"],
    chest: ["pull open a heavy door", "lift something above my head", "carry my groceries into the house", "do a push-up", "do a pull-up"],
    shoulder: ["pull open a heavy door", "do a push-up", "lift something above my head", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up"],
    arm: ["pull open a heavy door", "do a push-up", "lift something above my head", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up"],
    elbow: ["pull open a heavy door", "do a push-up", "lift something above my head", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up"],
    forearm: ["pull open a heavy door", "do a push-up", "lift something above my head", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up"],
    hand: ["pull open a heavy door", "do a push-up", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up", "play piano"],
    wrist: ["pull open a heavy door", "do a push-up", "do a lateral shoulder raise in the gym", "do a bicep curl exercise", "do a tricep extension exercise", "carry my groceries into the house", "do a pull-up", "play piano"],
    neck: ["carry my groceries into the house", "do a pull-up", "turn my head horizontally", "look up to the sky", "look down at my feet", "chew", "open my jaw wide"],
    head: ["turn my head horizontally", "look up to the sky", "look down at my feet", "chew", "open my jaw wide"],
    face: ["scrunch my nose", "raise my eyebrows", "puff my cheeks", "chew", "open my jaw wide"]
  };

  const allowedActions = specactionRules[bodypart];
  if (allowedActions && !allowedActions.includes(specaction)) {
    return false;
  }

  // Rule 13 (specmethod restrictions)
  const forbiddenMethods = {
    "foot,ankle,shin,calf,knee,thigh": [
      "a car hit my car from behind",
      "i was ice skating and i fell onto my behind",
      "i was roller blading and, when stopping, I fell and broke the fall with my hands",
      "I had just served a ball in tennis"
    ],
    "buttocks,groin,upper abdomen,lower abdomen,hip": [
      "I had just served a ball in tennis",
      "i stubbed my toe",
      "I was running and twisted my ankle on a tree root and fell"
    ],
    "head,neck,face": [
      "I was swimming and when I pushed off the wall with my legs, it started hurting",
      "I was roller blading and, when stopping, I fell and broke the fall with my hands",
      "I was ice skating and I fell onto my behind",
      "I reached out my foot, doing the splits, to make a tackle in soccer",
      "I jumped to block a spike in volleyball",
      "I stubbed my toe",
      "I was jogging and all of a sudden it started hurting",
      "I was running and twisted my ankle on a tree root and fell",
      "I was playing soccer and was slide-tackled while running at full speed"
    ],
    "wrist,arm,elbow,hand,forearm,shoulder,chest": [
      "I was swimming and when I pushed off the wall with my legs, it started hurting",
      "I was ice skating and I fell onto my behind",
      "I reached out my foot, doing the splits, to make a tackle in soccer",
      "I stubbed my toe",
      "I was jogging and all of a sudden it started hurting",
      "I was running and twisted my ankle on a tree root and fell",
      "I was playing soccer and was slide-tackled while running at full speed"
    ],
    "back": [
      "I reached out my foot, doing the splits, to make a tackle in soccer",
      "I stubbed my toe",
      "I was running and twisted my ankle on a tree root and fell",
      "I was playing soccer and was slide-tackled while running at full speed",
      "I was roller blading and, when stopping, I fell and broke the fall with my hands"
    ]
  };

  // Rule 14
  if ((method_of_ailment_onset === "spontaneously") &&
      !["I woke up, with nothing I can think of as a probable cause", "I was jogging and all of a sudden it started hurting", "I got up from eating dinner, there was no clear reason, it just began hurting", "I went down the stairs, and for some reason, immediately felt it"].includes(specmethod)) {
    return false;
  }

  if ((method_of_ailment_onset === "from an injury") &&
      ["I woke up, with nothing I can think of as a probable cause", "I was jogging and all of a sudden it started hurting", "I got up from eating dinner, there was no clear reason, it just began hurting", "I went down the stairs, and for some reason, immediately felt it"].includes(specmethod)) {
    return false;
  }

  // Rule 15
  if ((sagittal === "lateral") &&
      ["radiates laterally"].includes(radloc)) {
    return false;
  }

  if ((sagittal === "medial") &&
      ["radiates medially"].includes(radloc)) {
    return false;
  }

  for (const [key, forbiddenList] of Object.entries(forbiddenMethods)) {
    const bodyparts = key.split(',');
    if (bodyparts.includes(bodypart) && forbiddenList.includes(combo.specmethod)) {
      return false;
    }
  }

  return true;
}

// --------------
// DOM and logic
// --------------
document.addEventListener("DOMContentLoaded", () => {
  fetch('parameters.json')
    .then(response => response.json())
    .then(data => {
      // Helper: Get all non-empty values from a specific column
      function getValidValues(column) {
        return data
          .map(entry => entry[column])
          .filter(val => val !== undefined && val !== null && val !== '');
      }

      // Prepare arrays of valid values
      const ageValues = getValidValues('age');
      const sexValues = getValidValues('sex');
      const ailmentTypeValues = getValidValues('ailment_type');
      const sagittalValues = getValidValues('sagittal');
      const coronalValues = getValidValues('coronal');
      const transverseValues = getValidValues('transverse');
      const bodypartValues = getValidValues('bodypart');
      const description1Values = getValidValues('description1');
      const description2Values = getValidValues('description2');
      const actionValues = getValidValues('action');
      const methodOnsetValues = getValidValues('method_of_ailment_onset');
      const durationValues = getValidValues('duration');
      const specactionValues = getValidValues('specaction');
      const specmethodValues = getValidValues('specmethod');
      const radlocValues = getValidValues('radloc');
      const sweldiscValues = getValidValues('sweldisc');
      const regularityValues = getValidValues('regularity');
      const trendValues = getValidValues('trend');

      // Random picker
      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      // Generate a valid combo using your logic rules
      function generateValidCombo() {
        let combo;
        let attempts = 0;
        do {
          combo = {
            age: pickRandom(ageValues),
            sex: pickRandom(sexValues),
            ailment_type: pickRandom(ailmentTypeValues),
            sagittal: pickRandom(sagittalValues),
            coronal: pickRandom(coronalValues),
            transverse: pickRandom(transverseValues),
            bodypart: pickRandom(bodypartValues),
            description1: pickRandom(description1Values),
            description2: pickRandom(description2Values),
            action: pickRandom(actionValues),
            method_of_ailment_onset: pickRandom(methodOnsetValues),
            duration: pickRandom(durationValues),
            specaction: pickRandom(specactionValues),
            specmethod: pickRandom(specmethodValues),
            radloc: pickRandom(radlocValues),
            sweldisc: pickRandom(sweldiscValues),
            regularity: pickRandom(regularityValues),
            trend: pickRandom(trendValues),
          };

        } while (!isValidCombo(combo));
        return combo;
      }

      const combo = generateValidCombo();

      // Rule 9 fix: adjust wording if needed
      if (combo.bodypart === "hand" && combo.sagittal === "front of their") {
        combo.sagittal = "palm of their";
      }

      const replacements = {
        '(age)': combo.age,
        '(sex)': combo.sex,
        '(ailment type)': combo.ailment_type,
        '(sagittal)': combo.sagittal,
        '(coronal)': combo.coronal,
        '(transverse)': combo.transverse,
        '(bodypart)': combo.bodypart,
        '(description1)': combo.description1,
        '(description2)': combo.description2,
        '(action)': combo.action,
        '(method of ailment onset)': combo.method_of_ailment_onset,
        '(duration)': combo.duration,
        '(specaction)': combo.specaction,
        '(specmethod)': combo.specmethod,
        '(radloc)': combo.radloc,
        '(sweldisc)': combo.sweldisc,
        '(regularity)': combo.regularity,
        '(trend)': combo.trend,
      };

      function applyReplacements(id) {
        const el = document.getElementById(id);
        if (!el) return;
        let html = el.innerHTML;
        for (const [placeholder, value] of Object.entries(replacements)) {
          html = html.replaceAll(placeholder, value);
        }
        el.innerHTML = html;
      }

      ['para1', 'para2', 'para3', 'patientdesc'].forEach(applyReplacements);
    });

  // Burger menu toggle logic
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Hide extra paragraphs
  document.getElementById("para2").style.display = "none";
  document.getElementById("para3").style.display = "none";
  document.getElementById("patientdesc").style.display = "none";

  // Load parameters.json via HTTP
  fetch('parameters.json')
    .then(res => res.json())
    .then(data => {
      function getValidValues(col) {
        return data.map(e => e[col]).filter(v => v);
      }
      const ageValues = getValidValues('age');
      /* … other arrays … */

      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }
      function generateValidCombo() {
        let combo;
        do {
          combo = { /* pick each field via pickRandom(...) */ };
        } while (!isValidCombo(combo));
        return combo;
      }
      const combo = generateValidCombo();
      /* apply combo corrections and replacements… */
    })
    .catch(err => console.error('Failed to load parameters:', err));

  // Step-by-step diagnosis listener
  const submitDiag = document.getElementById("submitDiagnosis");
  submitDiag.addEventListener("click", handleSubmitDiagnosis);

  // Manual refresh
  document.getElementById("manualrefresh").addEventListener("click", () => location.reload());
});

function handleSubmitDiagnosis() {
  const input = document.getElementById("diagnosisInput");
  const label = document.getElementById("diagnosisLabel");
  const val = input.value.trim();
  if (!val) return;

  diagnoses.push(val);
  input.value = '';

  if (step === 1) {
    document.getElementById("para2").style.display = "block";
    label.textContent = "Enter your second diagnosis:";
    step++;
  } else if (step === 2) {
    document.getElementById("para3").style.display = "block";
    document.getElementById("patientdesc").style.display = "block";
    label.textContent = "Enter your final diagnosis:";
    step++;
  } else {
    // Final submission: gather and POST
    const payload = {
      para1: document.getElementById('para1').innerText,
      para2: document.getElementById('para2').innerText,
      para3: document.getElementById('para3').innerText,
      patientdesc: document.getElementById('patientdesc').innerText,
      diagnosis1: diagnoses[0],
      diagnosis2: diagnoses[1],
      final_diagnosis: diagnoses[2],
      timestamp: new Date().toISOString()
    };

    fetch("https://script.google.com/macros/s/AKfycbz82gAJ7AJnU7R9wbeT2TR4O38T2DwghY1GexrYd-KoTLHxV6aK-1xosnTnuHbPTilw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    document.getElementById('submissionMessage').style.display = 'block';
    setTimeout(() => location.reload(), 1500);
  }
}