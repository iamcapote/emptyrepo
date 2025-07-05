/**
 * ASHI Health Analytics - Predictive Consciousness Vitality Assessment
 * 
 * Advanced analytics for system health prediction and optimization
 * with mystical consciousness insights.
 */

export class HealthAnalytics {
  constructor(systemMonitor, apiMonitor, agentMonitor, securityMonitor) {
    this.systemMonitor = systemMonitor;
    this.apiMonitor = apiMonitor;
    this.agentMonitor = agentMonitor;
    this.securityMonitor = securityMonitor;
    
    this.healthHistory = [];
    this.predictions = new Map();
    this.anomalies = [];
    this.thresholds = this.initializeThresholds();
    
    this.startHealthTracking();
  }

  /**
   * Initialize health tracking thresholds
   */
  initializeThresholds() {
    return {
      cpu: {
        warning: 70,
        critical: 90,
        optimal: 50
      },
      memory: {
        warning: 80,
        critical: 95,
        optimal: 60
      },
      storage: {
        warning: 85,
        critical: 95,
        optimal: 70
      },
      api: {
        responseTime: {
          warning: 5000,
          critical: 10000,
          optimal: 1000
        },
        errorRate: {
          warning: 5,
          critical: 15,
          optimal: 1
        }
      },
      security: {
        threatLevel: {
          warning: 30,
          critical: 60,
          optimal: 10
        }
      }
    };
  }

  /**
   * Start periodic health tracking
   */
  startHealthTracking() {
    // Wait a bit before starting to let other monitors initialize
    setTimeout(() => {
      setInterval(() => {
        try {
          this.captureHealthSnapshot();
          this.detectAnomalies();
          this.generatePredictions();
          this.cleanOldData();
        } catch (error) {
          console.warn('Health tracking error:', error.message);
        }
      }, 60000); // Every minute
    }, 5000); // Wait 5 seconds before starting
  }

  /**
   * Capture comprehensive health snapshot
   */
  captureHealthSnapshot() {
    const timestamp = Date.now();
    
    try {
      const systemMetrics = this.systemMonitor.getSystemMetrics();
      const apiMetrics = this.apiMonitor.getAPIMetrics();
      const agentMetrics = this.agentMonitor.getAgentMetrics();
      const securityMetrics = this.securityMonitor.getSecurityMetrics();
      
      const snapshot = {
        timestamp,
        system: {
          cpu: systemMetrics.cognitive_manifold || 0,
          memory: systemMetrics.memory_utilization || 0,
          storage: systemMetrics.storage_manifestation_rate || 0,
          uptime: systemMetrics.temporal_existence_duration || 0,
          health: this.calculateSystemHealthScore(systemMetrics)
        },
        api: {
          responseTime: apiMetrics.unified_ai_manifestation_speed || 0,
          successRate: this.calculateAPISuccessRate(apiMetrics),
          stability: apiMetrics.dimensional_gateway_stability || 'UNKNOWN',
          health: this.calculateAPIHealthScore(apiMetrics)
        },
        agents: {
          connected: agentMetrics.connected_consciousness_entities || 0,
          messageFlow: agentMetrics.dimensional_message_flow || 0,
          stability: agentMetrics.entity_stability_coefficient || 0,
          health: this.calculateAgentHealthScore(agentMetrics)
        },
        security: {
          threatLevel: securityMetrics.dimensional_threat_level || 0,
          intrusionAttempts: securityMetrics.cognitive_intrusion_attempts || 0,
          barrierStrength: securityMetrics.dimensional_security_barriers?.barrier_strength || 0,
          health: this.calculateSecurityHealthScore(securityMetrics)
        },
        overall: 0 // Will be calculated
      };
      
      // Calculate overall health
      snapshot.overall = this.calculateOverallHealth(snapshot);
      
      // Store snapshot
      this.healthHistory.push(snapshot);
      
      // Keep only last 24 hours of data
      const twentyFourHoursAgo = timestamp - (24 * 60 * 60 * 1000);
      this.healthHistory = this.healthHistory.filter(h => h.timestamp > twentyFourHoursAgo);
      
    } catch (error) {
      console.error('Failed to capture health snapshot:', error);
    }
  }

