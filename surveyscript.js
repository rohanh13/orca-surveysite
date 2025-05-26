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

      // Validation rules (pure function)
      function isValidCombo(combo) {
        const { sagittal, coronal, transverse, bodypart, action, description1, description2, specaction, specmethod } = combo;
        // Rule 1
        if ((sagittal.startsWith('anterior') || sagittal.startsWith('posterior')) &&
            ['buttocks','groin','calf','shin','chest','back','wrist','face'].includes(bodypart)) {
          return false;
        }
        // Rule 2
        if ((sagittal.startsWith('lateral side of their') || sagittal.startsWith('medial side of their')) &&
            ['hip','groin','buttocks','abdomen','chest','back','neck','face','head'].includes(bodypart)) {
          return false;
        }
        // Rule 3
        if ((coronal === 'upper' || coronal === 'lower') &&
            (sagittal.startsWith('top of their') || sagittal.startsWith('bottom of their'))) {
          return false;
        }
        // Rule 4
        if ((transverse === 'left' || transverse === 'right') && ['head','neck','face'].includes(bodypart)) {
          return false;
        }
        // Rule 5
        if ((action === 'dorsiflexing' || action === 'plantarflexing') &&
            !['foot','ankle'].includes(bodypart)) {
          return false;
        }
        // Rule 6
        if ((action === 'externally rotating' || action === 'internally rotating') &&
            ['shin','calf','abdomen','chest','back','neck','face','head'].includes(bodypart)) {
          return false;
        }
        // Rule 7
        if (action === 'twisting' &&
            !['abdomen','chest','back','neck','face','head'].includes(bodypart)) {
          return false;
        }
        // Rule 8
        if (description1 === description2) {
          return false;
        }
        // Rule 10
        if ((coronal === 'upper' || coronal === 'lower') &&
            ['foot','ankle','knee','shoulder','elbow','hand','wrist','face','head'].includes(bodypart)) {
          return false;
        }
        // Rule 11 - sharp vs dull
        const sharpGroup = ['sharp','shooting','stabbing'];
        const dullGroup = ['dull','throbbing','aching'];
        if ((sharpGroup.includes(description1) && dullGroup.includes(description2)) ||
            (dullGroup.includes(description1) && sharpGroup.includes(description2))) {
          return false;
        }
        // Rule 12 - specaction rules per bodypart
        const specactionRules = {
          ankle: ['walk up stairs','walk down stairs','run','point my toes down','squat','lunge','jump','bend my knees','stand up from a seated position'],
          shin: ['walk up stairs','walk down stairs','run','squat','lunge','jump','bend my knees','stand up from a seated position','try to touch my toes'],
          calf: ['walk up stairs','walk down stairs','run','squat','lunge','jump','bend my knees','stand up from a seated position','try to touch my toes'],
          knee: ['walk up stairs','walk down stairs','run','squat','lunge','jump','bend my knees','bend my knees inwards','stand up from a seated position','bend down to pick something up','try to touch my toes'],
          thigh: ['walk up stairs','walk down stairs','run','squat','lunge','jump','bend my knees','stand up from a seated position','bend down to pick something up','try to touch my toes'],
          hip: ['walk up stairs','walk down stairs','run','squat','lunge','jump','stand up from a seated position','bend down to pick something up','try to touch my toes'],
          buttocks: ['walk up stairs','walk down stairs','run','squat','lunge','jump','stand up from a seated position','bend down to pick something up','try to touch my toes'],
          groin: ['walk up stairs','walk down stairs','run','squat','lunge','jump','stand up from a seated position','bend down to pick something up','try to touch my toes'],
          abdomen: ['stand up from a seated position','bend down to pick something up','try to touch my toes','pull open a heavy door','lift something above my head','carry my groceries into the house','do a sit-up'],
          back: ['stand up from a seated position','bend down to pick something up','try to touch my toes','pull open a heavy door','lift something above my head','carry my groceries into the house','do a sit-up','do a pull-up','squat'],
          chest: ['pull open a heavy door','lift something above my head','carry my groceries into the house','do a push-up','do a pull-up'],
          shoulder: ['pull open a heavy door','do a push-up','lift something above my head','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up'],
          arm: ['pull open a heavy door','do a push-up','lift something above my head','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up'],
          elbow: ['pull open a heavy door','do a push-up','lift something above my head','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up'],
          forearm: ['pull open a heavy door','do a push-up','lift something above my head','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up'],
          hand: ['pull open a heavy door','do a push-up','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up','play piano'],
          wrist: ['pull open a heavy door','do a push-up','do a lateral shoulder raise in the gym','do a bicep curl exercise','do a tricep extension exercise','carry my groceries into the house','do a pull-up','play piano'],
          neck: ['carry my groceries into the house','do a pull-up','turn my head horizontally','look up to the sky','look down at my feet','chew','open my jaw wide'],
          head: ['turn my head horizontally','look up to the sky','look down at my feet','chew','open my jaw wide'],
          face: ['scrunch my nose','raise my eyebrows','puff my cheeks','chew','open my jaw wide']
        };
        if (specactionRules[bodypart] && !specactionRules[bodypart].includes(specaction)) {
          return false;
        }
        // Rule 13 - specmethod restrictions per body regions
        const forbiddenMethods = {
          'foot,ankle,shin,calf,knee,thigh': ['a car hit my car from behind','i was ice skating and i fell onto my behind','i was roller blading and, when stopping, I fell and broke the fall with my hands','I had just served a ball in tennis'],
          'buttocks,groin,abdomen,hip': ['i was roller blading and, when stopping, I fell and broke the fall with my hands','I had just served a ball in tennis','i stubbed my toe','I was running and twisted my ankle on a tree root and fell'],
          'head,neck,face': ['I was swimming and when I pushed off the wall with my legs, it started hurting','I was roller blading and, when stopping, I fell and broke the fall with my hands','I was ice skating and I fell onto my behind','I reached out my foot, doing the splits, to make a tackle in soccer','I jumped to block a spike in volleyball','I stubbed my toe','I was running and twisted my ankle on a tree root and fell','I was playing soccer and was slide-tackled while running at full speed'],
          'wrist,arm,elbow,hand,forearm,shoulder,chest': ['I was swimming and when I pushed off the wall with my legs, it started hurting','I was ice skating and I fell onto my behind','I reached out my foot, doing the splits, to make a tackle in soccer','I stubbed my toe','I was running and twisted my ankle on a tree root and fell','I was playing soccer and was slide-tackled while running at full speed'],
          'back': ['I reached out my foot, doing the splits, to make a tackle in soccer','I stubbed my toe','I was running and twisted my ankle on a tree root and fell','I was playing soccer and was slide-tackled while running at full speed','I was roller blading and, when stopping, I fell and broke the fall with my hands']
        };
        for (const [key, list] of Object.entries(forbiddenMethods)) {
          if (key.split(',').includes(bodypart) && list.includes(specmethod)) {
            return false;
          }
        }
        return true;
      }

        while (true) {
          const combo = {
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

          // Hand phrasing fix
          if (combo.bodypart === 'hand' && combo.sagittal === 'front of their') {
            combo.sagittal = 'palm of their';
          }

          if (isValidCombo(combo)) {
            return combo;
          }
        }
      }

      // Build replacements and apply to DOM
      const combo = generateValidCombo();
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
        '(trend)': combo.trend
      };
      ['para1','para2','para3','patientdesc'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        let html = el.innerHTML;
        Object.entries(replacements).forEach(([ph,val]) => {
          html = html.replaceAll(ph, val);
        });
        el.innerHTML = html;
      });

      // Burger menu toggle
      const burger = document.querySelector('.burger');
      const navLinks = document.querySelector('.nav-links');
      if (burger && navLinks) burger.addEventListener('click', () => navLinks.classList.toggle('show'));
    });
});