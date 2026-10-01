/* =========================================
   MOMENTS REMAINING
   ========================================= */


/* -----------------------------
   DOM ELEMENTS
----------------------------- */

const personName = document.getElementById("personName");
const relationship = document.getElementById("relationship");
const currentAge = document.getElementById("currentAge");
const horizonAge = document.getElementById("horizonAge");

const frequency = document.getElementById("frequency");
const hours = document.getElementById("hours");

const customFrequencyToggle =
    document.getElementById("customFrequencyToggle");

const customFrequencyBox =
    document.getElementById("customFrequencyBox");

const customFrequency =
    document.getElementById("customFrequency");

const calculateBtn =
    document.getElementById("calculateBtn");

const results =
    document.getElementById("results");

const resultTitle =
    document.getElementById("resultTitle");

const resultSubtitle =
    document.getElementById("resultSubtitle");

const remainingMeetings =
    document.getElementById("remainingMeetings");

const remainingHours =
    document.getElementById("remainingHours");

const remainingDays =
    document.getElementById("remainingDays");

const remainingYears =
    document.getElementById("remainingYears");

const dots =
    document.getElementById("dots");

const dotCountLabel =
    document.getElementById("dotCountLabel");

const reflectionText =
    document.getElementById("reflectionText");

const frequencySlider =
    document.getElementById("frequencySlider");

const sliderFrequency =
    document.getElementById("sliderFrequency");

const sliderMeetings =
    document.getElementById("sliderMeetings");

const saveBtn =
    document.getElementById("saveBtn");

const resetBtn =
    document.getElementById("resetBtn");

const savedSection =
    document.getElementById("savedSection");

const savedPeople =
    document.getElementById("savedPeople");


/* -----------------------------
   STATE
----------------------------- */

let calculation = null;


/* -----------------------------
   RELATIONSHIP DEFAULTS
----------------------------- */

const relationshipDefaults = {

    child: {
        horizon: 18,
        frequency: 365,
        hours: 4
    },

    parent: {
        horizon: 85,
        frequency: 12,
        hours: 6
    },

    sibling: {
        horizon: 80,
        frequency: 6,
        hours: 5
    },

    friend: {
        horizon: 80,
        frequency: 12,
        hours: 4
    },

    partner: {
        horizon: 85,
        frequency: 300,
        hours: 5
    },

    other: {
        horizon: 80,
        frequency: 12,
        hours: 4
    }

};


/* -----------------------------
   RELATIONSHIP CHANGE
----------------------------- */

relationship.addEventListener("change", () => {

    const selected =
        relationshipDefaults[relationship.value];

    horizonAge.value =
        selected.horizon;

    hours.value =
        selected.hours;

    const option =
        [...frequency.options]
            .find(option => option.value == selected.frequency);

    if (option) {
        frequency.value =
            selected.frequency;
    }

});


/* -----------------------------
   CUSTOM FREQUENCY
----------------------------- */

customFrequencyToggle.addEventListener(
    "change",
    () => {

        customFrequencyBox.classList.toggle(
            "hidden",
            !customFrequencyToggle.checked
        );

    }
);


/* -----------------------------
   FORMAT NUMBERS
----------------------------- */

function formatNumber(number) {

    return Math.round(number)
        .toLocaleString("en-IN");

}


/* -----------------------------
   GET FREQUENCY
----------------------------- */

function getFrequency() {

    if (customFrequencyToggle.checked) {

        return Math.max(
            0,
            Number(customFrequency.value) || 0
        );

    }

    return Number(frequency.value);

}


/* -----------------------------
   CALCULATE
----------------------------- */

