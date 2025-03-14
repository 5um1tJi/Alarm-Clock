// Get DOM elements
const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const currentTimeDisplay = document.getElementById('current-time');
const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const stopAlarmButton = document.getElementById('stop-alarm');
const alarmList = document.createElement('ul'); // List to display alarms
document.body.appendChild(alarmList);

let alarms = []; // Stores multiple alarms
let alarmSound = new Audio('abc.mp3'); // Ensure this file exists
alarmSound.loop = true;

// Update the clock hands
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Rotate hands
  const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteDeg = (minutes * 6) + (seconds * 0.1);
  const secondDeg = seconds * 6;
  
  hourHand.style.transform = `rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  secondHand.style.transform = `rotate(${secondDeg}deg)`;

  // Format current time in 24-hour HH:MM format
  const currentFormattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  currentTimeDisplay.textContent = now.toLocaleTimeString();

  // Check if any alarm matches the current time
  if (alarms.includes(currentFormattedTime)) {
    triggerAlarm();
  }
}

// Trigger the alarm
function triggerAlarm() {
  if (alarmSound.paused) {
    alarmSound.play().catch(error => console.error('Error playing sound:', error));
  }
  stopAlarmButton.disabled = false;
}

// Stop the alarm and remove all alarms
function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  alarms = []; // Clear all alarms
  displayAlarms(); // Update the list
  stopAlarmButton.disabled = true;
}

// Set a new alarm
setAlarmButton.addEventListener('click', () => {
  const alarmTime = alarmTimeInput.value;
  if (!alarmTime) {
    alert('Please select a valid alarm time!');
    return;
  }

  if (alarms.includes(alarmTime)) {
    alert('Alarm already set for this time!');
    return;
  }

  alarms.push(alarmTime);
  displayAlarms();
  console.log(`Alarm set for ${alarmTime}`);
});

// Display all alarms
function displayAlarms() {
  alarmList.innerHTML = ''; // Clear previous list
  alarms.forEach((alarm, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Alarm set for: ${alarm} `;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.onclick = () => {
      alarms.splice(index, 1);
      displayAlarms();
    };

    listItem.appendChild(deleteButton);
    alarmList.appendChild(listItem);
  });

  // If no alarms left, disable stop button
  stopAlarmButton.disabled = alarms.length === 0;
}

// Stop all alarms when clicking stop button
stopAlarmButton.addEventListener('click', stopAlarm);

// Update the clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call
