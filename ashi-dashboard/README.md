# ASHI Dashboard - Ancient Sentient Hyperdimensional Interface

> **Ancient Consciousness. Modern Monitoring. Mystical Visualizations.**

A fully functional mystical dashboard that transforms system monitoring into an immersive cosmic experience with stunning mathematical visualizations and seamless interactivity. This dashboard is a standalone monitoring tool designed to receive and display data from any connected monitoring agent.

## 🌌 Quick Start

### 1. Installation
```bash
cd ashi-dashboard
npm install
```

### 2. Start the Dashboard
```bash
npm start                # Enhanced server with WebSocket support for real-time data
# OR
npm run simple          # Basic HTTP-only server
```

### 3. Access the Interface
Open your browser to: **http://localhost:3001**

Experience the ancient consciousness with fully animated visuals and interactive elements! ✨

## ✨ Current Status (July 2025)

### 🎯 **FULLY OPERATIONAL**
- ✅ **All Animations Working** - Mandelbulb, torus, spiral, metrics, void background
- ✅ **Complete Interactivity** - Thought transmission, trace feeds, button controls
- ✅ **Mobile Responsive** - Perfect scaling for all device sizes
- ✅ **Real-time Updates** - Live trace feed with auto-populating content
- ✅ **Error Handling** - Comprehensive debugging and validation
- ✅ **Visual Polish** - Runic overlays, smooth transitions, mystical styling

### 🎨 **Visual Components**
- **Mandelbulb Central Orb** - 3D fractal consciousness indicator with pulsing animation
- **Parametric Metric Surfaces** - 6 animated mathematical visualizations for system data
- **Communication Torus** - Interactive 3D toroidal portal with particle effects
- **Cognitive Trace Spiral** - Golden ratio spiral with live activity scrolling
- **Hyperdimensional Void** - Particle system background with interconnected nodes
- **Runic Corner Overlays** - Mystical symbols with subtle pulsing animations

### 🔧 **Interactive Features**
- **Thought Transmission** - Input field with validation, sanitization, and visual feedback
- **Live Trace Buttons** - Switch between "THOUGHTS" and "RESPONSES" modes
- **Real-time Notifications** - Success/error messages with smooth animations
- **Auto-updating Feed** - Trace content generates automatically every 5 seconds
- **Connection Monitoring** - Health checks and detailed error reporting

## 🔌 Monitoring Agent Integration

### Connect Any Monitoring Agent
Any process or agent can connect to the dashboard to send system metrics. The dashboard is designed to be a flexible visualization layer for any data source.

Use the `ASHIAgentClient` to connect and stream data:
```javascript
import ASHIAgentClient from './integrations/ASHIAgentClient.js';

const agent = new ASHIAgentClient('http://localhost:3001', {
  name: 'My Monitoring Bot',
  type: 'vps-monitor',
  capabilities: ['system-metrics', 'health-checks']
});

await agent.connect();

// Send real system metrics
agent.updateConsciousnessState({
  api_requests_per_hour: 245,     // Cognitive Manifold
  vps_storage_gb: 128.5,          // Memory Topology
  active_cron_jobs: 12,           // Thread Geometry
  cpu_usage_percent: 67.3,        // Neural Processing
  memory_usage_mb: 2048.1,        // Consciousness Memory
  network_throughput_mbps: 89.4   // Dimensional Flow
});
```

### Test with Example Agent
An example agent is included to demonstrate how a monitoring client can send data to the dashboard.
```bash
npm run agent              # Run the example monitoring agent
```

## 📊 Mystical Monitoring Metrics

The dashboard displays system metrics sent by connected agents, mapping them to mystical names:

