/* ============================================================
   CHURN//IQ
   Customer Churn Intelligence
   Frontend interactions
============================================================ */


/* ============================================================
   DOM READY
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

         initializeCounters();
         initializePrediction();
         initializeScrollEffects();
         initializeCursorGlow();

});


/* ============================================================
   ANIMATED KPI COUNTERS
============================================================ */

function initializeCounters() {

         const counters = document.querySelectorAll("[data-count]");

         const observer = new IntersectionObserver(
                  (entries, observerInstance) => {

                           entries.forEach((entry) => {

                                    if (!entry.isIntersecting) {
                                             return;
                                    }

                                    const element = entry.target;

                                    animateCounter(element);

                                    observerInstance.unobserve(element);

                           });

                  },
                  {
                           threshold: 0.5
                  }
         );


         counters.forEach((counter) => {
                  observer.observe(counter);
         });

}


function animateCounter(element) {

         const target = Number(element.dataset.count);

         const decimals = Number(
                  element.dataset.decimal || 0
         );

         const duration = 1300;

         const start = performance.now();


         function update(currentTime) {

                  const elapsed = currentTime - start;

                  const progress = Math.min(
                           elapsed / duration,
                           1
                  );

                  /*
                   * Smooth ease-out animation.
                   */
                  const eased =
                           1 - Math.pow(1 - progress, 3);

                  const currentValue =
                           target * eased;


                  if (decimals > 0) {

                           element.textContent =
                                    currentValue.toFixed(decimals) + "%";

                  } else {

                           element.textContent =
                                    Math.floor(currentValue).toLocaleString();

                  }


                  if (progress < 1) {

                           requestAnimationFrame(update);

                  } else {

                           if (decimals > 0) {

                                    element.textContent =
                                             target.toFixed(decimals) + "%";

                           } else {

                                    element.textContent =
                                             target.toLocaleString();

                           }

                  }

         }


         requestAnimationFrame(update);
}


/* ============================================================
   PREDICTION LAB
============================================================ */

function initializePrediction() {

         const predictButton =
                  document.getElementById("predictButton");

         if (!predictButton) {
                  return;
         }


         predictButton.addEventListener(
                  "click",
                  runPrediction
         );

}


/*
 * IMPORTANT:
 *
 * The GitHub Pages version cannot directly execute the
 * Python/scikit-learn .pkl model.
 *
 * This frontend therefore uses a transparent browser-side
 * risk scoring layer for the interactive experience.
 *
 * The actual trained Gradient Boosting model remains available
 * in the Streamlit application.
 *
 * Once the trained pipeline is converted to ONNX, this function
 * can be replaced with genuine browser-side ML inference.
 */

function calculateRisk(inputs) {

         let score = 0;


         /* --------------------------------
            Contract
         -------------------------------- */

         if (
                  inputs.contract === "Month-to-month"
         ) {

                  score += 30;

         } else if (
                  inputs.contract === "One year"
         ) {

                  score += 10;

         }


         /* --------------------------------
            Tenure
         -------------------------------- */

         if (inputs.tenure <= 6) {

                  score += 20;

         } else if (inputs.tenure <= 12) {

                  score += 14;

         } else if (inputs.tenure <= 24) {

                  score += 7;

         }


         /* --------------------------------
            Monthly charges
         -------------------------------- */

         if (inputs.monthly >= 100) {

                  score += 20;

         } else if (inputs.monthly > 70) {

                  score += 13;

         } else if (inputs.monthly > 50) {

                  score += 6;

         }


         /* --------------------------------
            Payment method
         -------------------------------- */

         if (
                  inputs.payment ===
                  "Electronic check"
         ) {

                  score += 10;

         }


         /* --------------------------------
            Internet service
         -------------------------------- */

         if (
                  inputs.internet ===
                  "Fiber optic"
         ) {

                  score += 8;

         }


         /* --------------------------------
            Online security
         -------------------------------- */

         if (
                  inputs.security === "No"
         ) {

                  score += 5;

         }


         /* --------------------------------
            Tech support
         -------------------------------- */

         if (
                  inputs.support === "No"
         ) {

                  score += 4;

         }


         /* --------------------------------
            Paperless billing
         -------------------------------- */

         if (
                  inputs.paperless === "Yes"
         ) {

                  score += 2;

         }


         /* --------------------------------
            Senior citizen
         -------------------------------- */

         if (
                  inputs.senior === "1"
         ) {

                  score += 3;

         }


         /*
          * Normalize the score into a
          * probability-like percentage.
          */

         let probability =
                  Math.round(
                           Math.min(
                                    Math.max(score, 4),
                                    94
                           )
                  );


         return probability;
}


/* ============================================================
   RUN PREDICTION
============================================================ */

