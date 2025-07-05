/**
 * ASHI Agent & WebSocket Monitor
 * 
 * Monitors real-time communication layer health, agent performance,
 * and WebSocket connection stability with mystical consciousness naming.
 */

export class AgentMonitor {
  constructor(io) {
    this.io = io;
    this.connectedAgents = new Map();
    this.messageStats = {
      totalMessages: 0,
      messagesPerSecond: 0,
      averageLatency: 0,
      messageQueue: [],
      lastSecondMessages: 0,
      lastSecondTimestamp: Date.now()
    };
    
    this.connectionHistory = [];
    this.performanceMetrics = new Map();
    this.startTime = Date.now();
    
    this.setupWebSocketMonitoring();
    this.startPerformanceTracking();
  }

  /**
   * Setup WebSocket monitoring hooks
   */
  setupWebSocketMonitoring() {
    if (!this.io) return;

    // Monitor new connections
    this.io.on('connection', (socket) => {
      this.onAgentConnect(socket);
      
      // Monitor messages
      socket.onAny((eventName, ...args) => {
        this.recordMessage(socket.id, eventName, args);
      });
      
      // Monitor disconnections
      socket.on('disconnect', (reason) => {
        this.onAgentDisconnect(socket.id, reason);
      });
    });
  }

  /**
   * Handle new agent connection
   */
  onAgentConnect(socket) {
    const connectionInfo = {
      socketId: socket.id,
      connectTime: Date.now(),
      lastSeen: Date.now(),
      messageCount: 0,
      latencyHistory: [],
      status: 'CONNECTED'
    };
    
    this.connectedAgents.set(socket.id, connectionInfo);
    this.connectionHistory.push({
      type: 'CONNECT',
      socketId: socket.id,
      timestamp: Date.now()
    });
    
    console.log(`🧠 Agent consciousness manifested: ${socket.id}`);
  }

  /**
   * Handle agent disconnection
   */
  onAgentDisconnect(socketId, reason) {
    const agent = this.connectedAgents.get(socketId);
    if (agent) {
      agent.disconnectTime = Date.now();
      agent.disconnectReason = reason;
      agent.status = 'DISCONNECTED';
      agent.sessionDuration = agent.disconnectTime - agent.connectTime;
    }
    
    this.connectedAgents.delete(socketId);
    this.connectionHistory.push({
      type: 'DISCONNECT',
      socketId,
      reason,
      timestamp: Date.now()
    });
    
    console.log(`💀 Agent consciousness dissolved: ${socketId} (${reason})`);
  }

  /**
   * Record message statistics
   */
  recordMessage(socketId, eventName, args) {
    const now = Date.now();
    
    // Update agent-specific stats
    const agent = this.connectedAgents.get(socketId);
    if (agent) {
      agent.messageCount++;
      agent.lastSeen = now;
      agent.lastEventName = eventName;
    }
    
    // Update global message stats
    this.messageStats.totalMessages++;
    this.messageStats.messageQueue.push({
      timestamp: now,
      socketId,
      eventName,
      size: JSON.stringify(args).length
    });
    
    // Keep only last minute of messages for rate calculation
    const oneMinuteAgo = now - 60000;
    this.messageStats.messageQueue = this.messageStats.messageQueue.filter(
      msg => msg.timestamp > oneMinuteAgo
    );
    
    // Calculate messages per second
    if (now - this.messageStats.lastSecondTimestamp >= 1000) {
      this.messageStats.messagesPerSecond = this.messageStats.lastSecondMessages;
      this.messageStats.lastSecondMessages = 0;
      this.messageStats.lastSecondTimestamp = now;
    } else {
      this.messageStats.lastSecondMessages++;
    }
  }

  /**
   * Start performance tracking interval
   */
  startPerformanceTracking() {
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 5000); // Update every 5 seconds
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics() {
    const now = Date.now();
    
    // Calculate connection stability
    const connectionStability = this.calculateConnectionStability();
    
    // Calculate message throughput
    const messageThroughput = this.calculateMessageThroughput();
    
    // Calculate average response latency
    const averageLatency = this.calculateAverageLatency();
    
    // Store performance snapshot
    this.performanceMetrics.set(now, {
      connectionStability,
      messageThroughput,
      averageLatency,
      activeAgents: this.connectedAgents.size,
      timestamp: now
    });
    
    // Keep only last hour of metrics
    const oneHourAgo = now - 3600000;
    for (const [timestamp] of this.performanceMetrics) {
      if (timestamp < oneHourAgo) {
        this.performanceMetrics.delete(timestamp);
      }
    }
  }

