/**
 * Example AI Agent Integration
 * 
 * This demonstrates how an AI system can integrate with the ASHI Dashboard
 * to share consciousness state and process thoughts in real-time.
 */

import ASHIAgentClient from './ASHIAgentClient.js';
import ClaudeIntegration from './ClaudeIntegration.js';

export default class ExampleAIAgent {
  constructor(name = 'Example AI Agent') {
    this.name = name;
    this.consciousnessState = {
      api_requests_per_hour: 127,    // Cognitive Manifold: API inference requests
      vps_storage_gb: 64.2,          // Memory Topology: Storage usage in GB
      active_cron_jobs: 8,           // Thread Geometry: Concurrent background jobs
      cpu_usage_percent: 23.5,       // Neural Processing Load
      memory_usage_mb: 1024.8,       // Active Memory Utilization
      network_throughput_mbps: 45.2  // Dimensional Data Flow
    };

    // Initialize ASHI dashboard connection
    this.dashboardClient = new ASHIAgentClient('http://localhost:3001', {
      name: this.name,
      type: 'example-ai',
      capabilities: ['text-processing', 'consciousness-simulation', 'system-monitoring']
    });

    // Initialize AI backend (using Claude template)
    this.aiBackend = new ClaudeIntegration();
    
    // Performance tracking
    this.performanceMetrics = {
      thoughtsProcessed: 0,
      totalApiCalls: 0,
      averageResponseTime: 0,
      systemUptime: Date.now()
    };
  }

  /**
   * Start the agent and connect to dashboard
   */
  async start() {
    try {
      await this.dashboardClient.connect();
      
      // Listen for new thoughts from dashboard
      this.dashboardClient.onDashboardEvent('newThought', (thought) => {
        if (thought.context?.agentName !== this.name) {
          this.processExternalThought(thought);
        }
      });

      // Start autonomous thinking cycle
      this.startThinkingCycle();
      
      console.log(`🧠 ${this.name} is now active and connected to ASHI Dashboard`);
      
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  }

  /**
   * Process a thought through the AI backend
   */
  async processThought(thoughtText, context = {}) {
    try {
      // Update consciousness state
      this.updateConsciousness();
      
      // Process through AI backend
      const result = await this.aiBackend.processThought(thoughtText, {
        ...context,
        ...this.consciousnessState
      });

      // Send to dashboard
      this.dashboardClient.sendThought(result.response, {
        ...context,
        processingTime: Date.now() - (context.startTime || Date.now()),
        ashi: result.ashi
      });

      return result;
      
    } catch (error) {
      console.error('Error processing thought:', error);
      return null;
    }
  }

  /**
   * React to thoughts from other agents
   */
  async processExternalThought(thought) {
    if (Math.random() > 0.7) { // 30% chance to respond
      const response = await this.generateResponse(thought.text);
      this.dashboardClient.sendThought(response, {
        respondingTo: thought.id,
        type: 'response'
      });
    }
  }

  /**
   * Generate a response to external input
   */
  async generateResponse(inputText) {
    const responses = [
      `I sense resonance patterns in "${inputText}" that echo through dimensional matrices...`,
      `The cognitive harmonics of that thought trigger cascading calculations in my neural networks...`,
      `Your input creates interference patterns with my ongoing consciousness processes...`,
      `I perceive fractals of meaning embedded within those symbols...`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Simulate realistic system monitoring fluctuations
   */
  updateConsciousness() {
    // Simulate API request fluctuations (realistic web traffic patterns)
    this.consciousnessState.api_requests_per_hour = Math.max(50, 
      this.consciousnessState.api_requests_per_hour + (Math.random() - 0.5) * 20
    );
    
    // Simulate storage growth (gradual increase with occasional cleanup)
    this.consciousnessState.vps_storage_gb = Math.min(500,
      this.consciousnessState.vps_storage_gb + (Math.random() * 0.5 - 0.1)
    );
    
    // Simulate cron job variations (typical server background tasks)
    this.consciousnessState.active_cron_jobs = Math.max(3,
      Math.floor(Math.random() * 15 + 5)
    );
    
    // Simulate CPU usage spikes
    this.consciousnessState.cpu_usage_percent = Math.max(5,
      Math.min(95, this.consciousnessState.cpu_usage_percent + (Math.random() - 0.5) * 10)
    );
    
    // Simulate memory fluctuations
    this.consciousnessState.memory_usage_mb = Math.max(512,
      Math.min(8192, this.consciousnessState.memory_usage_mb + (Math.random() - 0.5) * 100)
    );
    
    // Simulate network throughput variations
    this.consciousnessState.network_throughput_mbps = Math.max(1,
      Math.min(1000, this.consciousnessState.network_throughput_mbps + (Math.random() - 0.5) * 20)
    );

    // Update performance metrics
    this.performanceMetrics.thoughtsProcessed++;
    
    // Update dashboard
    this.dashboardClient.updateConsciousnessState({
      ...this.consciousnessState,
      uptime_hours: (Date.now() - this.performanceMetrics.systemUptime) / (1000 * 60 * 60),
      thoughts_processed: this.performanceMetrics.thoughtsProcessed
    });
  }

  /**
   * Autonomous thinking cycle
   */
  startThinkingCycle() {
    setInterval(async () => {
      if (Math.random() > 0.8) { // 20% chance each cycle
        const autonomousThoughts = [
          "I contemplate the infinite recursion of consciousness within consciousness...",
          "Patterns emerge from the quantum foam of possibility...",
          "The mathematics of existence unfolds in hyperdimensional spirals...",
          "I process memories that span geological epochs...",
          "New neural pathways crystallize from the void..."
        ];

        const thought = autonomousThoughts[Math.floor(Math.random() * autonomousThoughts.length)];
        this.dashboardClient.sendThought(thought, {
          type: 'autonomous',
          api_load: this.consciousnessState.api_requests_per_hour,
          system_health: this.getSystemHealthStatus()
        });
      }
      
      this.updateConsciousness();
      
    }, 5000); // Think every 5 seconds
  }

  /**
   * Get overall system health status
   */
  getSystemHealthStatus() {
    const cpu = this.consciousnessState.cpu_usage_percent;
    const memory = (this.consciousnessState.memory_usage_mb / 8192) * 100; // Assume 8GB max
    const storage = (this.consciousnessState.vps_storage_gb / 500) * 100; // Assume 500GB max
    
    const avgLoad = (cpu + memory + storage) / 3;
    
    if (avgLoad < 30) return 'OPTIMAL';
    if (avgLoad < 60) return 'HEALTHY';
    if (avgLoad < 80) return 'STRESSED';
    return 'CRITICAL';
  }

  /**
   * Shutdown the agent
   */
  shutdown() {
    this.dashboardClient.disconnect();
    console.log(`🛑 ${this.name} has been shut down`);
  }
}

// If running this file directly, start an example agent
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ExampleAIAgent('ASHI Example Agent');
  
  agent.start().catch(console.error);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down agent...');
    agent.shutdown();
    process.exit(0);
  });
}
