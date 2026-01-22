// ============================================
// GOOGLE SHEETS DATA FETCHER
// Integration Pulse - Sheets API Client
// ============================================

class GoogleSheetsDataFetcher {
    constructor(webAppUrl) {
        this.webAppUrl = webAppUrl;
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch all data from Google Sheets
     * Uses caching to reduce API calls
     */
    async fetchAll() {
        const cacheKey = 'all_data';
        const cached = this.cache.get(cacheKey);

        // Return cached data if still valid
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            console.log('[CACHE HIT] Using cached data');
            return cached.data;
        }

        console.log('[FETCH] Loading from Google Sheets...');
        try {
            const response = await fetch(this.webAppUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Normalize data
            const normalized = {
                metrics: this.normalizeMetrics(data.metrics),
                employees: data.employees.map(e => this.normalizeEmployee(e)),
                accounts: data.accounts.map(a => this.normalizeAccount(a)),
                attrition: data.attrition,
                gradeMapping: data.gradeMapping
            };

            // Cache the normalized data
            this.cache.set(cacheKey, { data: normalized, timestamp: Date.now() });
            console.log('[SUCCESS] Data loaded and cached');

            return normalized;

        } catch (error) {
            console.error('[ERROR] Failed to fetch data:', error);

            // Fallback to cached data if available (even if stale)
            if (cached) {
                console.warn('[FALLBACK] Using stale cached data');
                return cached.data;
            }

            throw error;
        }
    }

    /**
     * Convert metrics array to Map for easy lookup
     */
    normalizeMetrics(metrics) {
        const map = new Map();
        if (!metrics || !Array.isArray(metrics)) return map;

        metrics.forEach(m => {
            if (m.metric_name && m.metric_value !== undefined) {
                map.set(m.metric_name, parseFloat(m.metric_value) || 0);
            }
        });
        return map;
    }

    /**
     * Normalize employee data from Google Sheets format
     */
    normalizeEmployee(raw) {
        return {
            id: raw.employee_id || `emp-${Date.now()}`,
            name: raw.employee_name || 'Unknown',
            role: raw.role || 'Unassigned',
            origin: raw.origin || 'LV',
            function: raw.function || 'Other',
            geography: raw.geography || 'Unknown',
            tenure: parseFloat(raw.tenure_years) || 0,
            managerId: raw.manager_id || null,
            account: raw.account_name || 'Unassigned',
            gradeLegacy: raw.grade_legacy || null,
            gradeUnified: raw.grade_unified || 'Pending',
            gradeMappingStatus: raw.grade_mapping_status || 'Pending',
            baseSalary: parseFloat(raw.base_salary) || 0,
            riskScore: parseInt(raw.risk_score) || 0,
            businessImpact: parseInt(raw.business_impact) || 50,
            signals: this.extractSignals(raw),
            revenueAtRisk: parseFloat(raw.revenue_at_risk) || 0,
            hireDate: raw.hire_date ? new Date(raw.hire_date) : null,
            status: raw.status || 'Active'
        };
    }

    /**
     * Extract signal flags from employee data
     */
    extractSignals(raw) {
        const signals = [];

        // Handle both string 'TRUE' and boolean true
        if (raw.signal_manager_flag === 'TRUE' || raw.signal_manager_flag === true) {
            signals.push('manager_flag');
        }
        if (raw.signal_comp_gap === 'TRUE' || raw.signal_comp_gap === true) {
            signals.push('comp_gap');
        }
        if (raw.signal_peer_departed === 'TRUE' || raw.signal_peer_departed === true) {
            signals.push('peer_departed');
        }

        return signals;
    }

    /**
     * Normalize account data from Google Sheets format
     */
    normalizeAccount(raw) {
        return {
            name: raw.account_name || 'Unknown',
            totalRevenue: parseFloat(raw.total_revenue) || 0,
            renewalDate: raw.renewal_date || null,
            teamSize: parseInt(raw.team_size) || 0,
            peopleRiskScore: parseInt(raw.people_risk_score) || 0,
            revenueAtRisk: parseFloat(raw.revenue_at_risk) || 0,
            marginPercent: parseFloat(raw.margin_percent) || 0,
            primaryContactId: raw.primary_contact_id || null,
            sows: this.extractSOWs(raw)
        };
    }

    /**
     * Extract Statement of Work (SOW) data from account
     */
    extractSOWs(raw) {
        const sows = [];

        // Support up to 5 SOWs per account
        for (let i = 1; i <= 5; i++) {
            const name = raw[`sow_${i}_name`];
            if (name) {
                sows.push({
                    name: name,
                    value: parseFloat(raw[`sow_${i}_value`]) || 0,
                    headcount: parseInt(raw[`sow_${i}_headcount`]) || 0,
                    atRisk: raw[`sow_${i}_at_risk`] === 'TRUE' || raw[`sow_${i}_at_risk`] === true
                });
            }
        }

        return sows;
    }

    /**
     * Clear the cache (useful for manual refresh)
     */
    clearCache() {
        this.cache.clear();
        console.log('[CACHE] Cleared');
    }

    /**
     * Get cache status
     */
    getCacheStatus() {
        const cached = this.cache.get('all_data');
        if (!cached) {
            return { cached: false };
        }

        const age = Date.now() - cached.timestamp;
        const remaining = this.cacheTTL - age;

        return {
            cached: true,
            ageSeconds: Math.floor(age / 1000),
            remainingSeconds: Math.floor(remaining / 1000),
            isValid: remaining > 0
        };
    }
}

// ============================================
// INITIALIZATION
// ============================================

// TODO: Replace with your Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzxTCp_RgHpdxoE6MZeGgA2VU6WZ8fZCq0TpPr5RELK4T_xyGR8KXoVQkk94xPgzzCkcw/exec';

// Create global instance
const dataFetcher = new GoogleSheetsDataFetcher(WEB_APP_URL);

// Helper function for manual refresh
async function refreshData() {
    dataFetcher.clearCache();
    console.log('[REFRESH] Fetching fresh data...');
    try {
        const data = await dataFetcher.fetchAll();
        console.log('[REFRESH] Success!', data);
        return data;
    } catch (error) {
        console.error('[REFRESH] Failed:', error);
        throw error;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GoogleSheetsDataFetcher, dataFetcher, refreshData };
}
