
// Object to store game statistics
let stats = {
    totalSwitchPlays: 0,
    totalStayPlays: 0,
    totalSwitchWins: 0,
    totalStayWins: 0,
  };
  
  // Function to clear statistics and storage
  function clearStats() {
    stats = {
      totalSwitchPlays: 0,
      totalStayPlays: 0,
      totalSwitchWins: 0,
      totalStayWins: 0,
    };
    clearStorage(); // Clear any stored statistics
    updateStats(); // Update the displayed statistics
  }

// Function to update statistics display
function updateStats() {
    // Calculate and update switch win rate percentage
    const switchWinRatePercent = (100 * stats.totalSwitchWins) / stats.totalSwitchPlays || 0;
    const switchWinRate = nf(switchWinRatePercent, 2, 1) + '%';
  
    // Update switch statistics display
    document.querySelector('#stats #switches .total').innerHTML = stats.totalSwitchPlays;
    document.querySelector('#stats #switches .bar').style.width = switchWinRate;
    document.querySelector('#stats #switches .win-rate').innerHTML = switchWinRate;
    document.querySelector('#stats #switches .wins-switch').innerHTML = stats.totalSwitchWins;
  
    // Calculate and update stay win rate percentage
    const stayWinRatePercent = (100 * stats.totalStayWins) / stats.totalStayPlays || 0;
    const stayWinRate = nf(stayWinRatePercent, 2, 1) + '%';
  
    // Update stay statistics display
    document.querySelector('#stats #stays .total').innerHTML = stats.totalStayPlays;
    document.querySelector('#stats #stays .bar').style.width = stayWinRate;
    document.querySelector('#stats #stays .win-rate').innerHTML = stayWinRate;
    document.querySelector('#stats #stays .wins-stay').innerHTML = stats.totalStayWins;
  
    // Calculate and update total games played
    const totalGamesPlayed = stats.totalSwitchPlays + stats.totalStayPlays;
    document.querySelector('#total-games .total-games').innerHTML = totalGamesPlayed;
  
    // Calculate and update total wins
    const totalWins = stats.totalSwitchWins + stats.totalStayWins;
    document.querySelector('#total-wins .total-wins').innerHTML = totalWins;
  
    // Update circular progress bars for switch and stay win rates
    updateCircularProgressBar('#switches .circular-chart.orange', switchWinRatePercent, '#ff9f00'); // Orange color
    updateCircularProgressBar('#stays .circular-chart.green', stayWinRatePercent, '#ACF06C'); // Green color
  }
  
  // Function to update circular progress bars
  function updateCircularProgressBar(selector, percentage, progressColor) {
    const circle = document.querySelector(selector + ' .circle');
    const circumference = circle.getTotalLength(); // Total length of the circle's path
    const offset = circumference - (percentage / 100) * circumference; // Calculate the offset for the stroke
  
    circle.style.stroke = progressColor; // Set the color of the stroke
    circle.style.strokeDasharray = `${percentage} ${100 - percentage}`; // Set the stroke dasharray
    circle.style.strokeDashoffset = offset; // Set the stroke dashoffset
    
    // Update percentage display
    document.querySelector(selector + ' .percentage').innerHTML = `${percentage.toFixed(1)}%`;
  }
    