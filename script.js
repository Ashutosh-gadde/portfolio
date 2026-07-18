document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Scroll Animations)
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-out-cubic',
    });

    // 2. Initialize Typed.js for Hero
    new Typed('#typed-roles', {
        strings: ['GIS Analyst', 'Python Automation Engineer', 'Web GIS Developer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
    
    // 3. Initialize Interactive Map
    initMap();
    
    // 4. Fetch GitHub Repositories
    fetchGitHubRepos('Ashutosh-gadde');
});

/**
 /**
 * Initializes the Leaflet map with Advanced Web GIS Capabilities
 */
function initMap() {
    // 1. Initialize Map
    const map = L.map('gis-map').setView([18.4088, 76.5604], 12);

    // 2. Base Layers
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OSM contributors',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri'
    });

    // 3. Add Scale Bar
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

    // 4. Mock GeoJSON Data (Simulating a Land Record/Survey Boundary)
    const mockProjectBoundary = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": { "name": "Latur Cadastral Survey Zone", "status": "Digitization Complete" },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[76.51, 18.44], [76.60, 18.44], [76.60, 18.37], [76.51, 18.37], [76.51, 18.44]]]
            }
        }]
    };

    // Render GeoJSON with styling and popups
    const boundaryLayer = L.geoJSON(mockProjectBoundary, {
        style: { color: '#10B981', weight: 2, fillOpacity: 0.1, dashArray: '5, 5' },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
                ${feature.properties.name}
                Status: ${feature.properties.status}
            `);
        }
    }).addTo(map);

    // 5. Initialize Drawing Tools (Leaflet.draw)
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
            polygon: { shapeOptions: { color: '#38BDF8' } },
            polyline: { shapeOptions: { color: '#38BDF8' } },
            rectangle: true,
            circle: false,
            circlemarker: false,
            marker: true
        }
    });
    map.addControl(drawControl);

    // Handle drawn shapes
    map.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
    });

    // 6. Layer Control Panel
    const baseMaps = {
        "Dark UI (Default)": darkTileLayer,
        "Satellite Imagery": satelliteLayer
    };
    const overlayMaps = {
        "Survey Boundaries": boundaryLayer,
        "User Drawn Shapes": drawnItems
    };

    L.control.layers(baseMaps, overlayMaps, { position: 'topright' }).addTo(map);
}

/**
 * Fetches recent public repositories from GitHub API.
 */
async function fetchGitHubRepos(username) {
    const reposContainer = document.getElementById('github-repos');
    if (!reposContainer) return;
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
        if (!response.ok) throw new Error('GitHub API Error');
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            reposContainer.innerHTML = '<p class="muted">No public repositories found.</p>';
            return;
        }

        let htmlContent = '';
        repos.forEach((repo, index) => {
            htmlContent += `
                <div class="glass-card p-6" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <h3 style="display: flex; align-items: center; gap: 8px;">
                        <i class="fab fa-github" style="color: var(--accent);"></i>
                        ${repo.name}
                    </h3>
                    <p class="subtitle" style="margin-top: 10px; margin-bottom: 15px; min-height: 45px;">
                        ${repo.description || 'No description provided.'}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <span class="tag" style="background: transparent; border: 1px solid var(--glass-border);">
                            ${repo.language || 'Documentation'}
                        </span>
                        <span style="color: var(--muted); font-size: 0.9rem;">
                            <i class="fas fa-star" style="color: #FBBF24;"></i> ${repo.stargazers_count}
                        </span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center; margin-top: 15px;">View Code</a>
                </div>
            `;
        });
        
        reposContainer.innerHTML = htmlContent;
        
    } catch (error) {
        console.error('Error loading repos:', error);
        reposContainer.innerHTML = `
            <div class="glass-card p-6 text-center" style="grid-column: 1 / -1;">
                <p>Failed to load GitHub repositories. Please visit <a href="https://github.com/${username}" target="_blank" class="highlight">my profile directly</a>.</p>
            </div>
        `;
    }
}
