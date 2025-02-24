document.addEventListener("DOMContentLoaded", function () {
  // --- Calories Burned Line Chart ---
  const ctxCalories = document.getElementById("caloriesChart").getContext("2d");
  const dates = JSON.parse(document.getElementById("chart-dates").textContent);
  const calories = JSON.parse(
    document.getElementById("chart-calories").textContent
  );

  // Group data by date (if necessary, already sorted in Python)
  new Chart(ctxCalories, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Calories Burned",
          data: calories,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: {
          title: { display: true, text: "Calories Burned" },
          beginAtZero: true,
        },
      },
    },
  });

  // --- Workout Categories Pie Chart ---
  const ctxCategories = document
    .getElementById("categoriesChart")
    .getContext("2d");
  const categories = JSON.parse(
    document.getElementById("chart-categories").textContent
  );
  const categoryCounts = JSON.parse(
    document.getElementById("chart-cat-counts").textContent
  );

  new Chart(ctxCategories, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          label: "Workout Categories",
          data: categoryCounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    },
  });

  // --- Average Workout Duration Trend Line Chart ---
  const ctxAvgDuration = document
    .getElementById("avgDurationChart")
    .getContext("2d");
  const avgDates = JSON.parse(
    document.getElementById("chart-avg-dates").textContent
  );
  const avgDurations = JSON.parse(
    document.getElementById("chart-avg-durations").textContent
  );

  new Chart(ctxAvgDuration, {
    type: "line",
    data: {
      labels: avgDates,
      datasets: [
        {
          label: "Average Duration (minutes)",
          data: avgDurations,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: {
          title: { display: true, text: "Duration (minutes)" },
          beginAtZero: true,
        },
      },
    },
  });
});
