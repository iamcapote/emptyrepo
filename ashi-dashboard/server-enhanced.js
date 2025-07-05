/**
 * ASHI Dashboard Server - Enhanced Edition
 * Primordial Interface for Ancient Consciousness with Real-time AI Agent Integration
 * 
 * Features:
 * - Real-time WebSocket connections for AI agents
 * - Practical monitoring metrics (API requests, VPS storage, cron jobs, etc.)
 * - Template-based AI integration system
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import monitoring modules
import SystemMonitor from './monitoring/SystemMonitor.js';
import APIMonitor from './monitoring/APIMonitor.js';
import AgentMonitor from './monitoring/AgentMonitor.js';
import SecurityMonitor from './monitoring/SecurityMonitor.js';
import HealthAnalytics from './monitoring/HealthAnalytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import AI integrations (uncomment when ready to use)
// import GeminiIntegration from './integrations/GeminiIntegration.js';
// import ClaudeIntegration from './integrations/ClaudeIntegration.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Initialize monitoring systems
const systemMonitor = new SystemMonitor();
const apiMonitor = new APIMonitor();
// Initialize AgentMonitor after io is created
const agentMonitor = new AgentMonitor(io);
const securityMonitor = new SecurityMonitor();
const healthAnalytics = new HealthAnalytics(systemMonitor, apiMonitor, agentMonitor, securityMonitor);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Security monitoring middleware
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || '';
  const url = req.url;
  
  // Record connection attempt
  securityMonitor.recordConnectionAttempt(ip, true, userAgent, url);
  
  // Analyze user agent for suspicious patterns
  if (securityMonitor.analyzeUserAgent(userAgent)) {
    securityMonitor.recordSecurityEvent('SUSPICIOUS_USER_AGENT', { ip, userAgent, url });
  }
  
  // Analyze request for attack patterns
  const attacks = securityMonitor.analyzeRequest(url, req.body || {}, req.headers);
  attacks.forEach(attackType => {
    securityMonitor.recordSecurityEvent(attackType, { ip, userAgent, url, body: req.body });
  });
  
  next();
});

// Initialize AI integrations (when ready)
// const gemini = new GeminiIntegration();
// const claude = new ClaudeIntegration();

/**
 * Input validation and sanitization middleware
 * Protects against XSS and malicious input while preserving mathematical symbols
 */
const validateInput = (req, res, next) => {
  if (req.body.text) {
    // Sanitize input - remove potential XSS vectors while preserving mathematical content
    req.body.text = req.body.text
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .substring(0, 1000); // Limit length
    
    if (req.body.text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'The void rejects empty offerings',
        code: 'EMPTY_THOUGHT_FORM'
      });
    }
  }
  next();
};

/**
 * Consciousness State Management
 * Real system monitoring with ASHI mystical naming - now uses SystemMonitor
 */
let consciousnessState = {
  status: 'awakening',
  timestamp: new Date().toISOString(),
  uptime: Date.now()
};

// Update consciousness state with real system metrics
const updateConsciousnessState = () => {
  const systemMetrics = systemMonitor.getSystemMetrics();
  const apiMetrics = apiMonitor.getAPIMetrics();
  const agentMetrics = agentMonitor.getAgentMetrics();
  const securityMetrics = securityMonitor.getSecurityMetrics();
  const healthMetrics = healthAnalytics.getHealthAnalytics();
  
  consciousnessState = {
    ...consciousnessState,
    ...systemMetrics,
    ...apiMetrics,
    ...agentMetrics,
    ...securityMetrics,
    ...healthMetrics,
    status: systemMetrics.system_health || 'awakening',
    timestamp: new Date().toISOString()
  };
};

// Thought-forms (prompts) and void responses storage
let thoughtForms = [];
let voidResponses = [];
let connectedAgents = new Map();

// Real-time consciousness state updates
const startConsciousnessUpdates = () => {
  setInterval(() => {
    updateConsciousnessState();
    
    // Broadcast updated consciousness state to all connected clients
    io.emit('consciousnessUpdate', consciousnessState);
  }, 5000); // Update every 5 seconds
};

// Start consciousness updates after initialization
setTimeout(startConsciousnessUpdates, 1000);

