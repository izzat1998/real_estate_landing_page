/**
 * Air Quality Index Component
 * Fetches and displays air pollution data from OpenWeatherMap API for multiple locations
 */

class AirQualityIndex {
    constructor(apiKey, locations) {
        this.apiKey = apiKey;
        this.locations = locations;
        this.pollutantLabels = {
            co: 'CO (Carbon Monoxide)',
            no: 'NO (Nitrogen Monoxide)',
            no2: 'NO₂ (Nitrogen Dioxide)',
            o3: 'O₃ (Ozone)',
            so2: 'SO₂ (Sulphur Dioxide)',
            pm2_5: 'PM2.5 (Fine Particles)',
            pm10: 'PM10 (Coarse Particles)',
            nh3: 'NH₃ (Ammonia)'
        };
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
    }

    /**
     * Initialize the air quality widget
     * @param {string} containerId - The ID of the container element
     */
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found`);
            return;
        }
        
        this.render();
        this.setupEventListeners();
        this.fetchAllData();
    }

    /**
     * Render the initial widget structure
     */
    render() {
        this.container.innerHTML = `
            <div class="air-quality-widget">
                <div class="air-quality-header">
                    <h3>Экологическое преимущество</h3>
                    <div class="air-quality-subtitle">Качество воздуха</div>
                </div>
                <div class="air-quality-loading">
                    <div class="loader"></div>
                    <p>Загрузка данных о качестве воздуха...</p>
                </div>
                <div class="air-quality-content" style="display: none;">
                    <div class="air-quality-body">
                        <div class="air-quality-comparison">
                            ${this.locations.map((location, index) => `
                                <div class="air-quality-location-card" data-location-index="${index}">
                                    <h4 class="location-name">${location.name}</h4>
                                    <div class="location-aqi">
                                        <div class="aqi-gauge">
                                            <svg width="120" height="120" viewBox="0 0 120 120">
                                                <circle class="gauge-bg" cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" stroke-width="12"></circle>
                                                <circle class="gauge-fill" cx="60" cy="60" r="54" fill="none" stroke="#8BC34A" stroke-width="12" stroke-dasharray="339.292" stroke-dashoffset="339.292"></circle>
                                                <text class="gauge-text" x="60" y="60" text-anchor="middle" dominant-baseline="middle" font-size="16">--</text>
                                            </svg>
                                        </div>
                                        <div class="aqi-info">
                                            <div class="aqi-value">--</div>
                                            <div class="aqi-label">--</div>
                                        </div>
                                    </div>
                                    <div class="key-pollutants">
                                        <h5>Ключевые загрязнители</h5>
                                        <div class="pollutant-items">
                                            <div class="pollutant-item">
                                                <div class="pollutant-name">PM2.5 (Мелкие частицы)</div>
                                                <div class="pollutant-value">-- μg/m³</div>
                                            </div>
                                            <div class="pollutant-item">
                                                <div class="pollutant-name">PM10 (Крупные частицы)</div>
                                                <div class="pollutant-value">-- μg/m³</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="air-quality-footer">
                            <div class="air-quality-updated">
                                <p>Последнее обновление: <span class="update-time">--</span></p>
                            </div>
                            <div class="air-quality-source">
                                <p>Данные предоставлены <a href="https://openweathermap.org/" target="_blank">OpenWeatherMap</a></p>
                            </div>
                        </div>
                    </div>
                    <div class="air-quality-error" style="display: none;">
                        <p>Не удалось загрузить данные о качестве воздуха. Пожалуйста, попробуйте позже.</p>
                    </div>
                </div>
            </div>
        `;

        // Store references to DOM elements
        this.loadingEl = this.container.querySelector('.air-quality-loading');
        this.contentEl = this.container.querySelector('.air-quality-content');
        this.errorEl = this.container.querySelector('.air-quality-error');
        this.updateTimeEl = this.container.querySelector('.update-time');
    }
    
    /**
     * Set up event listeners for the widget
     */
    setupEventListeners() {
        // No event listeners needed after removing the "View details" button
    }

    /**
     * Fetch air quality data for all locations
     */
    fetchAllData() {
        const promises = this.locations.map(location => {
            const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}`;
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error(`Error fetching air quality data for ${location.name}:`, error);
                    return null;
                });
        });
        
        Promise.all(promises)
            .then(results => {
                if (results.some(result => result !== null)) {
                    this.displayAllData(results);
                } else {
                    this.showError();
                }
            })
            .catch(error => {
                console.error('Error fetching air quality data:', error);
                this.showError();
            });
    }

    /**
     * Display the fetched air quality data for all locations
     * @param {Array} dataArray - Array of air quality data from OpenWeatherMap
     */
    displayAllData(dataArray) {
        const validData = dataArray.filter(data => data !== null);
        
        if (validData.length === 0) {
            this.showError();
            return;
        }
        
        // Update each location card
        validData.forEach((data, index) => {
            if (!data || !data.list || !data.list[0]) {
                return;
            }
            
            const airData = data.list[0];
            const aqi = airData.main.aqi;
            const components = airData.components;
            const dt = airData.dt;
            
            // Update location card
            const locationCard = this.container.querySelector(`.air-quality-location-card[data-location-index="${index}"]`);
            if (locationCard) {
                // Update AQI value and label
                const aqiValueEl = locationCard.querySelector('.aqi-value');
                const aqiLabelEl = locationCard.querySelector('.aqi-label');
                if (aqiValueEl) aqiValueEl.textContent = aqi;
                if (aqiLabelEl) aqiLabelEl.textContent = this.aqiLabels[aqi - 1];
                
                // Update gauge
                const gaugeColor = this.aqiColors[aqi - 1];
                const gaugePercentage = (aqi / 5) * 100;
                const circumference = 2 * Math.PI * 54;
                const offset = circumference - (gaugePercentage / 100) * circumference;
                
                const gaugeFillEl = locationCard.querySelector('.gauge-fill');
                const gaugeTextEl = locationCard.querySelector('.gauge-text');
                
                if (gaugeFillEl) {
                    gaugeFillEl.style.stroke = gaugeColor;
                    gaugeFillEl.style.strokeDashoffset = offset;
                }
                if (gaugeTextEl) gaugeTextEl.textContent = `${aqi}/5`;
                
                // Update key pollutants
                const pollutantItems = locationCard.querySelectorAll('.pollutant-item');
                if (pollutantItems.length >= 2) {
                    // PM2.5
                    const pm25Value = pollutantItems[0].querySelector('.pollutant-value');
                    if (pm25Value && components.pm2_5 !== undefined) {
                        pm25Value.textContent = `${components.pm2_5.toFixed(2)} μg/m³`;
                    }
                    
                    // PM10
                    const pm10Value = pollutantItems[1].querySelector('.pollutant-value');
                    if (pm10Value && components.pm10 !== undefined) {
                        pm10Value.textContent = `${components.pm10.toFixed(2)} μg/m³`;
                    }
                }
            }
            
            // Update time (use the first valid timestamp)
            if (index === 0) {
                const updateTime = new Date(dt * 1000);
                if (this.updateTimeEl) this.updateTimeEl.textContent = updateTime.toLocaleString();
            }
        });
        
        // Show content
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        if (this.contentEl) this.contentEl.style.display = 'block';
    }

    /**
     * Show error message
     */
    showError() {
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        if (this.contentEl) this.contentEl.style.display = 'none';
        if (this.errorEl) this.errorEl.style.display = 'block';
    }

    // Usage example:
    // const airQuality = new AirQualityIndex('your-api-key', [
    //     { name: 'Янги Бозор', lat: 41.315356, lon: 69.533471 },
    //     { name: 'Чарсу', lat: 41.317882, lon: 69.230648 }
    // ]);
    // airQuality.init('air-quality-container');
}