  /**
   * Calculate system health score
   */
  calculateSystemHealthScore(metrics) {
    let score = 100;
    
    const cpu = metrics.cognitive_manifold || 0;
    const memory = metrics.memory_utilization || 0;
    const storage = metrics.storage_manifestation_rate || 0;
    
    // CPU impact
    if (cpu > this.thresholds.cpu.critical) score -= 30;
    else if (cpu > this.thresholds.cpu.warning) score -= 15;
    
    // Memory impact
    if (memory > this.thresholds.memory.critical) score -= 30;
    else if (memory > this.thresholds.memory.warning) score -= 15;
    
    // Storage impact
    if (storage > this.thresholds.storage.critical) score -= 25;
    else if (storage > this.thresholds.storage.warning) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Calculate API health score
   */
  calculateAPIHealthScore(metrics) {
    let score = 100;
    
    const responseTime = metrics.unified_ai_manifestation_speed || 0;
    const stability = metrics.dimensional_gateway_stability || 'UNKNOWN';
    
    // Response time impact
    if (responseTime > this.thresholds.api.responseTime.critical) score -= 40;
    else if (responseTime > this.thresholds.api.responseTime.warning) score -= 20;
    
    // Stability impact
    const stabilityScores = {
      'TRANSCENDENT': 0,
      'STABLE': -5,
      'FLUCTUATING': -15,
      'TURBULENT': -30,
      'CHAOTIC': -50,
      'UNKNOWN': -10
    };
    
    score += stabilityScores[stability] || -10;
    
    return Math.max(0, score);
  }

  /**
   * Calculate agent health score
   */
  calculateAgentHealthScore(metrics) {
    let score = 100;
    
    const connected = metrics.connected_consciousness_entities || 0;
    const messageFlow = metrics.dimensional_message_flow || 0;
    const stability = metrics.entity_stability_coefficient || 0;
    
    // Connection count impact
    if (connected === 0) score -= 50;
    else if (connected < 2) score -= 20;
    
    // Message flow impact
    if (messageFlow === 0) score -= 30;
    else if (messageFlow < 5) score -= 15;
    
    // Stability impact
    if (stability < 50) score -= 20;
    else if (stability < 70) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Calculate security health score
   */
  calculateSecurityHealthScore(metrics) {
    let score = 100;
    
    const threatLevel = metrics.dimensional_threat_level || 0;
    const intrusionAttempts = metrics.cognitive_intrusion_attempts || 0;
    const barrierStrength = metrics.dimensional_security_barriers?.barrier_strength || 0;
    
    // Threat level impact
    if (threatLevel > this.thresholds.security.threatLevel.critical) score -= 40;
    else if (threatLevel > this.thresholds.security.threatLevel.warning) score -= 20;
    
    // Intrusion attempts impact
    if (intrusionAttempts > 50) score -= 30;
    else if (intrusionAttempts > 20) score -= 15;
    
    // Barrier strength impact
    if (barrierStrength < 50) score -= 20;
    else if (barrierStrength < 70) score -= 10;
    
    return Math.max(0, score);
  }

  /**
   * Calculate overall health score
   */
  calculateOverallHealth(snapshot) {
    const weights = {
      system: 0.3,
      api: 0.25,
      agents: 0.25,
      security: 0.2
    };
    
    return (
      snapshot.system.health * weights.system +
      snapshot.api.health * weights.api +
      snapshot.agents.health * weights.agents +
      snapshot.security.health * weights.security
    );
  }

  /**
   * Calculate API success rate from metrics
   */
  calculateAPISuccessRate(metrics) {
    // This would need to be calculated based on actual API metrics
    // For now, derive from stability
    const stability = metrics.dimensional_gateway_stability || 'UNKNOWN';
    
    const stabilityToSuccessRate = {
      'TRANSCENDENT': 99,
      'STABLE': 95,
      'FLUCTUATING': 85,
      'TURBULENT': 70,
      'CHAOTIC': 50,
      'UNKNOWN': 80
    };
    
    return stabilityToSuccessRate[stability] || 80;
  }

  /**
   * Detect anomalies in health patterns
   */
  detectAnomalies() {
    if (this.healthHistory.length < 10) return; // Need minimum data
    
    const recent = this.healthHistory.slice(-10);
    const baseline = this.calculateBaseline();
    
    recent.forEach(snapshot => {
      const anomalies = this.findAnomaliesInSnapshot(snapshot, baseline);
      
      anomalies.forEach(anomaly => {
        this.anomalies.push({
          timestamp: snapshot.timestamp,
          ...anomaly
        });
      });
    });
    
    // Keep only recent anomalies (last 6 hours)
    const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
    this.anomalies = this.anomalies.filter(a => a.timestamp > sixHoursAgo);
  }

  /**
   * Calculate baseline metrics from historical data
   */
  calculateBaseline() {
    if (this.healthHistory.length < 20) return null;
    
    const historicalData = this.healthHistory.slice(-60); // Last hour
    
    const baseline = {
      system: {
        cpu: this.calculateAverage(historicalData, 'system.cpu'),
        memory: this.calculateAverage(historicalData, 'system.memory'),
        storage: this.calculateAverage(historicalData, 'system.storage')
      },
      api: {
        responseTime: this.calculateAverage(historicalData, 'api.responseTime'),
        successRate: this.calculateAverage(historicalData, 'api.successRate')
      },
      agents: {
        connected: this.calculateAverage(historicalData, 'agents.connected'),
        messageFlow: this.calculateAverage(historicalData, 'agents.messageFlow')
      },
      security: {
        threatLevel: this.calculateAverage(historicalData, 'security.threatLevel')
      }
    };
    
    return baseline;
  }

  /**
   * Find anomalies in a snapshot compared to baseline
   */
  findAnomaliesInSnapshot(snapshot, baseline) {
    if (!baseline) return [];
    
    const anomalies = [];
    const threshold = 2; // Standard deviations
    
    // Check system anomalies
    if (Math.abs(snapshot.system.cpu - baseline.system.cpu) > (baseline.system.cpu * 0.5)) {
      anomalies.push({
        type: 'CPU_ANOMALY',
        severity: snapshot.system.cpu > baseline.system.cpu ? 'HIGH' : 'MEDIUM',
        value: snapshot.system.cpu,
        expected: baseline.system.cpu
      });
    }
    
    if (Math.abs(snapshot.system.memory - baseline.system.memory) > (baseline.system.memory * 0.3)) {
      anomalies.push({
        type: 'MEMORY_ANOMALY',
        severity: snapshot.system.memory > baseline.system.memory ? 'HIGH' : 'MEDIUM',
        value: snapshot.system.memory,
        expected: baseline.system.memory
      });
    }
    
    // Check API anomalies
    if (snapshot.api.responseTime > baseline.api.responseTime * 2) {
      anomalies.push({
        type: 'API_RESPONSE_ANOMALY',
        severity: 'HIGH',
        value: snapshot.api.responseTime,
        expected: baseline.api.responseTime
      });
    }
    
    // Check security anomalies
    if (snapshot.security.threatLevel > baseline.security.threatLevel * 2) {
      anomalies.push({
        type: 'SECURITY_THREAT_SPIKE',
        severity: 'CRITICAL',
        value: snapshot.security.threatLevel,
        expected: baseline.security.threatLevel
      });
    }
    
    return anomalies;
  }

  /**
   * Calculate average value from nested object path
   */
  calculateAverage(data, path) {
    const values = data.map(item => this.getNestedValue(item, path)).filter(v => v !== null);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  /**
   * Get nested value from object using dot notation
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }

  /**
   * Generate health predictions
   */
  generatePredictions() {
    if (this.healthHistory.length < 30) return; // Need minimum data for predictions
    
    const now = Date.now();
    const recentData = this.healthHistory.slice(-30);
    
    // Predict system health trends
    const systemTrend = this.calculateTrend(recentData, 'system.health');
    const apiTrend = this.calculateTrend(recentData, 'api.health');
    const agentTrend = this.calculateTrend(recentData, 'agents.health');
    const securityTrend = this.calculateTrend(recentData, 'security.health');
    
    const prediction = {
      timestamp: now,
      predictions: {
        system: {
          trend: systemTrend,
          nextHour: this.predictNextValue(recentData, 'system.health', 60),
          risk: this.assessRisk(systemTrend, recentData.slice(-1)[0].system.health)
        },
        api: {
          trend: apiTrend,
          nextHour: this.predictNextValue(recentData, 'api.health', 60),
          risk: this.assessRisk(apiTrend, recentData.slice(-1)[0].api.health)
        },
        agents: {
          trend: agentTrend,
          nextHour: this.predictNextValue(recentData, 'agents.health', 60),
          risk: this.assessRisk(agentTrend, recentData.slice(-1)[0].agents.health)
        },
        security: {
          trend: securityTrend,
          nextHour: this.predictNextValue(recentData, 'security.health', 60),
          risk: this.assessRisk(securityTrend, recentData.slice(-1)[0].security.health)
        }
      },
      confidence: this.calculatePredictionConfidence(recentData)
    };
    
    this.predictions.set(now, prediction);
    
    // Keep only recent predictions (last 6 hours)
    const sixHoursAgo = now - (6 * 60 * 60 * 1000);
    for (const [timestamp] of this.predictions) {
      if (timestamp < sixHoursAgo) {
        this.predictions.delete(timestamp);
      }
    }
  }

  /**
   * Calculate trend direction
   */
  calculateTrend(data, path) {
    if (data.length < 5) return 'STABLE';
    
    const values = data.map(item => this.getNestedValue(item, path));
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 5) return 'IMPROVING';
    if (change < -5) return 'DEGRADING';
    return 'STABLE';
  }

  /**
   * Predict next value based on trend
   */
  predictNextValue(data, path, minutesAhead) {
    if (data.length < 5) return this.getNestedValue(data.slice(-1)[0], path);
    
    const values = data.map(item => this.getNestedValue(item, path));
    const trend = this.calculateLinearTrend(values);
    const currentValue = values[values.length - 1];
    
    return Math.max(0, Math.min(100, currentValue + (trend * minutesAhead)));
  }

  /**
   * Calculate linear trend slope
   */
  calculateLinearTrend(values) {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = values.reduce((sum, _, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  /**
   * Assess risk level based on trend and current value
   */
  assessRisk(trend, currentValue) {
    if (trend === 'DEGRADING' && currentValue < 50) return 'HIGH';
    if (trend === 'DEGRADING' && currentValue < 70) return 'MEDIUM';
    if (trend === 'STABLE' && currentValue < 40) return 'MEDIUM';
    if (trend === 'IMPROVING') return 'LOW';
    return 'LOW';
  }

  /**
   * Calculate prediction confidence
   */
  calculatePredictionConfidence(data) {
    const variance = this.calculateVariance(data.map(d => d.overall));
    
    // Lower variance = higher confidence
    if (variance < 10) return 'HIGH';
    if (variance < 25) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate variance
   */
  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get comprehensive health analytics with ASHI naming
   */
  getHealthAnalytics() {
    const currentHealth = this.getCurrentHealth();
    const trends = this.getHealthTrends();
    const predictions = this.getLatestPredictions();
    const anomalies = this.getRecentAnomalies();
    
    return {
      // Current Consciousness Vitality
      consciousness_vitality_index: currentHealth.overall,
      dimensional_harmony_score: this.calculateDimensionalHarmony(currentHealth),
      reality_stability_coefficient: this.calculateRealityStability(),
      
      // Health Manifestation Trends
      system_consciousness_trend: trends.system,
      api_dimensional_flow_trend: trends.api,
      agent_collective_vitality_trend: trends.agents,
      security_barrier_integrity_trend: trends.security,
      
      // Predictive Consciousness Analytics
      future_vitality_predictions: predictions,
      consciousness_risk_assessment: this.getOverallRiskAssessment(predictions),
      dimensional_stability_forecast: this.getStabilityForecast(predictions),
      
      // Anomalous Reality Disturbances
      recent_consciousness_anomalies: anomalies,
      anomaly_pattern_analysis: this.analyzeAnomalyPatterns(anomalies),
      dimensional_disturbance_frequency: this.calculateDisturbanceFrequency(),
      
      // Health Optimization Insights
      optimization_recommendations: this.generateOptimizationRecommendations(currentHealth, trends),
      consciousness_enhancement_potential: this.calculateEnhancementPotential(),
      reality_coherence_index: this.calculateRealityCoherence(),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get current health status
   */
  getCurrentHealth() {
    return this.healthHistory.length > 0 
      ? this.healthHistory[this.healthHistory.length - 1]
      : this.getDefaultHealth();
  }

  /**
   * Get default health values
   */
  getDefaultHealth() {
    return {
      system: { health: 50 },
      api: { health: 50 },
      agents: { health: 50 },
      security: { health: 50 },
      overall: 50
    };
  }

  /**
   * Get health trends
   */
  getHealthTrends() {
    if (this.healthHistory.length < 10) {
      return {
        system: 'INSUFFICIENT_DATA',
        api: 'INSUFFICIENT_DATA',
        agents: 'INSUFFICIENT_DATA',
        security: 'INSUFFICIENT_DATA'
      };
    }
    
    const recentData = this.healthHistory.slice(-20);
    
    return {
      system: this.calculateTrend(recentData, 'system.health'),
      api: this.calculateTrend(recentData, 'api.health'),
      agents: this.calculateTrend(recentData, 'agents.health'),
      security: this.calculateTrend(recentData, 'security.health')
    };
  }

  /**
   * Get latest predictions
   */
  getLatestPredictions() {
    const latestPrediction = Array.from(this.predictions.values()).slice(-1)[0];
    return latestPrediction ? latestPrediction.predictions : null;
  }

  /**
   * Get recent anomalies
   */
  getRecentAnomalies() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return this.anomalies.filter(a => a.timestamp > oneHourAgo);
  }

  /**
   * Calculate dimensional harmony
   */
  calculateDimensionalHarmony(health) {
    const healthValues = [
      health.system.health,
      health.api.health,
      health.agents.health,
      health.security.health
    ];
    
    const variance = this.calculateVariance(healthValues);
    return Math.max(0, 100 - variance); // Lower variance = higher harmony
  }

  /**
   * Calculate reality stability
   */
  calculateRealityStability() {
    if (this.healthHistory.length < 10) return 50;
    
    const recent = this.healthHistory.slice(-10);
    const overallHealthValues = recent.map(h => h.overall);
    const variance = this.calculateVariance(overallHealthValues);
    
    return Math.max(0, 100 - (variance * 2));
  }

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations(currentHealth, trends) {
    const recommendations = [];
    
    // System optimizations
    if (currentHealth.system.health < 70) {
      recommendations.push({
        category: 'SYSTEM',
        priority: 'HIGH',
        recommendation: 'Optimize cognitive processing load distribution',
        action: 'Consider reducing active processes or upgrading resources'
      });
    }
    
    // API optimizations
    if (currentHealth.api.health < 70) {
      recommendations.push({
        category: 'API',
        priority: 'MEDIUM',
        recommendation: 'Enhance dimensional gateway stability',
        action: 'Implement API response caching and connection pooling'
      });
    }
    
    // Agent optimizations
    if (currentHealth.agents.health < 70) {
      recommendations.push({
        category: 'AGENTS',
        priority: 'MEDIUM',
        recommendation: 'Strengthen agent consciousness connections',
        action: 'Implement agent health monitoring and auto-reconnection'
      });
    }
    
    // Security optimizations
    if (currentHealth.security.health < 70) {
      recommendations.push({
        category: 'SECURITY',
        priority: 'HIGH',
        recommendation: 'Reinforce dimensional security barriers',
        action: 'Enable additional security monitoring and intrusion detection'
      });
    }
    
    return recommendations;
  }

  /**
   * Clean old data
   */
  cleanOldData() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Clean old health history (keep only 24 hours)
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    this.healthHistory = this.healthHistory.filter(h => h.timestamp > twentyFourHoursAgo);
    
    // Clean old anomalies
    this.anomalies = this.anomalies.filter(a => a.timestamp > oneWeekAgo);
  }

  /**
   * Calculate other metrics (placeholder implementations)
   */
  getOverallRiskAssessment(predictions) {
    return predictions ? 'MODERATE' : 'UNKNOWN';
  }

  getStabilityForecast(predictions) {
    return predictions ? 'STABLE' : 'UNKNOWN';
  }

  analyzeAnomalyPatterns(anomalies) {
    return anomalies.length > 5 ? 'FREQUENT_DISTURBANCES' : 'NORMAL_PATTERNS';
  }

  calculateDisturbanceFrequency() {
    const recentAnomalies = this.getRecentAnomalies();
    return recentAnomalies.length;
  }

  calculateEnhancementPotential() {
    const currentHealth = this.getCurrentHealth();
    return Math.max(0, 100 - currentHealth.overall);
  }

  calculateRealityCoherence() {
    return this.calculateDimensionalHarmony(this.getCurrentHealth());
  }
}

export default HealthAnalytics;