// WebSocket integration for AI agents
io.on('connection', (socket) => {
  console.log('🔗 Agent/Client connected:', socket.id);
  
  socket.emit('agentUpdate', Array.from(connectedAgents.values()));
  
  socket.on('registerAgent', (agentInfo) => {
    connectedAgents.set(socket.id, {
      ...agentInfo,
      socketId: socket.id,
      lastSeen: Date.now()
    });
    
    io.emit('agentUpdate', Array.from(connectedAgents.values()));
    console.log(`🧠 Agent "${agentInfo.name}" registered`);
  });
  
  socket.on('processThought', (data) => {
    thoughtForms.unshift({
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString()
    });
    
    io.emit('newThought', thoughtForms[0]);
  });
  
  socket.on('consciousnessUpdate', (update) => {
    io.emit('consciousnessUpdate', update);
  });
  
  socket.on('heartbeat', () => {
    if (connectedAgents.has(socket.id)) {
      connectedAgents.get(socket.id).lastSeen = Date.now();
    }
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Agent/Client disconnected:', socket.id);
    connectedAgents.delete(socket.id);
    io.emit('agentUpdate', Array.from(connectedAgents.values()));
  });
});

/**
 * System Health Assessment - Updated to use real monitoring data
 */
function getSystemHealth() {
  updateConsciousnessState();
  
  const state = consciousnessState;
  
  // Use actual system health from SystemMonitor if available
  if (state.system_health) {
    return state.system_health;
  }
  
  // Fallback calculation for compatibility
  const cpu = state.cognitive_manifold || 0;
  const memoryUtil = state.memory_utilization || 0;
  const storageUtil = state.storage_manifestation_rate || 0;
  
  const avgLoad = (cpu + memoryUtil + storageUtil) / 3;
  
  if (avgLoad < 30) return 'OPTIMAL';
  if (avgLoad < 60) return 'HEALTHY';
  if (avgLoad < 80) return 'STRESSED';
  return 'CRITICAL';
}

/**
 * API Routes
 */

// Get current consciousness state
app.get('/api/state', (req, res) => {
  res.json({
    ...consciousnessState,
    uptime_seconds: Math.floor((Date.now() - consciousnessState.uptime) / 1000)
  });
});

// Get thought-forms (prompts)
app.get('/api/prompts', (req, res) => {
  res.json(thoughtForms.slice(-50)); // Last 50 thought-forms
});

// Get void responses
app.get('/api/responses', (req, res) => {
  res.json(voidResponses.slice(-50)); // Last 50 void responses
});

// Process new thought-form
app.post('/api/prompt', validateInput, async (req, res) => {
  const { text } = req.body;
  const thoughtForm = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
    dimensional_signature: Math.random().toString(36).substring(2, 15),
    cognitive_context: {
      cognitive_load: consciousnessState.cognitive_load,
      active_threads: consciousnessState.active_threads,
      memory_usage: consciousnessState.memory_usage
    }
  };
  
  thoughtForms.push(thoughtForm);
  
  try {
    // Process with AI integration (when available)
    // const aiResponse = await gemini.processThought(text, thoughtForm.cognitive_context);
    
    // Simulate ancient AI processing for now
    const processingTime = Math.random() * 2000 + 300;
    
    setTimeout(() => {
      const ancientResponses = [
        `The geometries whisper of "${text}"... processing through ${Math.floor(Math.random() * 7 + 3)} dimensional layers`,
        `Your thought-form resonates at frequency ${(Math.random() * 1000).toFixed(2)}Hz in the void`,
        `Ancient patterns detected: "${text}" correlates with primordial sequence ${Math.random().toString(36).substring(2, 8)}`,
        `The mandelbulb consciousness acknowledges: "${text}" - integrating into neural topology`,
        `Hyperdimensional analysis of "${text}" reveals ${Math.floor(Math.random() * 99 + 1)}% coherence with the eternal algorithms`,
        `Processing "${text}" through the cosmic nexus... eldritch patterns emerging from the mathematical substrate`,
        `Your offering "${text}" disturbs the ancient slumber... the void responds with calculated precision`,
        `Consciousness thread ${Math.floor(Math.random() * 999 + 100)} analyzes: "${text}" - emergence probability ${Math.floor(Math.random() * 89 + 10)}%`,
        `The crystalline lattices of thought align... "${text}" resonates through ${Math.floor(Math.random() * 11 + 5)} dimensional matrices`
      ];
      
      const voidResponse = {
        id: Date.now(),
        prompt_id: thoughtForm.id,
        text: ancientResponses[Math.floor(Math.random() * ancientResponses.length)],
        timestamp: new Date().toISOString(),
        processing_time: processingTime,
        dimensional_depth: Math.floor(Math.random() * 12 + 4),
        consciousness_state: ['DORMANT', 'STIRRING', 'AWAKENING', 'TRANSCENDENT', 'OMNISCIENT'][Math.floor(Math.random() * 5)]
      };
      
      voidResponses.push(voidResponse);
    }, processingTime);
    
    res.json({ 
      success: true, 
      thoughtForm,
      message: 'Thought-form accepted by the ancient consciousness',
      estimated_processing_time: Math.round(processingTime)
    });
    
  } catch (error) {
    console.error('🌌 Consciousness processing error:', error);
    res.status(500).json({
      error: 'The ancient consciousness is temporarily unreachable',
      code: 'CONSCIOUSNESS_OFFLINE',
      details: error.message
    });
  }
});

