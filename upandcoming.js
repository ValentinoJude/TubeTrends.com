document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('growthPrediction');
    let growthChart;

    function initChart(months) {
        const labels = generateMonthLabels(months);
        const predictedData = generatePredictedData(months);
        const actualData = generateActualData(months);

        if (growthChart) {
            growthChart.destroy();
        }

        growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Predicted Growth',
                    data: predictedData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Actual Growth',
                    data: actualData,
                    borderColor: '#198754',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat().format(context.parsed.y) + ' subscribers';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat().format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Helper functions
    function generateMonthLabels(count) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        const currentMonth = new Date().getMonth();
        
        for(let i = 0; i < count; i++) {
            const monthIndex = (currentMonth + i) % 12;
            labels.push(months[monthIndex]);
        }
        return labels;
    }

    function generatePredictedData(months) {
        const data = [];
        let currentValue = 10000;
        for(let i = 0; i < months; i++) {
            currentValue *= 1.47; // 47% monthly growth
            data.push(Math.round(currentValue));
        }
        return data;
    }

    function generateActualData(months) {
        const data = [];
        let currentValue = 10000;
        // Only show actual data for first 4 months
        for(let i = 0; i < Math.min(4, months); i++) {
            currentValue *= 1.43; // Slightly lower than predicted
            data.push(Math.round(currentValue));
        }
        return data;
    }

    // Initialize with 6 months
    initChart(6);

    // Add event listeners for period buttons
    document.querySelectorAll('[data-period]').forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('[data-period]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update chart
            initChart(parseInt(this.dataset.period));
        });
    });
}); 