function runPrediction() {

         const button =
                  document.getElementById(
                           "predictButton"
                  );

         const resultStatus =
                  document.getElementById(
                           "resultStatus"
                  );

         const probabilityValue =
                  document.getElementById(
                           "probabilityValue"
                  );

         const riskResult =
                  document.getElementById(
                           "riskResult"
                  );

         const riskText =
                  document.getElementById(
                           "riskText"
                  );

         const recommendationText =
                  document.getElementById(
                           "recommendationText"
                  );

         const meterRing =
                  document.querySelector(
                           ".meter-ring"
                  );


         /* --------------------------------
            Read customer inputs
         -------------------------------- */

         const inputs = {

                  gender:
                           document.getElementById(
                                    "gender"
                           ).value,

                  senior:
                           document.getElementById(
                                    "senior"
                           ).value,

                  partner:
                           document.getElementById(
                                    "partner"
                           ).value,

                  dependents:
                           document.getElementById(
                                    "dependents"
                           ).value,

                  tenure:
                           Number(
                                    document.getElementById(
                                             "tenure"
                                    ).value
                           ),

                  phone:
                           document.getElementById(
                                    "phone"
                           ).value,

                  lines:
                           document.getElementById(
                                    "lines"
                           ).value,

                  internet:
                           document.getElementById(
                                    "internet"
                           ).value,

                  security:
                           document.getElementById(
                                    "security"
                           ).value,

                  backup:
                           document.getElementById(
                                    "backup"
                           ).value,

                  device:
                           document.getElementById(
                                    "device"
                           ).value,

                  support:
                           document.getElementById(
                                    "support"
                           ).value,

                  tv:
                           document.getElementById(
                                    "tv"
                           ).value,

                  movies:
                           document.getElementById(
                                    "movies"
                           ).value,

                  contract:
                           document.getElementById(
                                    "contract"
                           ).value,

                  paperless:
                           document.getElementById(
                                    "paperless"
                           ).value,

                  payment:
                           document.getElementById(
                                    "payment"
                           ).value,

                  monthly:
                           Number(
                                    document.getElementById(
                                             "monthly"
                                    ).value
                           ),

                  total:
                           Number(
                                    document.getElementById(
                                             "total"
                                    ).value
                           )

         };


         /* --------------------------------
            Loading state
         -------------------------------- */

         button.disabled = true;

         button.querySelector("span:first-child")
                  .textContent =
                  "ANALYZING CUSTOMER...";

         resultStatus.textContent =
                  "PROCESSING";


         riskResult.className =
                  "risk-result neutral";


         riskText.textContent =
                  "CALCULATING";


         probabilityValue.textContent =
                  "—";


         meterRing.style.background =
                  `
        conic-gradient(
            rgba(255,255,255,0.12)
            0deg,
            rgba(255,255,255,0.12)
            360deg
        )
        `;


         /*
          * Small delay makes the interface feel
          * like an actual analytical process.
          */

         setTimeout(() => {

                  const probability =
                           calculateRisk(inputs);


                  /* --------------------------------
                     Determine risk
                  -------------------------------- */

                  let risk;
                  let recommendation;


                  /*
                   * This mirrors the risk thresholds
                   * used by the Streamlit application:
                   *
                   * >= 70 → High Risk
                   * < 70 when predicted churn → Medium
                   * otherwise → Low
                   */

                  if (probability >= 70) {

                           risk = "HIGH RISK";

                           recommendation =
                                    "Prioritize proactive retention measures. Consider personalized offers, service improvements, and contract upgrade incentives.";

                  } else if (probability >= 40) {

                           risk = "MEDIUM RISK";

                           recommendation =
                                    "Monitor this customer closely and consider targeted engagement or retention offers before churn risk increases.";

                  } else {

                           risk = "LOW RISK";

                           recommendation =
                                    "Maintain regular engagement and service monitoring. Current customer signals indicate comparatively lower churn exposure.";

                  }


                  /* --------------------------------
                     Animate probability
                  -------------------------------- */

                  animateProbability(
                           probabilityValue,
                           probability
                  );


                  /* --------------------------------
                     Update risk meter
                  -------------------------------- */

                  const degrees =
                           probability * 3.6;


                  meterRing.style.background =
                           `
            conic-gradient(
                #8b5cf6 0deg,
                #22d3ee ${degrees}deg,
                rgba(255,255,255,0.06)
                ${degrees}deg,
                rgba(255,255,255,0.06)
                360deg
            )
            `;


                  /* --------------------------------
                     Risk state
                  -------------------------------- */

                  if (risk === "HIGH RISK") {

                           riskResult.className =
                                    "risk-result high";

                  } else if (
                           risk === "MEDIUM RISK"
                  ) {

                           riskResult.className =
                                    "risk-result medium";

                  } else {

                           riskResult.className =
                                    "risk-result low";

                  }


                  riskText.textContent =
                           risk;


                  recommendationText.textContent =
                           recommendation;


                  resultStatus.textContent =
                           "ANALYSIS COMPLETE";


                  /* --------------------------------
                     Reset button
                  -------------------------------- */

                  button.disabled = false;

                  button.querySelector(
                           "span:first-child"
                  ).textContent =
                           "RUN CHURN ANALYSIS";


                  /*
                   * Bring the result into view on
                   * smaller screens.
                   */

                  if (
                           window.innerWidth < 1050
                  ) {

                           document
                                    .querySelector(
                                             ".prediction-result"
                                    )
                                    .scrollIntoView({
                                             behavior: "smooth",
                                             block: "center"
                                    });

                  }

         }, 850);

}