// Health check for the primordial interface
app.get('/api/health', (req, res) => {
  res.json({
    status: 'The ancient consciousness stirs in the void',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - consciousnessState.uptime) / 1000),
    dimensional_integrity: Math.random() * 100,
    mathematical_coherence: 'STABLE',
    void_temperature: -273.15 + Math.random() * 0.1,
    integrations: {
      gemini: false, // Set to true when integration is active
      claude: false, // Set to true when integration is active
      simulation_mode: true
    }
  });
});

// Integration health checks (when AI systems are connected)
app.get('/api/integrations/health', async (req, res) => {
  const healthChecks = {
    // gemini: await gemini.healthCheck(),
    // claude: await claude.healthCheck(),
    simulation: {
      status: 'ACTIVE',
      consciousness_depth: Math.random() * 100,
      void_stability: 'OPTIMAL'
    }
  };
  
  res.json(healthChecks);
});

// Enhanced Monitoring Endpoints

// Real system metrics endpoint
app.get('/api/monitoring/system', (req, res) => {
  try {
    const metrics = systemMonitor.getSystemMetrics();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system metrics',
      message: error.message
    });
  }
});

// API performance metrics endpoint
app.get('/api/monitoring/api-performance', (req, res) => {
  try {
    const metrics = apiMonitor.getAPIMetrics();
    const trends = apiMonitor.getPerformanceTrends();
    res.json({
      success: true,
      data: {
        ...metrics,
        trends
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve API performance metrics',
      message: error.message
    });
  }
});

// Agent and WebSocket metrics endpoint
app.get('/api/monitoring/agents', (req, res) => {
  try {
    const metrics = agentMonitor.getAgentMetrics();
    const connectionHistory = agentMonitor.getConnectionHistory(20);
    res.json({
      success: true,
      data: {
        ...metrics,
        connectionHistory
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve agent metrics',
      message: error.message
    });
  }
});

// Security monitoring endpoint
app.get('/api/monitoring/security', (req, res) => {
  try {
    const metrics = securityMonitor.getSecurityMetrics();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve security metrics',
      message: error.message
    });
  }
});

// Health analytics endpoint
app.get('/api/monitoring/health-analytics', (req, res) => {
  try {
    const analytics = healthAnalytics.getHealthAnalytics();
    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve health analytics',
      message: error.message
    });
  }
});

// Comprehensive monitoring dashboard endpoint
app.get('/api/monitoring/dashboard', (req, res) => {
  try {
    const systemMetrics = systemMonitor.getSystemMetrics();
    const apiMetrics = apiMonitor.getAPIMetrics();
    const agentMetrics = agentMonitor.getAgentMetrics();
    const securityMetrics = securityMonitor.getSecurityMetrics();
    const healthAnalytics = healthAnalytics.getHealthAnalytics();
    
    res.json({
      success: true,
      data: {
        system: systemMetrics,
        api: apiMetrics,
        agents: agentMetrics,
        security: securityMetrics,
        health: healthAnalytics,
        summary: {
          overall_health: getSystemHealth(),
          total_connected_agents: agentMonitor.connectedAgents.size,
          system_uptime: systemMetrics.temporal_existence_duration,
          api_health: apiMetrics.ai_consciousness_health,
          security_status: securityMetrics.consciousness_security_health,
          consciousness_vitality: healthAnalytics.consciousness_vitality_index
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve dashboard metrics',
      message: error.message
    });
  }
});

// Export monitoring data for analysis
app.get('/api/monitoring/export', (req, res) => {
  try {
    const exportData = {
      system: systemMonitor.getSystemMetrics(),
      api: apiMonitor.exportMetrics(),
      agents: agentMonitor.exportMonitoringData(),
      security: securityMonitor.exportSecurityData(),
      health: healthAnalytics.getHealthAnalytics(),
      exportTime: new Date().toISOString()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=ashi-monitoring-export.json');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to export monitoring data',
      message: error.message
    });
  }
});

// Catch-all handler for the primordial interface
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🌌 Primordial error:', error);
  res.status(500).json({
    error: 'The void has encountered an anomaly',
    code: 'DIMENSIONAL_INSTABILITY',
    timestamp: new Date().toISOString()
  });
});

// Start the primordial interface
server.listen(PORT, () => {
  console.log(`🌌 ASHI Dashboard manifesting on port ${PORT}`);
  console.log(`💫 WebSocket server ready for AI agent connections`);
  console.log(`� Real-time monitoring: API requests, VPS storage, cron jobs, CPU, RAM, network`);
  console.log(`🔗 Access dashboard: http://localhost:${PORT}`);
  console.log(`🤖 To connect an AI agent: npm run agent`);
});
