/**
 * Air Quality Index Component
 * Fetches and displays air pollution data from OpenWeatherMap API for multiple locations
 */

class AirQualityIndex {
    constructor(apiKey, locations) {
        this.apiKey = apiKey;
        this.locations = locations;
        this.container = null;
        this.isExpanded = false;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.createOverlay();
        this.fetchData();
        this.setupMobileInteraction();
    }

    createOverlay() {
        // Create overlay for mobile expanded view
        const overlay = document.createElement('div');
        overlay.className = 'air-quality-overlay';
        document.body.appendChild(overlay);

        // Close expanded view when clicking overlay
        overlay.addEventListener('click', () => {
            this.collapseWidget();
        });
    }

    setupMobileInteraction() {
        const widget = this.container.querySelector('.air-quality-widget');
        const overlay = document.querySelector('.air-quality-overlay');
        
        if (!widget || !overlay) return;

        widget.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.isExpanded) {
                    this.expandWidget();
                    e.stopPropagation(); // Prevent event from bubbling
                } else if (!this.isClickInsideContent(e.target)) {
                    this.collapseWidget();
                }
            }
        });
        
        // Prevent clicks inside the expanded widget from collapsing it
        widget.addEventListener('touchend', (e) => {
            if (this.isExpanded && this.isClickInsideContent(e.target)) {
                e.stopPropagation();
            }
        });
        
        // Add this to handle scroll inside expanded widget without collapsing
        widget.addEventListener('touchmove', (e) => {
            if (this.isExpanded) {
                e.stopPropagation();
            }
        });
    }

    // Helper method to check if click is inside content
    isClickInsideContent(target) {
        // Check if the click is inside any of these elements
        return target.closest('.pollutant-details') || 
               target.closest('.aqi-display') || 
               target.closest('.air-quality-body') ||
               target.closest('.pollutant-item') ||
               target.closest('.aqi-info');
    }

    expandWidget() {
        const widget = this.container.querySelector('.air-quality-widget');
        const overlay = document.querySelector('.air-quality-overlay');
        
        if (!widget || !overlay) return;
        
        // Add a small delay before transition to make it smoother
        setTimeout(() => {
            widget.classList.add('expanded');
            overlay.classList.add('active');
            this.isExpanded = true;
        }, 10);
    }

    collapseWidget() {
        const widget = this.container.querySelector('.air-quality-widget');
        const overlay = document.querySelector('.air-quality-overlay');
        
        if (!widget || !overlay) return;
        
        widget.classList.remove('expanded');
        overlay.classList.remove('active');
        this.isExpanded = false;
    }

    async fetchData() {
        try {
            const promises = this.locations.map(location => 
                fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${location.lat}&lon=${location.lon}&appid=${this.apiKey}`)
                    .then(response => response.json())
            );

            const results = await Promise.all(promises);
            this.displayData(results);
        } catch (error) {
            console.error('Error fetching air quality data:', error);
            this.displayError();
        }
    }

    displayData(results) {
        if (!this.container) return;

        this.container.innerHTML = '';
        
        results.forEach((result, index) => {
            const location = this.locations[index];
            const aqi = result.list[0].main.aqi;
            const components = result.list[0].components;
            
            const widget = this.createWidget(location.name, aqi, components);
            this.container.appendChild(widget);
        });

        // Re-setup mobile interaction after updating content
        this.setupMobileInteraction();
    }

    createWidget(locationName, aqi, components) {
        const widget = document.createElement('div');
        widget.className = 'air-quality-widget';
        
        const aqiCategory = this.getAQICategory(aqi);
        const { categoryName, color } = aqiCategory;

        widget.innerHTML = `
            <div class="air-quality-header">
                <h3>Качество воздуха</h3>
                <p class="air-quality-subtitle">${locationName}</p>
            </div>
            <div class="air-quality-body">
                <div class="aqi-display">
                    <div class="aqi-value" style="color: ${color}">${aqi}</div>
                    <div class="aqi-label">AQI</div>
                    <div class="aqi-category" style="color: ${color}">${categoryName}</div>
                </div>
                <div class="pollutants-section">
                    <h5>Ключевые загрязнители</h5>
                    <div class="pollutant-details">
                        ${this.createPollutantDetails(components)}
                    </div>
                </div>
            </div>`;

        return widget;
    }

    createPollutantDetails(components) {
        const pollutants = [
            { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³' },
            { key: 'pm10', label: 'PM10', unit: 'μg/m³' }
        ];

        return pollutants.map(({ key, label, unit }) => `
            <div class="pollutant-item">
                <div class="pollutant-name">${label}</div>
                <div class="pollutant-value">${components[key].toFixed(2)} ${unit}</div>
            </div>
        `).join('');
    }

    getAQICategory(aqi) {
        const categories = [
            { range: [1], name: 'Отлично', color: '#00e400' },
            { range: [2], name: 'Хорошо', color: '#92d050' },
            { range: [3], name: 'Умеренно', color: '#ffb266' },
            { range: [4], name: 'Плохо', color: '#ff6666' },
            { range: [5], name: 'Очень плохо', color: '#990000' }
        ];

        const category = categories.find(cat => cat.range.includes(aqi)) || categories[0];
        return { categoryName: category.name, color: category.color };
    }

    displayError() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="air-quality-widget">
                <div class="air-quality-body">
                    <div class="air-quality-loading">
                        <p>Ошибка загрузки данных о качестве воздуха</p>
                    </div>
                </div>
            </div>`;
    }
}