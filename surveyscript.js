let step = 1;
let diagnoses = [];

document.addEventListener("DOMContentLoaded", function () {
  // Hide para2, para3, and patientdesc initially
  document.getElementById("para2").style.display = "none";
  document.getElementById("para3").style.display = "none";
  document.getElementById("patientdesc").style.display = "none";

  const submitButton = document.getElementById("submitDiagnosis");
  submitButton.addEventListener("click", () => {
    submitButton.classList.add("submitting");
    submitButton.textContent = "Thank You! New Case Loading...";
    submitButton.disabled = true;
  });

  fetch("parameters.json")
    .then(response => response.json())
    .then(data => {
      function getValidValues(column) {
        return data.map(entry => entry[column]).filter(val => val !== undefined && val !== null && val !== "");
      }

      const ageValues = getValidValues("age");
      const sexValues = getValidValues("sex");
      const ailmentTypeValues = getValidValues("ailment_type");
      const sagittalValues = getValidValues("sagittal");
      const coronalValues = getValidValues("coronal");
      const transverseValues = getValidValues("transverse");
      const bodypartValues = getValidValues("bodypart");
      const description1Values = getValidValues("description1");
      const description2Values = getValidValues("description2");
      const actionValues = getValidValues("action");
      const methodOnsetValues = getValidValues("method_of_ailment_onset");
      const durationValues = getValidValues("duration");
      const specactionValues = getValidValues("specaction");
      const specmethodValues = getValidValues("specmethod");
      const radlocValues = getValidValues("radloc");
      const sweldiscValues = getValidValues("sweldisc");
      const regularityValues = getValidValues("regularity");
      const trendValues = getValidValues("trend");

      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      function generateValidCombo() {
        let combo;
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
            trend: pickRandom(trendValues)
          };
        } while (!isValidCombo(combo));
        return combo;
      }

      const combo = generateValidCombo();
      if (combo.bodypart === "hand" && combo.sagittal === "front of their") {
        combo.sagittal = "palm of their";
      }

      const replacements = {
        "(age)": combo.age,
        "(sex)": combo.sex,
        "(ailment type)": combo.ailment_type,
        "(sagittal)": combo.sagittal,
        "(coronal)": combo.coronal,
        "(transverse)": combo.transverse,
        "(bodypart)": combo.bodypart,
        "(description1)": combo.description1,
        "(description2)": combo.description2,
        "(action)": combo.action,
        "(method of ailment onset)": combo.method_of_ailment_onset,
        "(duration)": combo.duration,
        "(specaction)": combo.specaction,
        "(specmethod)": combo.specmethod,
        "(radloc)": combo.radloc,
        "(sweldisc)": combo.sweldisc,
        "(regularity)": combo.regularity,
        "(trend)": combo.trend
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

      ["para1", "para2", "para3", "patientdesc"].forEach(applyReplacements);
    });

  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
});

function handleSubmitDiagnosis() {
  const input = document.getElementById("diagnosisInput");
  const label = document.getElementById("diagnosisLabel");
  const diagnosis = input.value.trim();
  if (!diagnosis) return;

  diagnoses.push(diagnosis);
  input.value = "";

  if (step === 1) {
    document.getElementById("para2").style.display = "block";
    label.innerText = "Enter your second diagnosis:";
    step++;
  } else if (step === 2) {
    document.getElementById("para3").style.display = "block";
    document.getElementById("patientdesc").style.display = "block";
    label.innerText = "Enter your final diagnosis:";
    step++;
  } else if (step === 3) {
    const data = {
      age: document.getElementById("age").innerText,
      sex: document.getElementById("sex").innerText,
      ailment_type: document.getElementById("ailment_type").innerText,
      location_sagittal: document.getElementById("location_sagittal").innerText,
      location_coronal: document.getElementById("location_coronal").innerText,
      location_transverse: document.getElementById("location_transverse").innerText,
      location_bodypart: document.getElementById("location_bodypart").innerText,
      para1: document.getElementById("para1").innerText,
      para2: document.getElementById("para2").innerText,
      para3: document.getElementById("para3").innerText,
      patientdesc: document.getElementById("patientdesc").innerText,
      diagnosis1: diagnoses[0],
      diagnosis2: diagnoses[1],
      final_diagnosis: diagnoses[2],
      timestamp: new Date().toISOString()
    };

    fetch("https://script.google.com/macros/s/AKfycbz82gAJ7AJnU7R9wbeT2TR4O38T2DwghY1GexrYd-KoTLHxV6aK-1xosnTnuHbPTilw/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    alert("Thank you! Your diagnoses have been submitted.");
    document.getElementById("diagnosis-section").style.display = "none";
  }
}

document.getElementById("submitFeedback").addEventListener("click", function () {
  const feedback = document.getElementById("patientFeedback").value.trim();
  if (!feedback) {
    alert("Please enter a diagnosis before submitting.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("feedback", feedback);

  fetch("https://script.google.com/macros/s/AKfycbz82gAJ7AJnU7R9wbeT2TR4O38T2DwghY1GexrYd-KoTLHxV6aK-1xosnTnuHbPTilw/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: formData.toString()
  })
    .then(response => response.json())
    .then(data => {
      if (data.result === "Success") {
        document.getElementById("patientFeedback").value = "";
        setTimeout(() => location.reload(), 1000);
      } else {
        alert("Submission failed, please try again.");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("Submission failed. Please check the console for errors.");
    });
});

document.getElementById("manualrefresh").addEventListener("click", () => {
  location.reload();
});