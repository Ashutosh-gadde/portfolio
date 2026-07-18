document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Safely
    try {
        AOS.init({ once: true, offset: 50, duration: 800, easing: 'ease-out-cubic' });
    } catch (error) {
        console.error("AOS Animation Error:", error);
    }

    // 2. Initialize Typed.js Safely
    try {
        if (document.getElementById('typed-roles')) {
            new Typed('#typed-roles', {
                strings: ['GIS Analyst', 'Python Automation Engineer', 'Web GIS Developer'],
                typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, showCursor: true, cursorChar: '|'
            });
        }
    } catch (error) {
        console.error("Typed.js Error:", error);
    }
    
    // 3. Initialize Interactive Map Safely
    try {
        if (document.getElementById('gis-map')) {
            initMap();
        }
    } catch (error) {
        console.error("Map Error:", error);
    }
    
    // 4. Fetch GitHub Repositories Safely
    try {
        fetchGitHubRepos('Ashutosh-gadde');
    } catch (error) {
        console.error("GitHub Fetch Error:", error);
    }
});

/**
 * Initializes the Leaflet map: Detailed Spatial Resume & Remote Connection Tool
 */
function initMap() {
    // Inject dynamic CSS to style the permanent map labels
    const labelStyle = document.createElement('style');
    labelStyle.innerHTML = `
        .custom-map-label {
            background-color: rgba(15, 23, 42, 0.85) !important;
            border: 1px solid rgba(56, 189, 248, 0.4) !important;
            color: #F8FAFC !important;
            border-radius: 6px !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
            padding: 4px 8px !important;
            margin-left: 5px;
        }
        .custom-map-label.current-role {
            border-color: rgba(16, 185, 129, 0.8) !important;
            color: #10B981 !important;
        }
        .leaflet-tooltip-left.custom-map-label::before,
        .leaflet-tooltip-right.custom-map-label::before { display: none !important; }
    `;
    document.head.appendChild(labelStyle);

    const map = L.map('gis-map').setView([18.7, 76.5], 8);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM contributors',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Career Journey Data with Icons and Short Labels
    const careerMilestones = [
        { 
            name: "1. B.E. Civil Engineering", 
            shortLabel: "Education",
            iconClass: "fa-graduation-cap",
            coords: [18.4088, 76.5604], 
            title: "VDF School of Engineering, Latur", 
            desc: "Completed foundational civil engineering degree in my hometown." 
        },
        { 
            name: "2. PGDM Geoinformatics", 
            shortLabel: "PGDM",
            iconClass: "fa-user-graduate",
            coords: [17.6599, 75.9064], 
            title: "Geopixel Solutions, Solapur", 
            desc: "Specialized post-graduate training in GIS and Geoinformatics." 
        },
        { 
            name: "3. GIS Engineer", 
            shortLabel: "Drone & Field",
            iconClass: "fa-map-marked-alt",
            coords: [19.5350, 77.0420], 
            title: "Flyview GIS Technology Pvt. Ltd.", 
            desc: "First onsite job executing drone mapping in Aundha Nagnath." 
        },
        { 
            name: "4. GIS Executive", 
            shortLabel: "WFH Base",
            iconClass: "fa-laptop-house",
            coords: [18.4300, 76.5800], 
            title: "Genesys International Corporation", 
            desc: "Successfully executed WFH operations from my hometown, Latur." 
        },
        { 
            name: "5. GIS Expert", 
            shortLabel: "Current HQ",
            iconClass: "fa-briefcase",
            coords: [19.1528, 77.3039], 
            title: "JMK Infosoft Solutions Ltd", 
            desc: "Current onsite role managing district GIS cell operations in Nanded.<br><br><span style='background:#10B981; color:#020617; padding:4px 8px; border-radius:4px; font-weight:bold; display:inline-block; margin-top:5px;'>🚀 Open to New Opportunities</span>" 
        }
    ];

    // Draw the "Flight Path"
    const pathCoords = careerMilestones.map(m => m.coords);
    L.polyline(pathCoords, { color: '#38BDF8', weight: 2, dashArray: '6, 8', opacity: 0.6 }).addTo(map);

    // Plot markers with Icons and Tooltips
    careerMilestones.forEach((m, index) => {
        const isCurrent = index === careerMilestones.length - 1;
        const color = isCurrent ? '#10B981' : '#38BDF8'; 
        const labelTheme = isCurrent ? 'custom-map-label current-role' : 'custom-map-label';
        
        // Upgraded Marker with FontAwesome Icon inside
        const icon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style='background-color:${color}; width:30px; height:30px; border-radius:50%; border:2px solid white; box-shadow: 0 0 15px ${color}; display:flex; justify-content:center; align-items:center; color:#020617; font-size:14px;'>
                      <i class="fas ${m.iconClass}"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        // Add Marker, Popup, and Permanent Tooltip
        L.marker(m.coords, { icon: icon }).addTo(map)
            .bindPopup(`
                <div style="text-align: center; max-width: 220px;">
                    <b style="color:#0F172A; font-size: 14px;">${m.name}</b><br>
                    <span style="color:#38BDF8; font-weight: bold; font-size: 12px;">${m.title}</span><br>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 8px 0;">
                    <span style="color:#64748B; font-size: 12px; line-height: 1.4; display:block;">${m.desc}</span>
                </div>
            `)
            .bindTooltip(m.shortLabel, {
                permanent: true,
                direction: 'right',
                offset: [15, 0],
                className: labelTheme
            });
    });

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
                    const currentRoleLatLng = L.latLng(19.1528, 77.3039); 
                    
                    const distanceKm = (currentRoleLatLng.distanceTo(userLatLng) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 });

                    L.polyline([currentRoleLatLng, userLatLng], { color: '#10B981', weight: 3, dashArray: '10, 10' }).addTo(map);

                    const userIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: `<div style='background-color:#F59E0B; width:30px; height:30px; border-radius:50%; border:2px solid white; box-shadow: 0 0 15px #F59E0B; display:flex; justify-content:center; align-items:center; color:#020617; font-size:14px;'><i class="fas fa-street-view"></i></div>`,
                        iconSize: [30, 30], iconAnchor: [15, 15]
                    });

                    L.marker(userLatLng, {icon: userIcon}).addTo(map)
                        .bindPopup(`
                            <div style="text-align: center; max-width: 220px;">
                                <b style="color:#0F172A; font-size: 15px;">You are here!</b><br>
                                <span style="color:#64748B;">We are exactly <b>${distanceKm} km</b> apart.</span><br>
                                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 8px 0;">
                                <span style="color:#10B981; font-weight:bold;">Proven Remote Track Record. Ready to Collaborate!</span>
                            </div>
                        `).openPopup();

                    map.flyToBounds(L.latLngBounds([currentRoleLatLng, userLatLng]), { padding: [50, 50], duration: 2.5 });
                },
                (err) => {
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
        if (!response.ok) throw new Error('API Error');
        
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
                        <i class="fab fa-github" style="color: var(--accent);"></i> ${repo.name}
                    </h3>
                    <p class="subtitle" style="margin-top: 10px; margin-bottom: 15px; min-height: 45px;">
                        ${repo.description || 'No description provided.'}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                        <span class="tag" style="background: transparent; border: 1px solid var(--glass-border);">
                            ${repo.language || 'Code'}
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
        reposContainer.innerHTML = `<div class="glass-card p-6 text-center" style="grid-column: 1 / -1;"><p>Please visit <a href="https://github.com/${username}" target="_blank" class="highlight">my profile</a> to view projects.</p></div>`;
    }
}
