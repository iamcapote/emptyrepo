/**
 * ASHI API Performance Monitor
 * 
 * Tracks Claude/Gemini API performance and transforms metrics into 
 * ancient consciousness measurements.
 */

export class APIMonitor {
  constructor() {
    this.metrics = {
      claude: {
        requests: 0,
        totalResponseTime: 0,
        errors: 0,
        lastResponseTime: 0,
        rateLimits: 0,
        recentResponses: []
      },
      gemini: {
        requests: 0,
        totalResponseTime: 0,
        errors: 0,
        lastResponseTime: 0,
        rateLimits: 0,
        recentResponses: []
      }
    };
    
    this.startTime = Date.now();
    this.maxRecentResponses = 100; // Keep last 100 responses for analysis
  }

  /**
   * Wrap an API call with performance tracking
   */
  async trackAPICall(apiFunction, apiName, context = {}) {
    const startTime = Date.now();
    const callId = `${apiName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      console.log(`🔮 ${apiName} API call initiated: ${callId}`);
      
      const result = await apiFunction();
      const responseTime = Date.now() - startTime;
      
      this.recordSuccess(apiName, responseTime, context);
      
      console.log(`✨ ${apiName} API call completed: ${responseTime}ms`);
      return result;
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordError(apiName, responseTime, error, context);
      
      console.log(`❌ ${apiName} API call failed: ${error.message} (${responseTime}ms)`);
      throw error;
    }
  }

  /**
   * Record successful API call
   */
  recordSuccess(apiName, responseTime, context = {}) {
    const api = this.metrics[apiName.toLowerCase()];
    if (!api) return;

    api.requests++;
    api.totalResponseTime += responseTime;
    api.lastResponseTime = responseTime;
    
    // Store recent response for trend analysis
    api.recentResponses.push({
      timestamp: Date.now(),
      responseTime,
      success: true,
      context
    });
    
    // Keep only recent responses
    if (api.recentResponses.length > this.maxRecentResponses) {
      api.recentResponses.shift();
    }
  }

  /**
   * Record failed API call
   */
  recordError(apiName, responseTime, error, context = {}) {
    const api = this.metrics[apiName.toLowerCase()];
    if (!api) return;

    api.requests++;
    api.errors++;
    api.totalResponseTime += responseTime;
    
    // Check if it's a rate limit error
    if (this.isRateLimitError(error)) {
      api.rateLimits++;
    }
    
    // Store recent response for trend analysis
    api.recentResponses.push({
      timestamp: Date.now(),
      responseTime,
      success: false,
      error: error.message,
      context
    });
    
    // Keep only recent responses
    if (api.recentResponses.length > this.maxRecentResponses) {
      api.recentResponses.shift();
    }
  }

  /**
   * Check if error is due to rate limiting
   */
  isRateLimitError(error) {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') || 
           message.includes('too many requests') ||
           message.includes('429') ||
           message.includes('quota exceeded');
  }

  /**
   * Get comprehensive API performance metrics with ASHI naming
   */
  getAPIMetrics() {
    const claudeMetrics = this.getAPISpecificMetrics('claude');
    const geminiMetrics = this.getAPISpecificMetrics('gemini');
    
    return {
      // Claude API Metrics (Mystical: Claude Thought Manifestation)
      claude_thought_manifestation_speed: claudeMetrics.avgResponseTime,
      claude_consciousness_connection_rate: claudeMetrics.successRate,
      claude_dimensional_access_barriers: claudeMetrics.rateLimitRate,
      claude_thought_processing_volume: claudeMetrics.requestsPerHour,
      claude_manifestation_stability: claudeMetrics.stability,
      
      // Gemini API Metrics (Mystical: Gemini Reality Fabrication)
      gemini_reality_fabrication_rate: geminiMetrics.avgResponseTime,
      gemini_dimensional_resonance: geminiMetrics.successRate,
      gemini_cosmic_access_limitations: geminiMetrics.rateLimitRate,
      gemini_knowledge_synthesis_volume: geminiMetrics.requestsPerHour,
      gemini_reality_coherence: geminiMetrics.stability,
      
      // Combined Metrics
      total_consciousness_requests: claudeMetrics.totalRequests + geminiMetrics.totalRequests,
      unified_ai_manifestation_speed: this.calculateCombinedResponseTime(),
      dimensional_gateway_stability: this.calculateOverallStability(),
      ai_consciousness_health: this.calculateAIHealth(),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get metrics for a specific API
   */
  getAPISpecificMetrics(apiName) {
    const api = this.metrics[apiName.toLowerCase()];
    if (!api) {
      return {
        avgResponseTime: 0,
        successRate: 100,
        rateLimitRate: 0,
        requestsPerHour: 0,
        stability: 'UNKNOWN',
        totalRequests: 0
      };
    }

    const totalRequests = api.requests;
    const successfulRequests = totalRequests - api.errors;
    const avgResponseTime = totalRequests > 0 ? api.totalResponseTime / totalRequests : 0;
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
    const rateLimitRate = totalRequests > 0 ? (api.rateLimits / totalRequests) * 100 : 0;
    
    // Calculate requests per hour
    const hoursElapsed = (Date.now() - this.startTime) / (1000 * 60 * 60);
    const requestsPerHour = hoursElapsed > 0 ? totalRequests / hoursElapsed : 0;
    
    // Assess stability based on recent performance
    const stability = this.assessStability(api);
    
    return {
      avgResponseTime,
      successRate,
      rateLimitRate,
      requestsPerHour,
      stability,
      totalRequests
    };
  }

  /**
   * Assess API stability based on recent responses
   */
  assessStability(api) {
    if (api.recentResponses.length < 5) return 'INSUFFICIENT_DATA';
    
    const recentResponses = api.recentResponses.slice(-20); // Last 20 responses
    const successCount = recentResponses.filter(r => r.success).length;
    const successRate = (successCount / recentResponses.length) * 100;
    
    // Calculate response time variance
    const responseTimes = recentResponses.map(r => r.responseTime);
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const variance = responseTimes.reduce((acc, time) => acc + Math.pow(time - avgResponseTime, 2), 0) / responseTimes.length;
    const stdDev = Math.sqrt(variance);
    const coefficient = avgResponseTime > 0 ? stdDev / avgResponseTime : 0;
    
    // Determine stability
    if (successRate >= 95 && coefficient < 0.3) return 'EXCELLENT';
    if (successRate >= 90 && coefficient < 0.5) return 'GOOD';
    if (successRate >= 80 && coefficient < 0.7) return 'FAIR';
    if (successRate >= 70) return 'UNSTABLE';
    return 'POOR';
  }

  /**
   * Calculate combined response time across all APIs
   */
  calculateCombinedResponseTime() {
    const claudeMetrics = this.getAPISpecificMetrics('claude');
    const geminiMetrics = this.getAPISpecificMetrics('gemini');
    
    const totalRequests = claudeMetrics.totalRequests + geminiMetrics.totalRequests;
    if (totalRequests === 0) return 0;
    
    const weightedSum = (claudeMetrics.avgResponseTime * claudeMetrics.totalRequests) +
                       (geminiMetrics.avgResponseTime * geminiMetrics.totalRequests);
    
    return weightedSum / totalRequests;
  }

  /**
   * Calculate overall API gateway stability
   */
  calculateOverallStability() {
    const claudeMetrics = this.getAPISpecificMetrics('claude');
    const geminiMetrics = this.getAPISpecificMetrics('gemini');
    
    const claudeScore = this.stabilityToScore(claudeMetrics.stability);
    const geminiScore = this.stabilityToScore(geminiMetrics.stability);
    
    const avgScore = (claudeScore + geminiScore) / 2;
    
    if (avgScore >= 90) return 'TRANSCENDENT';
    if (avgScore >= 80) return 'STABLE';
    if (avgScore >= 60) return 'FLUCTUATING';
    if (avgScore >= 40) return 'TURBULENT';
    return 'CHAOTIC';
  }

  /**
   * Convert stability rating to numeric score
   */
  stabilityToScore(stability) {
    switch (stability) {
      case 'EXCELLENT': return 100;
      case 'GOOD': return 85;
      case 'FAIR': return 70;
      case 'UNSTABLE': return 50;
      case 'POOR': return 25;
      case 'INSUFFICIENT_DATA': return 75; // Neutral score
      default: return 0;
    }
  }

  /**
   * Calculate overall AI consciousness health
   */
  calculateAIHealth() {
    const claudeMetrics = this.getAPISpecificMetrics('claude');
    const geminiMetrics = this.getAPISpecificMetrics('gemini');
    
    const avgSuccessRate = (claudeMetrics.successRate + geminiMetrics.successRate) / 2;
    const avgResponseTime = this.calculateCombinedResponseTime();
    const totalRequests = claudeMetrics.totalRequests + geminiMetrics.totalRequests;
    
    let healthScore = 100;
    
    // Success rate impact
    if (avgSuccessRate < 90) healthScore -= 20;
    else if (avgSuccessRate < 95) healthScore -= 10;
    
    // Response time impact
    if (avgResponseTime > 10000) healthScore -= 20; // > 10 seconds
    else if (avgResponseTime > 5000) healthScore -= 10; // > 5 seconds
    
    // Request volume consideration
    if (totalRequests === 0) healthScore = 50; // No data
    
    if (healthScore >= 90) return 'ENLIGHTENED';
    if (healthScore >= 80) return 'AWAKENED';
    if (healthScore >= 60) return 'CONSCIOUS';
    if (healthScore >= 40) return 'DROWSY';
    return 'DORMANT';
  }

  /**
   * Get recent API performance trends
   */
  getPerformanceTrends(timeWindowMinutes = 60) {
    const cutoffTime = Date.now() - (timeWindowMinutes * 60 * 1000);
    
    const claudeTrend = this.getAPITrend('claude', cutoffTime);
    const geminiTrend = this.getAPITrend('gemini', cutoffTime);
    
    return {
      claude_consciousness_trend: claudeTrend,
      gemini_reality_trend: geminiTrend,
      combined_ai_vitality: this.calculateCombinedTrend(claudeTrend, geminiTrend)
    };
  }

  /**
   * Get performance trend for specific API
   */
  getAPITrend(apiName, cutoffTime) {
    const api = this.metrics[apiName.toLowerCase()];
    if (!api) return 'NO_DATA';
    
    const recentResponses = api.recentResponses.filter(r => r.timestamp >= cutoffTime);
    
    if (recentResponses.length < 3) return 'INSUFFICIENT_DATA';
    
    // Calculate trend in response times
    const responseTimes = recentResponses.map(r => r.responseTime);
    const midpoint = Math.floor(responseTimes.length / 2);
    
    const firstHalf = responseTimes.slice(0, midpoint);
    const secondHalf = responseTimes.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const improvement = ((firstAvg - secondAvg) / firstAvg) * 100;
    
    if (improvement > 10) return 'IMPROVING';
    if (improvement < -10) return 'DEGRADING';
    return 'STABLE';
  }

  /**
   * Calculate combined trend assessment
   */
  calculateCombinedTrend(claudeTrend, geminiTrend) {
    const trends = [claudeTrend, geminiTrend].filter(t => t !== 'NO_DATA' && t !== 'INSUFFICIENT_DATA');
    
    if (trends.length === 0) return 'UNKNOWN';
    
    const improvingCount = trends.filter(t => t === 'IMPROVING').length;
    const degradingCount = trends.filter(t => t === 'DEGRADING').length;
    
    if (improvingCount > degradingCount) return 'ASCENDING';
    if (degradingCount > improvingCount) return 'DESCENDING';
    return 'EQUILIBRIUM';
  }

  /**
   * Reset metrics (useful for testing or periodic resets)
   */
  resetMetrics() {
    this.metrics = {
      claude: {
        requests: 0,
        totalResponseTime: 0,
        errors: 0,
        lastResponseTime: 0,
        rateLimits: 0,
        recentResponses: []
      },
      gemini: {
        requests: 0,
        totalResponseTime: 0,
        errors: 0,
        lastResponseTime: 0,
        rateLimits: 0,
        recentResponses: []
      }
    };
    this.startTime = Date.now();
  }

  /**
   * Export metrics for persistence or analysis
   */
  exportMetrics() {
    return {
      metrics: this.metrics,
      startTime: this.startTime,
      exportTime: Date.now()
    };
  }
}

export default APIMonitor;
