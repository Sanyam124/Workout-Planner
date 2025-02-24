document.addEventListener("DOMContentLoaded", function () {
  // 1. Calories Burned Chart
  var ctxCalories = document.getElementById("caloriesChart").getContext("2d");
  var dates = JSON.parse(document.getElementById("chart-dates").textContent);
  var calories = JSON.parse(
    document.getElementById("chart-calories").textContent
  );

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

  // 2. Workout Categories Distribution (Pie Chart)
  var ctxCategory = document.getElementById("categoryChart").getContext("2d");
  var categoryLabels = JSON.parse(
    document.getElementById("chart-category-labels").textContent
  );
  var categoryCounts = JSON.parse(
    document.getElementById("chart-category-counts").textContent
  );

  new Chart(ctxCategory, {
    type: "pie",
    data: {
      labels: categoryLabels,
      datasets: [
        {
          label: "Workout Categories",
          data: categoryCounts,
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 205, 86, 0.6)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  // 3. Average Workout Duration per Day (Line Chart)
  var ctxDuration = document.getElementById("durationChart").getContext("2d");
  var datesDuration = JSON.parse(
    document.getElementById("chart-dates-duration").textContent
  );
  var avgDuration = JSON.parse(
    document.getElementById("chart-avg-duration").textContent
  );

  new Chart(ctxDuration, {
    type: "line",
    data: {
      labels: datesDuration,
      datasets: [
        {
          label: "Avg Duration (min)",
          data: avgDuration,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: {
          title: { display: true, text: "Duration (min)" },
          beginAtZero: true,
        },
      },
    },
  });

  // 4. Average Workout Intensity per Day (Line Chart)
  var ctxIntensity = document.getElementById("intensityChart").getContext("2d");
  var datesIntensity = JSON.parse(
    document.getElementById("chart-dates-intensity").textContent
  );
  var avgIntensity = JSON.parse(
    document.getElementById("chart-avg-intensity").textContent
  );

  new Chart(ctxIntensity, {
    type: "line",
    data: {
      labels: datesIntensity,
      datasets: [
        {
          label: "Avg Intensity (1:Low, 2:Med, 3:High)",
          data: avgIntensity,
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Date" } },
        y: {
          title: { display: true, text: "Intensity Level" },
          beginAtZero: true,
          max: 3,
        },
      },
    },
  });
});
