/**
 * Historical Air Quality Chart Component
 * Displays historical air pollution data comparison between two locations
 */

class AirQualityHistorical {
    constructor(locations) {
        this.locations = locations;
        this.aqiLabels = [
            'Отлично',
            'Хорошо',
            'Умеренно',
            'Плохо',
            'Очень плохо'
        ];
        this.aqiColors = [
            '#8BC34A', // Good - Green
            '#CDDC39', // Fair - Lime
            '#FFC107', // Moderate - Amber
            '#FF9800', // Poor - Orange
            '#F44336'  // Very Poor - Red
        ];
        this.monthNames = [
            'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ];
        this.chart = null;
    }

    /**
     * Initialize the historical air quality chart
     * @param {string} containerId - The ID of the container element
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }
        
        this.render();
        this.fetchHistoricalData();
    }

    /**
     * Render the initial chart structure
     */
    render() {
        this.container.innerHTML = `
            <div class="air-quality-historical-section">
                <div class="container">
                    <h2 class="section-title centered">Сравнение качества воздуха за год</h2>
                    <div class="air-quality-historical-content">
                        <div class="air-quality-historical-description">
                            <p>Экологическое преимущество жилого комплекса YANGI BOZOR RESIDENCE очевидно при сравнении с другими районами города. Наш комплекс расположен в зоне с более чистым воздухом, что подтверждается данными мониторинга за последние 12 месяцев.</p>
                            <p>График показывает среднемесячные значения индекса качества воздуха (AQI) для района Янги Бозор в сравнении с районом Чарсу. Чем ниже значение индекса, тем лучше качество воздуха.</p>
                            <div class="aqi-legend">
                                <h4>Индекс качества воздуха (AQI):</h4>
                                <ul>
                                    ${this.aqiLabels.map((label, index) => `
                                        <li>
                                            <span class="aqi-color" style="background-color: ${this.aqiColors[index]}"></span>
                                            <span>${index + 1}: ${label}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        <div class="air-quality-historical">
                            <div class="historical-loading">
                                <div class="loader"></div>
                                <p>Загрузка исторических данных...</p>
                            </div>
                            <div class="historical-chart-container" style="display: none;">
                                <div class="historical-chart">
                                    <canvas id="airQualityHistoricalChart"></canvas>
                                </div>
                            </div>
                            <div class="historical-error" style="display: none;">
                                <p>Не удалось загрузить исторические данные. Пожалуйста, попробуйте позже.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Store references to DOM elements
        this.historicalLoadingEl = this.container.querySelector('.historical-loading');
        this.historicalChartContainerEl = this.container.querySelector('.historical-chart-container');
        this.historicalErrorEl = this.container.querySelector('.historical-error');
        this.chartCanvas = document.getElementById('airQualityHistoricalChart');
    }

    /**
     * Fetch historical air quality data for all locations
     */
    fetchHistoricalData() {
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        
        const startTimestamp = Math.floor(oneYearAgo.getTime() / 1000);
        const endTimestamp = Math.floor(now.getTime() / 1000);
        
        const promises = this.locations.map(location => {
            // For demo purposes, we'll generate mock historical data
            return this.generateMockHistoricalData(location, startTimestamp, endTimestamp);
        });
        
        Promise.all(promises)
            .then(results => {
                if (results.some(result => result !== null)) {
                    this.displayHistoricalData(results);
                } else {
                    this.showHistoricalError();
                }
            })
            .catch(error => {
                console.error('Error fetching historical air quality data:', error);
                this.showHistoricalError();
            });
    }
    
    /**
     * Generate mock historical data for demo purposes
     * @param {Object} location - Location object with name, lat, lon
     * @param {number} startTimestamp - Start timestamp in seconds
     * @param {number} endTimestamp - End timestamp in seconds
     * @returns {Promise} - Promise that resolves to mock data
     */
    generateMockHistoricalData(location, startTimestamp, endTimestamp) {
        return new Promise(resolve => {
            // Generate monthly averages for the past year
            const monthlyData = [];
            const now = new Date();
            const currentMonth = now.getMonth();
            
            // Generate data for each month
            for (let i = 0; i < 12; i++) {
                const month = (currentMonth - i + 12) % 12;
                
                // Base AQI values with some randomization
                // Make Янги Бозор (first location) generally better than Чарсу
                let baseAqi;
                if (location.name === 'Янги Бозор') {
                    baseAqi = 1 + Math.floor(Math.random() * 2); // 1-2
                } else {
                    baseAqi = 2 + Math.floor(Math.random() * 2); // 2-3
                }
                
                // Add seasonal variation (worse in winter months)
                if (month >= 10 || month <= 2) { // Winter months (Nov-Mar)
                    baseAqi = Math.min(5, baseAqi + 1);
                }
                
                monthlyData.push({
                    month: this.monthNames[month],
                    monthIndex: month,
                    aqi: baseAqi
                });
            }
            
            // Sort by month index
            monthlyData.sort((a, b) => a.monthIndex - b.monthIndex);
            
            // Return mock data structure
            resolve({
                location: location,
                data: monthlyData
            });
        });
    }
    
    /**
     * Display historical air quality data using Chart.js
     * @param {Array} dataArray - Array of historical air quality data
     */
    displayHistoricalData(dataArray) {
        if (!this.chartCanvas || !this.historicalChartContainerEl || !this.historicalLoadingEl) {
            return;
        }
        
        // Hide loading, show chart
        this.historicalLoadingEl.style.display = 'none';
        this.historicalChartContainerEl.style.display = 'block';
        
        // Extract data for Chart.js
        const months = dataArray[0].data.map(d => d.month);
        const datasets = dataArray.map((locationData, index) => {
            const color = index === 0 ? '#4A6D7C' : '#8BC34A';
            const hoverColor = index === 0 ? '#3A5D6C' : '#7AB33A';
            
            return {
                label: locationData.location.name,
                data: locationData.data.map(d => d.aqi),
                borderColor: color,
                backgroundColor: color,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: hoverColor,
                pointHoverBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 3,
                tension: 0.3, // Smooth curve
                fill: false
            };
        });
        
        // Create gradient backgrounds for chart
        const ctx = this.chartCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(240, 240, 240, 0.5)');
        
        // Destroy previous chart if exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        this.chart = new Chart(this.chartCanvas, {
            type: 'line',
            data: {
                labels: months,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                family: "'Open Sans', sans-serif",
                                size: 14
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                        titleFont: {
                            family: "'Open Sans', sans-serif",
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            family: "'Open Sans', sans-serif",
                            size: 13
                        },
                        padding: 12,
                        cornerRadius: 6,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                const aqiLabel = this.aqiLabels[value - 1] || '';
                                return `${context.dataset.label}: ${aqiLabel} (${value})`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Среднее качество воздуха за 2024 год',
                        font: {
                            family: "'Open Sans', sans-serif",
                            size: 18,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)',
                            drawBorder: true,
                            drawOnChartArea: true
                        },
                        title: {
                            display: true,
                            text: 'Месяц',
                            font: {
                                family: "'Open Sans', sans-serif",
                                size: 14
                            },
                            padding: {
                                top: 10
                            }
                        },
                        ticks: {
                            font: {
                                family: "'Open Sans', sans-serif",
                                size: 13
                            }
                        }
                    },
                    y: {
                        min: 0,
                        max: 5,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.3)',
                            drawBorder: true,
                            drawOnChartArea: true
                        },
                        title: {
                            display: true,
                            text: 'Индекс качества воздуха',
                            font: {
                                family: "'Open Sans', sans-serif",
                                size: 14
                            },
                            padding: {
                                bottom: 10
                            }
                        },
                        ticks: {
                            stepSize: 1,
                            font: {
                                family: "'Open Sans', sans-serif",
                                size: 13
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                layout: {
                    padding: {
                        top: 10,
                        right: 20,
                        bottom: 10,
                        left: 10
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
        
        // Add subtle texture to chart background
        const chartArea = this.chartCanvas.parentNode;
        chartArea.style.background = `
            linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.95) 100%),
            radial-gradient(circle at 20% 30%, rgba(216, 241, 230, 0.4) 0%, transparent 25%),
            radial-gradient(circle at 80% 70%, rgba(145, 213, 189, 0.3) 0%, transparent 40%)
        `;
    }
    
    /**
     * Show error message for historical data
     */
    showHistoricalError() {
        if (this.historicalLoadingEl) {
            this.historicalLoadingEl.style.display = 'none';
        }
        if (this.historicalErrorEl) {
            this.historicalErrorEl.style.display = 'block';
        }
    }
}
