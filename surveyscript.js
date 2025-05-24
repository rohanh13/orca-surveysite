document.addEventListener('DOMContentLoaded', () => {
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
      const sagittalValues = getValidValues('location-sagittal');
      const coronalValues = getValidValues('location-coronal');
      const transverseValues = getValidValues('location_transverse');
      const bodypartValues = getValidValues('location_bodypart');
      const description1Values = getValidValues('description1');
      const description2Values = getValidValues('description2');
      const actionValues = getValidValues('action');
      const methodOnsetValues = getValidValues('method_of_ailment_onset');
      const durationValues = getValidValues('duration');

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
            duration: pickRandom(durationValues)
          };
          attempts++;
          if (attempts > 100) break;
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
});

// Validation rules
function isValidCombo(combo) {
  const {
    sagittal,
    coronal,
    transverse,
    bodypart,
    action,
    description1,
    description2
  } = combo;

  // Rule 1
  if ((sagittal?.startsWith("front") || sagittal?.startsWith("back")) &&
      ["buttocks", "groin", "calf", "shin", "chest", "back", "wrist", "face"].includes(bodypart)) {
    return false;
  }

  // Rule 2
  if ((sagittal?.startsWith("lateral side of their") || sagittal?.startsWith("medial side of their")) &&
      ["hip", "groin", "buttocks", "abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
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
      ["shin", "calf", "abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 7
  if (action === "twisting" &&
      !["abdomen", "chest", "back", "neck", "face", "head"].includes(bodypart)) {
    return false;
  }

  // Rule 8
  if (description1 && description2 && description1 === description2) {
    return false;
  }

  return true;
}