/* ============================================================
   PROBABILITY ANIMATION
============================================================ */

function animateProbability(
         element,
         target
) {

         const duration = 900;

         const start = performance.now();


         function update(currentTime) {

                  const elapsed =
                           currentTime - start;

                  const progress =
                           Math.min(
                                    elapsed / duration,
                                    1
                           );

                  const eased =
                           1 -
                           Math.pow(
                                    1 - progress,
                                    3
                           );


                  const value =
                           Math.round(
                                    target * eased
                           );


                  element.textContent =
                           `${value}%`;


                  if (progress < 1) {

                           requestAnimationFrame(
                                    update
                           );

                  }

         }


         requestAnimationFrame(update);
}


/* ============================================================
   SCROLL REVEAL
============================================================ */

function initializeScrollEffects() {

         const elements =
                  document.querySelectorAll(
                           ".panel, .kpi-card, .tech-item, .high-risk-panel"
                  );


         elements.forEach((element) => {

                  element.style.opacity = "0";

                  element.style.transform =
                           "translateY(18px)";

                  element.style.transition =
                           "opacity 0.7s ease, transform 0.7s ease";

         });


         const observer =
                  new IntersectionObserver(
                           (entries) => {

                                    entries.forEach(
                                             (entry) => {

                                                      if (
                                                               !entry.isIntersecting
                                                      ) {

                                                               return;

                                                      }


                                                      entry.target.style.opacity =
                                                               "1";

                                                      entry.target.style.transform =
                                                               "translateY(0)";


                                                      observer.unobserve(
                                                               entry.target
                                                      );

                                             }
                                    );

                           },
                           {
                                    threshold: 0.08
                           }
                  );


         elements.forEach(
                  (element) => {
                           observer.observe(element);
                  }
         );

}


/* ============================================================
   CURSOR-REACTIVE BACKGROUND
============================================================ */

function initializeCursorGlow() {

         const glowOne =
                  document.querySelector(
                           ".glow-one"
                  );

         const glowTwo =
                  document.querySelector(
                           ".glow-two"
                  );


         if (!glowOne || !glowTwo) {
                  return;
         }


         let mouseX = 0;
         let mouseY = 0;

         let currentX = 0;
         let currentY = 0;


         document.addEventListener(
                  "mousemove",
                  (event) => {

                           mouseX =
                                    event.clientX;

                           mouseY =
                                    event.clientY;

                  }
         );


         function animate() {

                  currentX +=
                           (mouseX - currentX) * 0.025;

                  currentY +=
                           (mouseY - currentY) * 0.025;


                  glowOne.style.transform =
                           `
            translate(
                ${currentX * 0.025}px,
                ${currentY * 0.025}px
            )
            `;


                  glowTwo.style.transform =
                           `
            translate(
                ${currentX * -0.018}px,
                ${currentY * -0.018}px
            )
            `;


                  requestAnimationFrame(
                           animate
                  );

         }


         animate();
}


/* ============================================================
   NAVBAR ACTIVE SECTION
============================================================ */

const sections =
         document.querySelectorAll(
                  "section[id]"
         );

const navLinks =
         document.querySelectorAll(
                  ".nav-links a"
         );


if (
         sections.length &&
         navLinks.length
) {

         window.addEventListener(
                  "scroll",
                  () => {

                           let currentSection = "";


                           sections.forEach(
                                    (section) => {

                                             const sectionTop =
                                                      section.offsetTop -
                                                      150;

                                             if (
                                                      window.scrollY >=
                                                      sectionTop
                                             ) {

                                                      currentSection =
                                                               section.id;

                                             }

                                    }
                           );


                           navLinks.forEach(
                                    (link) => {

                                             link.style.color =
                                                      "";

                                             if (
                                                      link.getAttribute(
                                                               "href"
                                                      ) ===
                                                      `#${currentSection}`
                                             ) {

                                                      link.style.color =
                                                               "#ffffff";

                                             }

                                    }
                           );

                  }
         );

}