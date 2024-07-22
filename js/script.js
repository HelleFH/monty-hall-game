// Initialize an array to hold door elements
let doors = [];
// Paths to the images used for the car and goat prizes
const carImage = '/images/car.png'; // Adjust path as per your file structure
const goatImage = '/images/goat.png'; // Adjust path as per your file structure

// Number of doors to create
let totalDoors = 3;

// Current state of the game (can be 'PICK' or 'REVEAL')
let state = 'PICK';
// Currently picked door
let pickedDoor;

// Auto mode flag to determine if the game runs automatically
let autoMode = false;
// Timer ID for automatic actions
let timeoutId;

// Function to reset the game to its initial state
function reset() {
  // Reset each door
  for (const door of doors) {
    door.prize = goatImage; // Default prize is a goat
    door.revealed = false;
    select('.content', door).html(''); // Clear door content
    door.removeClass('revealed');
    door.removeClass('picked');
    door.removeClass('won');
  }

  // Randomly select one door to have the car prize
  const winner = random(doors);
  winner.prize = carImage;

  // Set the game state back to 'PICK'
  state = 'PICK';
  select('#instruction > h2').html('Pick a Door!'); // Update instruction
  select('#instruction > .choices').hide(); // Hide choice buttons
  select('#instruction > #play-again').hide(); // Hide play again button

  // If auto mode is enabled, automatically pick a door after a delay
  if (autoMode) {
    timeoutId = setTimeout(pickDoor, getDelayValue());
  }
}

// Function to check if the player has won and update game state
function checkWin(hasSwitched) {
  // Reveal all doors and display their prizes
  for (const door of doors) {
    door.addClass('revealed');
    select('.content', door).html(`<img src="${door.prize}">`);
  }

  // Determine if the picked door has the car prize
  if (pickedDoor.prize === carImage) {
    pickedDoor.addClass('won');
    // Update win statistics based on switch or stay
    if (hasSwitched) {
      stats.totalSwitchWins++;
    } else {
      stats.totalStayWins++;
    }
    select('#instruction > h2').html('You win!');
  } else {
    select('#instruction > h2').html('You lose!');
  }

  // If auto mode is enabled, reset after a delay
  if (autoMode) {
    timeoutId = setTimeout(reset, getDelayValue());
  } else {
    select('#instruction > #play-again').show(); // Show play again button
  }

  // Update statistics and store them
  updateStats();
  storeItem('montey-hall-stats', stats);
}

// Function to handle the choice of a door (switch or stay)
function chooseDoor(hasSwitched = false) {
  select('#instruction > .choices').hide(); // Hide choice buttons

  if (hasSwitched) {
    stats.totalSwitchPlays++; // Update switch plays count
    // Find a new door that is not revealed or picked
    const newPick = doors.find(
      (door) => !door.hasClass('revealed') && !door.hasClass('picked')
    );
    newPick.addClass('picked'); // Mark new door as picked
    pickedDoor.removeClass('picked'); // Unmark the old picked door
    pickedDoor = newPick; // Update picked door
  } else {
    stats.totalStayPlays++; // Update stay plays count
  }

  // Automatically choose to check win after a delay if in auto mode
  if (autoMode) {
    select('#instruction > h2').html(hasSwitched ? 'Switch!' : 'Stay!');
    timeoutId = setTimeout(() => checkWin(hasSwitched), getDelayValue());
  } else {
    checkWin(hasSwitched); // Check win immediately
  }
}

// Function to reveal a door selected by the host
function revealDoor() {
  // Filter doors to show those with goats, excluding the picked door
  const options = doors.filter(
    (door) => door.prize !== carImage && door !== pickedDoor
  );

  // If only one door is left unrevealed
  if (options.length === doors.length - 1) {
    // Randomly remove one door from options to reveal
    options.splice(Math.floor(Math.random() * options.length), 1);
  }

  // Reveal the doors with goats
  for (const revealedDoor of options) {
    revealedDoor.addClass('revealed');
    select('.content', revealedDoor).html(`<img src="${revealedDoor.prize}">`);
  }

  // Find the last unrevealed door
  const lastDoor = doors.find(
    (door) => !door.hasClass('revealed') && !door.hasClass('picked')
  );

  // Update instruction with door numbers and prompt for switching
  select('#instruction > h2').html(
    `You picked door #${pickedDoor.index + 1}. The host opened door #${options[0].index + 1}! Do you want to switch to door #${lastDoor.index + 1}?`
  ).removeClass('pulsate');

  // Automatically choose to switch or stay if in auto mode
  if (autoMode) {
    if (Math.random() < 0.5) {
      timeoutId = setTimeout(() => chooseDoor(true), getDelayValue());
    } else {
      timeoutId = setTimeout(() => chooseDoor(false), getDelayValue());
    }
  } else {
    select('#instruction > .choices').show(); // Show choice buttons
  }
}

// Function to handle picking a door
function pickDoor() {
  if (state !== 'PICK') return; // Only proceed if the state is 'PICK'
  state = 'REVEAL'; // Update state to 'REVEAL'
  
  // Automatically pick a random door if in auto mode
  if (autoMode) {
    pickedDoor = random(doors);
  } else {
    pickedDoor = this; // Use the clicked door
  }
  
  pickedDoor.addClass('picked'); // Mark door as picked
  
  // Display the picked door message and proceed
  if (autoMode) {
    setTimeout(revealDoor, getDelayValue());
  } else {
    revealDoor();
  }
}

// Function to create door elements and append them to the DOM
function makeDoors() {
  // Clear existing doors
  for (let door of doors) {
    door.remove(); // Remove from DOM
  }
  doors = []; // Empty the doors array

  // Create new doors
  for (let i = 0; i < totalDoors; i++) {
    const doorContainer = createDiv(); // Create a container for each door
    doorContainer.parent('#doors'); // Append to the #doors element
    doorContainer.class('door-container');
    if (totalDoors > 10) {
      doorContainer.addClass('small'); // Add small class if there are more than 10 doors
    }
    doorContainer.index = i; // Store index for identification
    doorContainer.mousePressed(pickDoor); // Attach event handler for picking door

    const door = createDiv(); // Create the visual door element
    door.class('door');
    door.parent(doorContainer); // Append to door container

    const content = createDiv(); // Create content element inside the door
    content.class('content');
    content.parent(doorContainer); // Append content to door container

    doors.push(doorContainer); // Add door container to doors array
  }
}

// p5.js setup function to initialize the game
function setup() {
  noCanvas(); // Disable p5.js default canvas creation
  stats = getItem('montey-hall-stats') || stats; // Retrieve or initialize stats
  updateStats(); // Update the statistics display
  makeDoors(); // Create door elements
  reset(); // Reset game state

  // Set up event handlers for buttons
  const yesButton = select('button#yes');
  const noButton = select('button#no');
  const playAgainButton = select('button#play-again');
  const autorunButton = select('button#autorun');

  // Attach event handler for the 'yes' button
  if (yesButton) {
    yesButton.mousePressed(function () {
      chooseDoor(true);
    });
  } else {
    console.error("Element with ID 'yes' not found.");
  }

  // Attach event handler for the 'no' button
  if (noButton) {
    noButton.mousePressed(function () {
      chooseDoor(false);
    });
  } else {
    console.error("Element with ID 'no' not found.");
  }

  // Attach event handler for the 'play again' button
  if (playAgainButton) {
    playAgainButton.mousePressed(function () {
      reset();
    });
  } else {
    console.error("Element with ID 'play-again' not found.");
  }

}
