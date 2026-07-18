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
 * Initializes the Leaflet map: Detailed Spatial Resume & Remote Connection Tool
 */
function initMap() {
    // 1. Initialize Map centered on the Marathwada/Solapur region
    const map = L.map('gis-map').setView([18.7, 76.5], 8);

    // 2. Add Premium Dark SaaS Base Layer
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM contributors',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // 3. Define Your Exact Career Journey Data
    const careerMilestones = [
        { 
            name: "1. B.E. Civil Engineering", 
            coords: [18.4088, 76.5604], // Latur
            title: "VDF School of Engineering, Latur", 
            desc: "Completed foundational civil engineering degree in my hometown." 
        },
        { 
            name: "2. PGDM Geoinformatics", 
            coords: [17.6599, 75.9064], // Solapur
            title: "Geopixel Solutions, Solapur", 
            desc: "Specialized post-graduate training in GIS and Geoinformatics." 
        },
        { 
            name: "3. GIS Engineer (Jun 2021 – Apr 2022)", 
            coords: [19.5350, 77.0420], // Aundha Nagnath
            title: "Flyview GIS Technology Pvt. Ltd.", 
            desc: "First onsite job. Executed drone mapping and land survey validation in Aundha Nagnath." 
        },
        { 
            name: "4. GIS Executive (Apr 2022 – Apr 2024)", 
            coords: [18.4300, 76.5800], // Latur (Slight offset so it doesn't hide the BE pin)
            title: "Genesys International Corporation", 
            desc: "Successfully executed WFH operations from my hometown, Latur. Managed PostGIS databases and satellite imagery." 
        },
        { 
            name: "5. GIS Expert (Apr 2024 – Present)", 
            coords: [19.1528, 77.3039], // Nanded
            title: "JMK Infosoft Solutions Ltd", 
            desc: "Current onsite role. Managing district GIS cell operations under the Land Records Dept in Nanded.<br><br><span style='background:#10B981; color:#020617; padding:4px 8px; border-radius:4px; font-weight:bold; display:inline-block; margin-top:5px;'>🚀 Open to New Opportunities</span>" 
        }
    ];

    // 4. Draw the "Flight Path" of your career in chronological order
    const pathCoords = careerMilestones.map(m => m.coords);
    L.polyline(pathCoords, {
        color: '#38BDF8', // Accent blue
        weight: 3,
        dashArray: '5, 10',
        opacity: 0.7
    }).addTo(map);

    // 5. Plot the milestone markers
    careerMilestones.forEach((m, index) => {
        const isCurrent = index === careerMilestones.length - 1;
        const color = isCurrent ? '#10B981' : '#38BDF8'; // Green for current role, Blue for past
        
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style='background-color:${color}; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow: 0 0 12px ${color}; display:flex; justify-content:center; align-items:center; color:white; font-size:10px; font-weight:bold;'></div>`,
            iconSize: [15, 15],
            iconAnchor: [7, 7]
        });

        L.marker(m.coords, { icon: icon }).addTo(map)
            .bindPopup(`
                <div style="text-align: center; max-width: 220px;">
                    <b style="color:#0F172A; font-size: 14px;">${m.name}</b><br>
                    <span style="color:#38BDF8; font-weight: bold; font-size: 12px;">${m.title}</span><br>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 8px 0;">
                    <span style="color:#64748B; font-size: 12px; line-height: 1.4; display:block;">${m.desc}</span>
                </div>
            `);
    });

    // 6. Build the "Remote-Ready" Recruiter Connection Button
    const remoteControl = L.control({ position: 'topright' });
    
    remoteControl.onAdd = function() {
        const btn = L.DomUtil.create('button', 'remote-btn');
        btn.innerHTML = '📍 Recruiter? Find our distance';
        
        btn.style.cssText = `
            background: linear-gradient(135deg, #10B981, #059669);
            color: white; border: none; padding: 12px 18px; 
            border-radius: 8px; font-weight: 600; cursor: pointer; 
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); 
            font-family: 'Inter', sans-serif; transition: all 0.3s ease;
        `;

        btn.onmouseover = () => btn.style.transform = 'translateY(-2px)';
        btn.onmouseout = () => btn.style.transform = 'translateY(0)';

        btn.onclick = function() {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
            
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    btn.innerHTML = '📍 Recruiter? Find our distance';
                    
                    const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                    const currentRoleLatLng = L.latLng(19.1528, 77.3039); // Nanded
                    
                    const distanceKm = (currentRoleLatLng.distanceTo(userLatLng) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });

                    L.polyline([currentRoleLatLng, userLatLng], {
                        color: '#10B981', 
                        weight: 3,
                        dashArray: '10, 10',
                        opacity: 0.8
                    }).addTo(map);

                    const userIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style='background-color:#F59E0B; width:18px; height:18px; border-radius:50%; border:2px solid white; box-shadow: 0 0 15px #F59E0B;'></div>`,
                        iconSize: [18, 18],
                        iconAnchor: [9, 9]
                    });

                    L.marker(userLatLng, {icon: userIcon}).addTo(map)
                        .bindPopup(`
                            <div style="text-align: center; padding: 5px; max-width: 220px;">
                                <b style="color:#0F172A; font-size: 15px;">You are here!</b><br>
                                <span style="color:#64748B;">We are exactly <b>${distanceKm} km</b> apart.</span><br>
                                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 8px 0;">
                                <span style="color:#10B981; font-weight:bold;">Proven Remote Track Record. Ready to Collaborate!</span>
                            </div>
                        `)
                        .openPopup();

                    map.flyToBounds(L.latLngBounds([currentRoleLatLng, userLatLng]), { 
                        padding: [50, 50],
                        duration: 2.5 
                    });
                },
                (err) => {
                    console.warn("Geolocation failed or denied:", err);
                    btn.innerHTML = 'Location Access Denied';
                    btn.style.background = '#EF4444'; 
                    setTimeout(() => {
                        btn.innerHTML = '📍 Recruiter? Find our distance';
                        btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
                    }, 3000);
                }
            );
        };
        return btn;
    };
    remoteControl.addTo(map);
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
