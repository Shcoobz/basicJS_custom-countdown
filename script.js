/**
 * Manages a countdown timer, including display updates and saving state to local storage.
 * @fileOverview This script provides functionalities to set up a countdown timer, display it,
 * update it every second, and show a completion message once the countdown ends. It also
 * supports saving the countdown state to local storage and restoring it upon reload.
 */

// Countdown Timer UI Elements Initialization
const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Constants for time calculations
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const COUNTDOWN_ENDED = 0;

// Variables to store countdown state
let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

// Set the minimum date input to today's date
/** @const {string} today - Today's date in YYYY-MM-DD format. */
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

/**
 * Shows the countdown in progress with updated time values.
 * @param {number} days - Days remaining in the countdown.
 * @param {number} hours - Hours remaining in the countdown.
 * @param {number} minutes - Minutes remaining in the countdown.
 * @param {number} seconds - Seconds remaining in the countdown.
 */
function showCountdown(days, hours, minutes, seconds) {
  // Populate countdown
  countdownElTitle.textContent = `${countdownTitle}`;
  timeElements[0].textContent = `${days}`;
  timeElements[1].textContent = `${hours}`;
  timeElements[2].textContent = `${minutes}`;
  timeElements[3].textContent = `${seconds}`;

  // Adjust visibility
  completeEl.hidden = true;
  countdownEl.hidden = false;
}

/**
 * Displays a message indicating the countdown has completed.
 */
function showCountdownComplete() {
  countdownEl.hidden = true;
  clearInterval(countdownActive);
  completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
  completeEl.hidden = false;
}

/**
 * Updates the countdown timer or shows a completion message based on the current time.
 */
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;

    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    // Hide Input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (distance < COUNTDOWN_ENDED) {
      showCountdownComplete();
    } else {
      showCountdown(days, hours, minutes, seconds);
    }
  }, SECOND);
}

/**
 * Handles submission of the countdown form, setting up a new countdown.
 * @param {Event} e - The event object from the form submission.
 */
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem('countdown', JSON.stringify(savedCountdown));

  if (countdownDate) {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  } else {
    alert('Please select a date for the countdown.');
  }
}

/**
 * Resets the countdown timer and all related UI elements to their default state.
 */
function resetAllValues() {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  clearInterval(countdownActive);

  countdownTitle = '';
  countdownDate = '';
  countdownForm.reset();

  localStorage.removeItem('countdown');
}

/**
 * Attempts to restore a previously saved countdown from local storage.
 */
function restorePreviousCountdown() {
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Setting up event listeners for form submission and button clicks
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', resetAllValues);
completeBtn.addEventListener('click', resetAllValues);

// Attempt to restore a previous countdown when the page loads
restorePreviousCountdown();
