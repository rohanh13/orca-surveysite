document.addEventListener('DOMContentLoaded', () => {
  fetch('parameters.json')
    .then(response => response.json())
    .then(data => {
      // Function to get all non-empty values from a specific column
      function getValidValues(column) {
        return data
          .map(entry => entry[column])
          .filter(val => val !== undefined && val !== null && val !== '');
      }

      // Prepare arrays of valid values for each category
      const ageValues = getValidValues('age');
      const sexValues = getValidValues('sex');
      const ailmentTypeValues = getValidValues('ailment_type');
      const locationSagittalValues = getValidValues('location-sagittal');
      const locationCoronalValues = getValidValues('location-coronal');
      const locationTransverseValues = getValidValues('location_transverse');
      const locationBodypartValues = getValidValues('location_bodypart');
      const description1Values = getValidValues('description1');
      const description2Values = getValidValues('description2');
      const actionValues = getValidValues('action');
      const methodOnsetValues = getValidValues('method_of_ailment_onset');
      const durationValues = getValidValues('duration');

      // Helper to pick a random value from an array
      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      const replacements = {
        '(age)': pickRandom(ageValues),
        '(sex)': pickRandom(sexValues),
        '(ailment type)': pickRandom(ailmentTypeValues),
        '(location-sagittal)': pickRandom(locationSagittalValues),
        '(location-coronal)': pickRandom(locationCoronalValues),
        '(location-transverse)': pickRandom(locationTransverseValues),
        '(location-bodypart)': pickRandom(locationBodypartValues),
        '(description1)': pickRandom(description1Values),
        '(description2)': pickRandom(description2Values),
        '(action)': pickRandom(actionValues),
        '(method of ailment onset)': pickRandom(methodOnsetValues),
        '(duration)': pickRandom(durationValues),
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
});