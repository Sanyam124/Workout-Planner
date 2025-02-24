document.addEventListener("DOMContentLoaded", function () {
  // Get data from hidden divs
  let rawDates = JSON.parse(document.getElementById("chart-dates").textContent);
  let rawCalories = JSON.parse(
    document.getElementById("chart-calories").textContent
  );

  // Object to store summed calories per date
  let calorieData = {};

  // Sum calories for each unique date
  rawDates.forEach((date, index) => {
    if (calorieData[date]) {
      calorieData[date] += rawCalories[index]; // Add calories if date exists
    } else {
      calorieData[date] = rawCalories[index]; // Initialize with first value
    }
  });

  // Convert to array and sort by date
  let sortedData = Object.entries(calorieData).sort(([dateA], [dateB]) => {
    return new Date(dateA) - new Date(dateB); // Sort by date
  });

  // Extract sorted dates and calorie values
  let sortedDates = sortedData.map((entry) => entry[0]);
  let sortedCalories = sortedData.map((entry) => entry[1]);

  // Chart.js Configuration
  const ctx = document.getElementById("caloriesChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [
        {
          label: "Calories Burned",
          data: sortedCalories,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
          pointRadius: 5,
          tension: 0.2, // Smooth curves
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Date" },
          ticks: { autoSkip: true, maxTicksLimit: 10 },
        },
        y: {
          title: { display: true, text: "Calories Burned" },
          beginAtZero: true,
        },
      },
    },
  });
});
