document.addEventListener('DOMContentLoaded', () => {
  fetch('parameters.json')
    .then(response => response.json())
    .then(data => {
      // Filter to keep only rows where key fields are non-empty (not null, not empty string)
      const filteredData = data.filter(entry =>
        entry.age && entry.sex && entry.ailment_type // add other required fields as needed
      );

      if (filteredData.length === 0) {
        console.error('No valid data entries found with required fields filled.');
        return;
      }

      const randomEntry = filteredData[Math.floor(Math.random() * filteredData.length)];

      const replacements = {
        '(age)': randomEntry.age,
        '(sex)': randomEntry.sex,
        '(ailment type)': randomEntry.ailment_type,
        '(location-sagittal)': randomEntry["location-sagittal"],
        '(location-coronal)': randomEntry["location-coronal"],
        '(location-transverse)': randomEntry["location_transverse"],
        '(location-bodypart)': randomEntry.location_bodypart,
        '(description1)': randomEntry.description1,
        '(description2)': randomEntry.description2,
        '(action)': randomEntry.action,
        '(method of ailment onset)': randomEntry.method_of_ailment_onset,
        '(duration)': randomEntry.duration
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