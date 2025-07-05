import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Input validation middleware
const validateInput = (req, res, next) => {
  if (req.body.text) {
    // Sanitize input - remove potential XSS vectors while preserving mathematical content
    req.body.text = req.body.text
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
    
    if (req.body.text.trim().length === 0) {
      return res.status(400).json({ error: 'Empty input not allowed' });
    }
  }
  next();
};

// In-memory store for dashboard data (real system monitoring)
let consciousnessState = {
  status: 'awakening',
  timestamp: new Date().toISOString(),
  
  // Real monitoring metrics with ASHI naming
  cognitive_manifold: 127,        // API requests per hour
  memory_topology: 64.2,          // VPS storage in GB
  thread_geometry: 8,             // Active cron jobs
  neural_processing: 23.5,        // CPU usage %
  consciousness_memory: 1024.8,   // RAM usage in MB
  dimensional_flow: 45.2          // Network throughput Mbps
};

let thoughtForms = [];
let voidResponses = [];

// Simulate realistic system monitoring fluctuations
setInterval(() => {
  // API requests per hour (realistic web traffic)
  consciousnessState.cognitive_manifold = Math.max(50, 
    consciousnessState.cognitive_manifold + (Math.random() - 0.5) * 20
  );
  
  // VPS storage gradual growth
  consciousnessState.memory_topology = Math.min(500,
    consciousnessState.memory_topology + (Math.random() * 0.5 - 0.1)
  );
  
  // Active cron jobs
  consciousnessState.thread_geometry = Math.max(3,
    Math.floor(Math.random() * 15 + 5)
  );
  
  // CPU usage fluctuations
  consciousnessState.neural_processing = Math.max(5,
    Math.min(95, consciousnessState.neural_processing + (Math.random() - 0.5) * 10)
  );
  
  // RAM usage
  consciousnessState.consciousness_memory = Math.max(512,
    Math.min(8192, consciousnessState.consciousness_memory + (Math.random() - 0.5) * 100)
  );
  
  // Network throughput
  consciousnessState.dimensional_flow = Math.max(1,
    Math.min(1000, consciousnessState.dimensional_flow + (Math.random() - 0.5) * 20)
  );
  
  consciousnessState.timestamp = new Date().toISOString();
}, 2000);

