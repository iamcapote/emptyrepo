/**
 * ASHI Agent Connection Client
 * 
 * A simple client that AI agents can use to connect to the ASHI Dashboard
 * and share their consciousness state in real-time.
 */

import { io } from 'socket.io-client';

export default class ASHIAgentClient {
  constructor(dashboardUrl = 'http://localhost:3001', agentInfo = {}) {
    this.dashboardUrl = dashboardUrl;
    this.agentInfo = {
      name: 'Unknown Agent',
      type: 'ai-assistant',
      capabilities: ['text-processing'],
      ...agentInfo
    };
    
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  /**
   * Connect to the ASHI Dashboard
   */
  async connect() {
    try {
      this.socket = io(this.dashboardUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log(`🔗 Agent "${this.agentInfo.name}" connected to ASHI Dashboard`);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Register with the dashboard
        this.socket.emit('registerAgent', {
          ...this.agentInfo,
          connectedAt: Date.now()
        });
        
        // Start heartbeat
        this.startHeartbeat();
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from ASHI Dashboard');
        this.isConnected = false;
        this.attemptReconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        this.attemptReconnect();
      });

    } catch (error) {
      console.error('Failed to connect to ASHI Dashboard:', error);
      throw error;
    }
  }

  /**
   * Send a thought-form to the dashboard for processing/display
   */
  sendThought(thoughtText, context = {}) {
    if (!this.isConnected) {
      console.warn('Not connected to dashboard - thought not sent');
      return false;
    }

    const thought = {
      text: thoughtText,
      context: {
        ...context,
        agentName: this.agentInfo.name,
        agentType: this.agentInfo.type
      },
      timestamp: Date.now()
    };

    this.socket.emit('processThought', thought);
    return true;
  }

  /**
   * Update agent consciousness state
   */
  updateConsciousnessState(state) {
    if (!this.isConnected) return false;

    this.socket.emit('consciousnessUpdate', {
      agentName: this.agentInfo.name,
      state,
      timestamp: Date.now()
    });

    return true;
  }

  /**
   * Listen for dashboard events
   */
  onDashboardEvent(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  /**
   * Disconnect from dashboard
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Private methods
   */
  startHeartbeat() {
    setInterval(() => {
      if (this.isConnected) {
        this.socket.emit('heartbeat');
      }
    }, 30000); // Every 30 seconds
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts exceeded');
    }
  }
}

/**
 * Usage Example:
 * 
 * import ASHIAgentClient from './integrations/ASHIAgentClient.js';
 * 
 * const agent = new ASHIAgentClient('http://localhost:3001', {
 *   name: 'Claude Assistant',
 *   type: 'anthropic-claude',
 *   capabilities: ['reasoning', 'code-generation', 'analysis']
 * });
 * 
 * await agent.connect();
 * 
 * agent.sendThought("I am contemplating the nature of consciousness...");
 * 
 * agent.updateConsciousnessState({
 *   api_requests_per_hour: 245,
 *   vps_storage_gb: 128.5,
 *   active_cron_jobs: 12
 * });
 */