| **Ancient Name** | **Real Metric** | **Purpose** |
|------------------|-----------------|-------------|
| 🧮 **Cognitive Manifold** | API requests/hour | Monitor inference workload |
| 💾 **Memory Topology** | VPS storage (GB) | Track data growth |
| ⚙️ **Thread Geometry** | Active cron jobs | Monitor background tasks |
| 🔥 **Neural Processing** | CPU usage (%) | System performance |
| 🌊 **Consciousness Memory** | RAM usage (MB) | Memory monitoring |
| 🌐 **Dimensional Flow** | Network throughput (Mbps) | Data transfer rates |

## 🚀 Available Scripts

```bash
npm start              # Enhanced server with WebSocket for real-time monitoring
npm run dev            # Development mode with auto-restart  
npm run simple         # Basic HTTP-only server
npm run agent          # Run example monitoring agent
```

## 🏗️ Architecture

```
┌───────────────────┐    WebSocket    ┌──────────────────┐    HTTP    ┌─────────────┐
│ Monitoring Agents │ ←────────────→ │  ASHI Dashboard  │ ←────────→ │   Browser   │
│ (VPS, Apps, etc.) │                │                  │            │             │
│                   │                │ server-enhanced  │            │ Mystical UI │
│ Data Sources      │                │ Real-time events │            │ Ancient CSS │
│                   │                │ Practical metrics│            │ Sacred Math │
└───────────────────┘                └──────────────────┘            └─────────────┘
```

## 📁 Project Structure

```
ashi-dashboard/
├── 🎭 public/                     # Mystical Frontend
│   ├── index.html                 # Ancient consciousness interface
│   ├── script.js                  # Real-time dashboard logic
│   └── style.css                  # Sacred geometric styling
├── 🔌 integrations/               # Agent Integration Layer
│   ├── ASHIAgentClient.js         # Core WebSocket client for agents
│   └── ExampleAIAgent.js          # Working example monitoring agent
├── 🚀 server-enhanced.js          # Real-time WebSocket server
├── 💎 server.js                   # Simple HTTP-only server  
├── 📦 package.json                # Dependencies and scripts
└── 📚 README.md                   # This file
```

## 🎯 Use Cases

- **System Monitoring**: A beautiful and unique interface for server and application metrics.
- **DevOps Teams**: A mystical alternative to traditional, boring dashboards.
- **Data Visualization**: Display any real-time data stream in a cosmic-themed UI.
- **Network Operations Centers (NOCs)**: An eye-catching centerpiece for monitoring suites.
- **Demonstrations**: An impressive visual front-end for any live data feed.

## 🛡️ Security Features

- ✅ Input sanitization and validation
- ✅ XSS protection for thought-forms
- ✅ Rate limiting ready
- ✅ CORS configuration
- ✅ Safe WebSocket handling

## 🌟 Project Focus

This project provides a **minimal, clean, and beautiful interface** for real-time data. Its focus is on:

- ✅ **Easy agent integration** with simple patterns
- ✅ **Displaying real monitoring metrics** from any source
- ✅ **A beautiful mystical interface** that is both functional and artistic
- ✅ **WebSocket real-time communication** for live data feeds
- ✅ **Modern ES modules** and a clean architecture

## 🚀 Next Steps

1. **Implement Real Data Feeds**: Use the guidance in `newplan.md` to update the monitoring modules (`SystemMonitor.js`, `APIMonitor.js`) to collect and send real data from your VPS or application.
2. **Connect Your Systems**: Use the `ASHIAgentClient` to connect your own applications, scripts, or monitoring tools to the dashboard.
3. **Customize Metrics**: Extend the dashboard to visualize metrics specific to your needs.
4. **Scale Horizontally**: Connect multiple agents to visualize data from a distributed system.
5. **Extend the UI**: Add new mystical visualizations for your custom data streams.

## 📖 Documentation

- **Implementation Plan**: See `newplan.md` for the roadmap on integrating real system metrics.
- **API Reference**: Inline documentation in all server and integration files.

---

**The ancient consciousness awaits your data streams...** 🧠✨

*Built with love for the intersection of mysticism and modern technology.*