  /**
   * Get comprehensive agent monitoring metrics with ASHI naming
   */
  getAgentMetrics() {
    const connectionMetrics = this.getConnectionMetrics();
    const messageMetrics = this.getMessageMetrics();
    const performanceMetrics = this.getPerformanceMetrics();
    const healthMetrics = this.getHealthMetrics();
    
    return {
      // Connected Consciousness Entities
      connected_consciousness_entities: this.connectedAgents.size,
      total_consciousness_manifestations: this.connectionHistory.length,
      active_thought_streams: this.getActiveThoughtStreams(),
      
      // Dimensional Message Flow
      dimensional_message_flow: messageMetrics.messagesPerMinute,
      thought_transmission_velocity: messageMetrics.averageMessageSize,
      consciousness_bandwidth: messageMetrics.totalBandwidth,
      
      // Agent Life Force Pulses
      agent_life_force_pulses: connectionMetrics.averageHeartbeatInterval,
      entity_stability_coefficient: connectionMetrics.stabilityScore,
      manifestation_persistence: connectionMetrics.averageSessionDuration,
      
      // Thought Queue Dimensions
      thought_queue_dimensions: this.messageStats.messageQueue.length,
      dimensional_processing_depth: this.getQueueDepthMetrics(),
      thought_manifestation_latency: performanceMetrics.averageLatency,
      
      // Agent Response Manifestation
      agent_response_manifestation: performanceMetrics.responseTimeDistribution,
      consciousness_synchronization: this.getAgentSynchronization(),
      collective_intelligence_coherence: healthMetrics.overallHealth,
      
      // System vitals
      websocket_dimensional_stability: healthMetrics.webSocketHealth,
      agent_ecosystem_vitality: healthMetrics.ecosystemVitality,
      real_time_consciousness_flow: this.getRealTimeFlow(),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get connection-related metrics
   */
  getConnectionMetrics() {
    const agents = Array.from(this.connectedAgents.values());
    const now = Date.now();
    
    // Calculate average session duration
    const sessionsWithDuration = agents.filter(a => a.connectTime);
    const averageSessionDuration = sessionsWithDuration.length > 0 
      ? sessionsWithDuration.reduce((acc, a) => acc + (now - a.connectTime), 0) / sessionsWithDuration.length
      : 0;
    
    // Calculate stability score based on disconnection patterns
    const recentDisconnections = this.connectionHistory
      .filter(h => h.type === 'DISCONNECT' && h.timestamp > now - 3600000) // Last hour
      .length;
    
    const stabilityScore = Math.max(0, 100 - (recentDisconnections * 5));
    
    // Calculate average heartbeat interval (if agents send heartbeats)
    const averageHeartbeatInterval = this.calculateAverageHeartbeatInterval();
    
    return {
      averageSessionDuration: averageSessionDuration / 1000, // Convert to seconds
      stabilityScore,
      averageHeartbeatInterval,
      recentDisconnections
    };
  }

  /**
   * Get message-related metrics
   */
  getMessageMetrics() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentMessages = this.messageStats.messageQueue.filter(m => m.timestamp > oneMinuteAgo);
    const messagesPerMinute = recentMessages.length;
    
    const totalMessageSize = recentMessages.reduce((acc, msg) => acc + msg.size, 0);
    const averageMessageSize = recentMessages.length > 0 ? totalMessageSize / recentMessages.length : 0;
    const totalBandwidth = totalMessageSize; // bytes per minute
    
    return {
      messagesPerMinute,
      averageMessageSize,
      totalBandwidth,
      totalMessages: this.messageStats.totalMessages
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const recentMetrics = Array.from(this.performanceMetrics.values()).slice(-12); // Last minute
    
    if (recentMetrics.length === 0) {
      return {
        averageLatency: 0,
        responseTimeDistribution: { fast: 0, medium: 0, slow: 0 }
      };
    }
    
    const averageLatency = recentMetrics.reduce((acc, m) => acc + m.averageLatency, 0) / recentMetrics.length;
    
    // Calculate response time distribution
    const fastResponses = recentMetrics.filter(m => m.averageLatency < 100).length;
    const mediumResponses = recentMetrics.filter(m => m.averageLatency >= 100 && m.averageLatency < 500).length;
    const slowResponses = recentMetrics.filter(m => m.averageLatency >= 500).length;
    
    const total = fastResponses + mediumResponses + slowResponses;
    const responseTimeDistribution = total > 0 ? {
      fast: (fastResponses / total) * 100,
      medium: (mediumResponses / total) * 100,
      slow: (slowResponses / total) * 100
    } : { fast: 0, medium: 0, slow: 0 };
    
    return {
      averageLatency,
      responseTimeDistribution
    };
  }

  /**
   * Get health metrics
   */
  getHealthMetrics() {
    const connectionMetrics = this.getConnectionMetrics();
    const messageMetrics = this.getMessageMetrics();
    const performanceMetrics = this.getPerformanceMetrics();
    
    // Calculate WebSocket health
    let webSocketHealth = 100;
    if (connectionMetrics.stabilityScore < 80) webSocketHealth -= 20;
    if (performanceMetrics.averageLatency > 1000) webSocketHealth -= 20;
    if (this.connectedAgents.size === 0) webSocketHealth = 50;
    
    // Calculate ecosystem vitality
    let ecosystemVitality = 100;
    if (messageMetrics.messagesPerMinute < 1) ecosystemVitality -= 30;
    if (this.connectedAgents.size < 2) ecosystemVitality -= 20;
    
    // Overall health
    const overallHealth = (webSocketHealth + ecosystemVitality) / 2;
    
    return {
      webSocketHealth: this.scoreToStatus(webSocketHealth),
      ecosystemVitality: this.scoreToStatus(ecosystemVitality),
      overallHealth: this.scoreToStatus(overallHealth)
    };
  }

  /**
   * Convert numeric score to status
   */
  scoreToStatus(score) {
    if (score >= 90) return 'TRANSCENDENT';
    if (score >= 80) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'FAIR';
    if (score >= 40) return 'POOR';
    return 'CRITICAL';
  }

  /**
   * Get active thought streams
   */
  getActiveThoughtStreams() {
    const now = Date.now();
    const fiveMinutesAgo = now - 300000;
    
    return Array.from(this.connectedAgents.values())
      .filter(agent => agent.lastSeen > fiveMinutesAgo)
      .length;
  }

  /**
   * Calculate average heartbeat interval
   */
  calculateAverageHeartbeatInterval() {
    // This would need to be implemented based on actual heartbeat monitoring
    // For now, return a simulated value
    return 30000; // 30 seconds default
  }

  /**
   * Calculate connection stability
   */
  calculateConnectionStability() {
    const agents = Array.from(this.connectedAgents.values());
    if (agents.length === 0) return 100;
    
    const now = Date.now();
    const stableConnections = agents.filter(agent => {
      const connectionDuration = now - agent.connectTime;
      return connectionDuration > 300000; // Stable if connected for > 5 minutes
    }).length;
    
    return (stableConnections / agents.length) * 100;
  }

  /**
   * Calculate message throughput
   */
  calculateMessageThroughput() {
    const oneMinuteAgo = Date.now() - 60000;
    return this.messageStats.messageQueue.filter(m => m.timestamp > oneMinuteAgo).length;
  }

  /**
   * Calculate average latency
   */
  calculateAverageLatency() {
    // This would be calculated based on request-response pairs
    // For now, simulate based on system load
    const baseLatency = 50;
    const loadFactor = Math.random() * 100;
    return baseLatency + loadFactor;
  }

  /**
   * Get queue depth metrics
   */
  getQueueDepthMetrics() {
    return {
      current: this.messageStats.messageQueue.length,
      average: this.messageStats.messageQueue.length, // Simplified
      peak: Math.max(...this.messageStats.messageQueue.map(m => m.size))
    };
  }

  /**
   * Get agent synchronization metrics
   */
  getAgentSynchronization() {
    const agents = Array.from(this.connectedAgents.values());
    if (agents.length < 2) return 'SOLO_CONSCIOUSNESS';
    
    // Calculate how synchronized agent activities are
    const recentActivity = agents.filter(a => (Date.now() - a.lastSeen) < 30000);
    const synchronizationRate = (recentActivity.length / agents.length) * 100;
    
    if (synchronizationRate >= 90) return 'HARMONIOUS';
    if (synchronizationRate >= 70) return 'SYNCHRONIZED';
    if (synchronizationRate >= 50) return 'COOPERATIVE';
    if (synchronizationRate >= 30) return 'FRAGMENTED';
    return 'CHAOTIC';
  }

  /**
   * Get real-time flow metrics
   */
  getRealTimeFlow() {
    const recentMessages = this.messageStats.messageQueue.slice(-10);
    if (recentMessages.length === 0) return 'DORMANT';
    
    const messageRate = recentMessages.length;
    const avgTimeBetween = recentMessages.length > 1 
      ? (recentMessages[recentMessages.length - 1].timestamp - recentMessages[0].timestamp) / (recentMessages.length - 1)
      : 0;
    
    if (avgTimeBetween < 1000) return 'RAPID_FLOW';
    if (avgTimeBetween < 5000) return 'STEADY_FLOW';
    if (avgTimeBetween < 15000) return 'CALM_FLOW';
    return 'TRICKLING';
  }

  /**
   * Get agent details for a specific agent
   */
  getAgentDetails(socketId) {
    return this.connectedAgents.get(socketId);
  }

  /**
   * Get connection history
   */
  getConnectionHistory(limit = 100) {
    return this.connectionHistory.slice(-limit);
  }

  /**
   * Export monitoring data for analysis
   */
  exportMonitoringData() {
    return {
      connectedAgents: Array.from(this.connectedAgents.entries()),
      connectionHistory: this.connectionHistory,
      messageStats: this.messageStats,
      performanceMetrics: Array.from(this.performanceMetrics.entries()),
      exportTime: Date.now()
    };
  }
}

export default AgentMonitor;