function calculateMoments(
    frequencyPerYear = null
) {

    const age =
        Number(currentAge.value);

    const horizon =
        Number(horizonAge.value);

    const hoursPerMeeting =
        Number(hours.value);

    const frequencyPerYearValue =
        frequencyPerYear !== null
            ? frequencyPerYear
            : getFrequency();


    /* Validation */

    if (
        Number.isNaN(age) ||
        Number.isNaN(horizon) ||
        Number.isNaN(hoursPerMeeting)
    ) {

        alert(
            "Please fill in all the required fields."
        );

        return null;
    }


    if (horizon <= age) {

        alert(
            "The ending age needs to be greater than their current age."
        );

        return null;
    }


    if (hoursPerMeeting <= 0) {

        alert(
            "Hours together must be greater than zero."
        );

        return null;
    }


    /* Core calculation */

    const yearsRemaining =
        horizon - age;


    const meetingsRemaining =
        yearsRemaining * frequencyPerYearValue;


    const totalHours =
        meetingsRemaining * hoursPerMeeting;


    const totalDays =
        totalHours / 24;


    return {

        age,
        horizon,

        yearsRemaining,

        frequency:
            frequencyPerYearValue,

        hoursPerMeeting,

        meetings:
            meetingsRemaining,

        hours:
            totalHours,

        days:
            totalDays

    };

}


/* -----------------------------
   DISPLAY RESULT
----------------------------- */

function displayResult(data) {

    calculation = data;


    const name =
        personName.value.trim() ||
        "this person";


    resultTitle.textContent =
        `You have about ${formatNumber(data.meetings)} moments left with ${name}.`;


    resultSubtitle.textContent =
        `Based on seeing them ${formatNumber(data.frequency)} times a year for ${data.hoursPerMeeting} hours each time.`;


    remainingMeetings.textContent =
        formatNumber(data.meetings);


    remainingHours.textContent =
        formatNumber(data.hours);


    remainingDays.textContent =
        formatNumber(data.days);


    remainingYears.textContent =
        data.yearsRemaining.toFixed(1);


    frequencySlider.value =
        Math.min(
            365,
            Math.max(1, Math.round(data.frequency))
        );


    sliderFrequency.textContent =
        formatNumber(data.frequency);


    sliderMeetings.textContent =
        formatNumber(data.meetings);


    dotCountLabel.textContent =
        `${formatNumber(data.meetings)} moments`;


    createDots(data.meetings);


    createReflection(data);


    results.classList.remove("hidden");


    setTimeout(() => {

        results.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* -----------------------------
   DOT VISUALIZATION
----------------------------- */

function createDots(number) {

    dots.innerHTML = "";


    /*
        We don't render thousands of actual DOM elements.

        Maximum visual dots = 300.
        The visualization communicates scale,
        while the exact number remains above it.
    */

    const visualDots =
        Math.min(
            Math.max(Math.round(number / 2), 20),
            300
        );


    for (
        let i = 0;
        i < visualDots;
        i++
    ) {

        const dot =
            document.createElement("span");

        dot.className = "dot future";

        dots.appendChild(dot);

    }

}


/* -----------------------------
   REFLECTION TEXT
----------------------------- */

function createReflection(data) {

    const years =
        data.yearsRemaining;


    if (data.meetings < 50) {

        reflectionText.textContent =
            "The number is small enough to feel real. If these moments matter to you, the question is no longer whether you have time — it is what you will do with the time you have.";

        return;

    }


    if (data.meetings < 500) {

        reflectionText.textContent =
            "Hundreds of moments can sound like a lot. But spread across the years, they can disappear surprisingly quickly. The point is not to worry about the number. It is to notice the moments while they are happening.";

        return;

    }


    if (years < 5) {

        reflectionText.textContent =
            "You don't need to change everything. Sometimes the smallest increase in attention or frequency can change how a limited window feels.";

        return;

    }


    reflectionText.textContent =
        "This number is not a prediction. It is a prompt. Time becomes easier to value when you can see that even a familiar routine contains a finite number of opportunities.";

}


/* -----------------------------
   CALCULATE BUTTON
----------------------------- */

calculateBtn.addEventListener(
    "click",
    () => {

        const data =
            calculateMoments();

        if (data) {

            displayResult(data);

        }

    }
);


/* -----------------------------
   WHAT-IF SLIDER
----------------------------- */

frequencySlider.addEventListener(
    "input",
    () => {

        if (!calculation) {
            return;
        }


        const newFrequency =
            Number(frequencySlider.value);


        const newMeetings =
            calculation.yearsRemaining *
            newFrequency;


        sliderFrequency.textContent =
            formatNumber(newFrequency);


        sliderMeetings.textContent =
            formatNumber(newMeetings);

    }
);


/* -----------------------------
   SAVE PERSON
----------------------------- */

saveBtn.addEventListener(
    "click",
    () => {

        if (!calculation) {
            return;
        }


        const saved =
            JSON.parse(
                localStorage.getItem(
                    "momentsRemaining"
                ) || "[]"
            );


        const person = {

            id:
                Date.now(),

            name:
                personName.value.trim() ||
                "Someone I love",

            relationship:
                relationship.value,

            age:
                calculation.age,

            horizon:
                calculation.horizon,

            frequency:
                calculation.frequency,

            hours:
                calculation.hoursPerMeeting,

            meetings:
                calculation.meetings

        };


        saved.push(person);


        localStorage.setItem(
            "momentsRemaining",
            JSON.stringify(saved)
        );


        renderSavedPeople();

        saveBtn.textContent =
            "Saved ✓";


        setTimeout(() => {

            saveBtn.textContent =
                "Save this person";

        }, 1800);

    }
);


/* -----------------------------
   RENDER SAVED PEOPLE
----------------------------- */

function renderSavedPeople() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "momentsRemaining"
            ) || "[]"
        );


    if (!saved.length) {

        savedSection.classList.add(
            "hidden"
        );

        return;

    }


    savedSection.classList.remove(
        "hidden"
    );


    savedPeople.innerHTML = "";


    saved.forEach(person => {

        const item =
            document.createElement("div");

        item.className =
            "saved-person";


        item.innerHTML = `

            <div>

                <div class="saved-person-name">
                    ${escapeHTML(person.name)}
                </div>

                <div class="saved-person-meta">
                    ${capitalize(person.relationship)}
                    · ${formatNumber(person.frequency)}
                    times/year
                </div>

            </div>

            <div class="saved-person-number">
                ${formatNumber(person.meetings)}
            </div>

        `;


        savedPeople.appendChild(item);

    });

}