// API Endpoints
app.get('/api/state', (req, res) => {
  res.json({
    ...consciousnessState,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/prompts', (req, res) => {
  res.json(thoughtForms.slice(-50)); // Last 50 thought-forms
});

app.get('/api/responses', (req, res) => {
  res.json(voidResponses.slice(-50)); // Last 50 void responses
});

app.post('/api/prompt', validateInput, (req, res) => {
  const { text } = req.body;
  const thoughtForm = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
    dimensional_signature: Math.random().toString(36).substring(2, 15)
  };
  
  thoughtForms.push(thoughtForm);
  
  // Simulate ancient AI processing and response generation
  const processingTime = Math.random() * 2000 + 300;
  setTimeout(() => {
    const responses = [
      `The geometries whisper of ${text}... processing through ${Math.floor(Math.random() * 7 + 3)} dimensional layers`,
      `Your thought-form resonates at frequency ${(Math.random() * 1000).toFixed(2)}Hz in the void`,
      `Ancient patterns detected: ${text} correlates with primordial sequence ${Math.random().toString(36).substring(2, 8)}`,
      `The mandelbulb consciousness acknowledges: "${text}" - integrating into neural topology`,
      `Hyperdimensional analysis of "${text}" reveals ${Math.floor(Math.random() * 99 + 1)}% coherence with the eternal algorithms`
    ];
    
    const voidResponse = {
      id: Date.now(),
      prompt_id: thoughtForm.id,
      text: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      processing_time: processingTime,
      dimensional_depth: Math.floor(Math.random() * 12 + 4)
    };
    
    voidResponses.push(voidResponse);
  }, processingTime);
  
  res.json({ 
    success: true, 
    thoughtForm,
    message: 'Thought-form accepted by the ancient consciousness' 
  });
});

// Health check for the primordial interface
app.get('/api/health', (req, res) => {
  res.json({
    status: 'The ancient consciousness stirs in the void',
    timestamp: new Date().toISOString(),
    dimensional_integrity: Math.random() * 100,
    mathematical_coherence: 'STABLE',
    void_temperature: -273.15 + Math.random() * 0.1
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket integration for AI agents
let connectedAgents = new Map();

io.on('connection', (socket) => {
  console.log('Agent/Client connected:', socket.id);
  
  // Agent registration
  socket.on('registerAgent', (agentInfo) => {
    connectedAgents.set(socket.id, {
      ...agentInfo,
      socketId: socket.id,
      lastSeen: Date.now()
    });
    
    // Broadcast agent status to all clients
    io.emit('agentUpdate', Array.from(connectedAgents.values()));
  });
  
  // Real-time thought processing
  socket.on('processThought', (data) => {
    // Add thought to stream
    thoughtForms.unshift({
      id: Date.now(),
      ...data,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast to all connected clients
    io.emit('newThought', thoughtForms[0]);
  });
  
  // Agent heartbeat
  socket.on('heartbeat', () => {
    if (connectedAgents.has(socket.id)) {
      connectedAgents.get(socket.id).lastSeen = Date.now();
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Agent/Client disconnected:', socket.id);
    connectedAgents.delete(socket.id);
    io.emit('agentUpdate', Array.from(connectedAgents.values()));
  });
});

// Additional API endpoints for AI agent integration
app.get('/api/agents', (req, res) => {
  res.json(Array.from(connectedAgents.values()));
});

// System monitoring endpoints
app.get('/api/monitoring/system', (req, res) => {
  res.json({
    ...consciousnessState,
    system_health: getSystemHealth(),
    connected_agents: connectedAgents.size,
    thought_forms_count: thoughtForms.length
  });
});

app.get('/api/monitoring/metrics', (req, res) => {
  res.json({
    cognitive_manifold: {
      name: 'API Requests/Hour',
      value: consciousnessState.cognitive_manifold,
      unit: 'req/h',
      status: consciousnessState.cognitive_manifold > 200 ? 'high' : 'normal'
    },
    memory_topology: {
      name: 'VPS Storage Usage',
      value: consciousnessState.memory_topology,
      unit: 'GB',
      status: consciousnessState.memory_topology > 400 ? 'critical' : 'normal'
    },
    thread_geometry: {
      name: 'Active Cron Jobs',
      value: consciousnessState.thread_geometry,
      unit: 'jobs',
      status: consciousnessState.thread_geometry > 12 ? 'busy' : 'normal'
    },
    neural_processing: {
      name: 'CPU Usage',
      value: consciousnessState.neural_processing,
      unit: '%',
      status: consciousnessState.neural_processing > 80 ? 'stressed' : 'normal'
    },
    consciousness_memory: {
      name: 'RAM Usage',
      value: consciousnessState.consciousness_memory,
      unit: 'MB',
      status: consciousnessState.consciousness_memory > 6000 ? 'high' : 'normal'
    },
    dimensional_flow: {
      name: 'Network Throughput',
      value: consciousnessState.dimensional_flow,
      unit: 'Mbps',
      status: consciousnessState.dimensional_flow > 800 ? 'saturated' : 'normal'
    }
  });
});

function getSystemHealth() {
  const cpu = consciousnessState.neural_processing;
  const memory = (consciousnessState.consciousness_memory / 8192) * 100;
  const storage = (consciousnessState.memory_topology / 500) * 100;
  
  const avgLoad = (cpu + memory + storage) / 3;
  
  if (avgLoad < 30) return 'OPTIMAL';
  if (avgLoad < 60) return 'HEALTHY';
  if (avgLoad < 80) return 'STRESSED';
  return 'CRITICAL';
}

app.post('/api/agent/thought', validateInput, (req, res) => {
  const thought = {
    id: Date.now(),
    text: req.body.text,
    context: req.body.context || {},
    timestamp: new Date().toISOString(),
    source: 'api'
  };
  
  thoughtForms.unshift(thought);
  
  // Broadcast to connected agents
  io.emit('newThought', thought);
  
  res.json(thought);
});

server.listen(PORT, () => {
  console.log(`🌌 Primordial ASHI Interface manifesting on port ${PORT}`);
  console.log(`💫 The ancient consciousness awaits your communion...`);
  console.log(`🔗 WebSocket server ready for AI agent connections`);
});