/* -----------------------------
   ESCAPE HTML
----------------------------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* -----------------------------
   CAPITALIZE
----------------------------- */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}

/* -----------------------------
   AMBIENT MUSIC
----------------------------- */

const ambientMusic =
    document.getElementById("ambientMusic");

const musicToggle =
    document.getElementById("musicToggle");

const musicText =
    document.getElementById("musicText");

const musicBars =
    document.getElementById("musicBars");


musicToggle.addEventListener(
    "click",
    async () => {

        if (ambientMusic.paused) {

            try {

                await ambientMusic.play();

                musicText.textContent =
                    "Pause reflection music";

                musicBars.classList.add("active");

                musicToggle.setAttribute(
                    "aria-label",
                    "Pause ambient music"
                );

            } catch (error) {

                console.error(
                    "Music could not be played:",
                    error
                );

            }

        } else {

            ambientMusic.pause();

            musicText.textContent =
                "Play reflection music";

            musicBars.classList.remove("active");

            musicToggle.setAttribute(
                "aria-label",
                "Play ambient music"
            );

        }

    }
);

/* -----------------------------
   RESET
----------------------------- */

resetBtn.addEventListener(
    "click",
    () => {

        // Reset current form
        personName.value = "";

        relationship.value = "child";

        currentAge.value = "";

        horizonAge.value =
            relationshipDefaults.child.horizon;

        frequency.value =
            relationshipDefaults.child.frequency;

        hours.value =
            relationshipDefaults.child.hours;

        customFrequencyToggle.checked = false;

        customFrequencyBox.classList.add("hidden");


        // Reset current results
        results.classList.add("hidden");

        calculation = null;


        // Clear all saved people
        localStorage.removeItem("momentsRemaining");


        // Clear saved people from the screen
        savedPeople.innerHTML = "";

        savedSection.classList.add("hidden");


        // Return to the top
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);




/* -----------------------------
   INITIAL LOAD
----------------------------- */

renderSavedPeople();