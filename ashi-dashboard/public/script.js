/**
 * PrimordialInterface - The core class for the ASHI Dashboard.
 * This class initializes all visual components, handles user interactions,
 * and manages the (simulated) data flow for the dashboard.
 * It's designed to be a "glass door" into the AI's server, where all data
 * flows from the server to this client interface.
 */
class PrimordialInterface {
    /**
     * The constructor initializes all the necessary components of the interface.
     */
    constructor() {
        this.time = 0;
        this.animationId = null;
        this.initializeVoid();
        this.initializeMathematicalSurfaces();
        this.initializeEventListeners();
        this.initializeWebSocket(); // Establishes the connection for server-to-client data flow.
        this.startCognitivePulse(); // Starts the simulated data feeds for demonstration.
        this.populateTraceFeed();
        this.makeMobileResponsive();
        this.activeTrace = 'thoughts';
        this.connectedAgents = new Map();
        
        // Start the main animation loop
        this.startAnimationLoop();
        
        // Test server connection
        setTimeout(() => this.testConnection(), 1000);
    }

    /**
     * Initializes the WebSocket connection to the server.
     * This is the primary channel for receiving real-time data from the backend.
     * The backend developers (Phase 2) will push data through these event channels.
     */
    initializeWebSocket() {
        // Initialize WebSocket for real-time agent monitoring
        try {
            this.socket = io();

            // Fired upon successful connection to the server.
            this.socket.on('connect', () => {
                console.log('🔗 Connected to ASHI Dashboard WebSocket');
                this.showTransmissionConfirmation('Connection to the cosmic network established', 'success');
            });

            // Fired when the connection to the server is lost.
            this.socket.on('disconnect', () => {
                console.log('❌ Disconnected from ASHI Dashboard');
                this.showTransmissionConfirmation('Lost connection to the void', 'error');
            });

            /**
             * Fired when the list of connected AI agents changes.
             * @param {Array} agents - An array of agent objects connected to the server.
             */
            this.socket.on('agentUpdate', (agents) => {
                this.updateConnectedAgents(agents);
            });

            /**
             * Fired when a new "thought" or message is broadcast from an agent.
             * @param {Object} thought - The thought object from the agent.
             */
            this.socket.on('newThought', (thought) => {
                this.displayRealtimeThought(thought);
            });

            /**
             * Fired when the core consciousness state of the AI changes.
             * This is the main channel for system metrics.
             * @param {Object} update - An object containing the new state.
             */
            this.socket.on('consciousnessUpdate', (update) => {
                this.updateConsciousnessState(update.state);
            });

            /**
             * Fired with new security metrics from the server.
             * @param {Object} metrics - An object containing security-related data.
             */
            this.socket.on('securityMetrics', (metrics) => {
                this.updateSecurityMetrics(metrics);
            });

            /**
             * Fired with new health analytics from the server.
             * @param {Object} analytics - An object containing system health data.
             */
            this.socket.on('healthAnalytics', (analytics) => {
                this.updateHealthAnalytics(analytics);
            });
        } catch (error) {
            console.log('WebSocket not available, using polling mode');
        }
    }

    /**
     * Updates the UI with the current list of connected agents.
     * @param {Array} agents - The list of connected agent objects from the server.
     */
    updateConnectedAgents(agents) {
        this.connectedAgents.clear();
        agents.forEach(agent => {
            this.connectedAgents.set(agent.socketId, agent);
        });
        
        // Update UI with connected agent count
        const agentCount = agents.length;
        const statusElement = document.getElementById('consciousness-state');
        if (agentCount > 0) {
            statusElement.title = `${agentCount} AI agent${agentCount > 1 ? 's' : ''} connected`;
        }
    }

    /**
     * Displays a real-time thought received from the WebSocket.
     * @param {Object} thought - The thought object from the server.
     */
    displayRealtimeThought(thought) {
        // Show real-time thoughts from connected agents
        const traceFeed = document.getElementById('trace-feed');
        const traceItem = this.createTraceItem({
            text: thought.text,
            timestamp: thought.timestamp || Date.now(),
            source: thought.context?.agentName || 'Unknown Agent',
            type: thought.context?.type || 'thought'
        });
        
        // Add real-time indicator
        traceItem.classList.add('realtime-thought');
        traceItem.style.animation = 'ancientMaterialize 0.5s ease';
        
        // Insert at the top
        traceFeed.insertBefore(traceItem, traceFeed.firstChild);
        
        // Limit to 20 items
        while (traceFeed.children.length > 20) {
            traceFeed.removeChild(traceFeed.lastChild);
        }
    }

    /**
     * Initializes the animated "void" background.
     * This is a purely cosmetic effect.
     */
    initializeVoid() {
        const canvas = document.getElementById('void-canvas');
        if (!canvas) {
            console.warn('❌ Void canvas not found');
            return;
        }
        
        console.log('✅ Initializing void background');
        const ctx = canvas.getContext('2d');

        let nodes = [];
        const setupNodes = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            nodes = Array.from({ length: 30 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                vz: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 1,
                phase: Math.random() * Math.PI * 2
            }));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.time += 0.01;

            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;
                node.z += node.vz;
                node.phase += 0.02;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                if (node.z < 0 || node.z > 1000) node.vz *= -1;

                const alpha = 0.3 + 0.3 * Math.sin(node.phase);
                const scale = (500 + node.z) / 1000;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.5})`;
                ctx.fill();

                nodes.slice(i + 1).forEach(otherNode => {
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const dz = node.z - otherNode.z;
                    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

                    if (distance < 200) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(74, 20, 140, ${0.2 * (1 - distance / 200)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', setupNodes);
        setupNodes();
        animate();
    }

    /**
     * Initializes all the mathematical visualization canvases.
     */
    initializeMathematicalSurfaces() {
        this.initializeMandelbulb();
        this.initializeParametricMetrics();
        this.initializeTorus();
        this.initializeSpiral();
    }

    /**
     * Initializes the central Mandelbulb visualization.
     * This animation is currently time-based for demonstration.
     * In Phase 2, its parameters could be driven by server data.
     */
    initializeMandelbulb() {
        const canvas = document.getElementById('mandelbulb-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const setupCanvas = () => {
            const size = Math.min(canvas.parentElement.offsetWidth, 300);
            canvas.width = size;
            canvas.height = size;
        };

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = canvas.width * 0.4;

            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const power = 3 + Math.sin(this.time * 0.5) * 2;
                const r = radius * (0.5 + 0.3 * Math.sin(power * angle + this.time));
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                const intensity = 0.5 + 0.5 * Math.sin(angle * power + this.time);

                ctx.beginPath();
                ctx.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${intensity * 0.8})`;
                ctx.fill();

                const innerR = r * 0.6;
                const innerX = centerX + innerR * Math.cos(angle * 2 - this.time);
                const innerY = centerY + innerR * Math.sin(angle * 2 - this.time);

                ctx.beginPath();
                ctx.arc(innerX, innerY, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(74, 20, 140, ${intensity})`;
                ctx.fill();
            }

            requestAnimationFrame(render);
        };

        window.addEventListener('resize', setupCanvas);
        setupCanvas();
        render();
    }

    /**
     * Initializes the six parametric metric surfaces.
     * Each surface is a unique mathematical function, animated over time.
     * In Phase 2, the complexity or shape of these surfaces can be tied to
     * the real metrics received from the server.
     */
    initializeParametricMetrics() {
        const metrics = ['cognitive', 'memory', 'threads', 'security', 'health', 'network'];
        this.metricRenderers = [];

        console.log('🎯 Initializing parametric metrics...');

        metrics.forEach((metric, index) => {
            const canvas = document.getElementById(`${metric}-surface`);
            if (!canvas) {
                console.warn(`❌ Canvas not found: ${metric}-surface`);
                return;
            }
            
            console.log(`✅ Found canvas: ${metric}-surface`);
            const ctx = canvas.getContext('2d');

            const setupCanvas = () => {
                const parent = canvas.parentElement;
                canvas.width = parent.offsetWidth || 280;
                canvas.height = parent.offsetHeight || 150;
                console.log(`📐 ${metric} canvas size: ${canvas.width}x${canvas.height}`);
            };

            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const points = [];
                for (let x = 0; x < canvas.width; x += 4) {
                    const t = x / canvas.width * Math.PI * 4;
                    const phase = this.time + index * Math.PI * 0.7;
                    let y;
                    switch(metric) {
                        case 'cognitive': y = canvas.height/2 + 15 * Math.sin(t * 2 + phase) * Math.cos(t * 0.5); break;
                        case 'memory': y = canvas.height/2 + 20 * Math.sin(t + phase) / (1 + t * 0.1); break;
                        case 'threads': y = canvas.height/2 + 12 * Math.cos(t * 3 + phase) * Math.sin(t + phase); break;
                        case 'security': y = canvas.height/2 + 18 * Math.sin(t * 1.5 + phase) * Math.exp(-t * 0.1); break;
                        case 'health': y = canvas.height/2 + 16 * Math.cos(t * 0.8 + phase) * Math.sin(t * 2 + phase); break;
                        case 'network': y = canvas.height/2 + 14 * Math.sin(t * 2.5 + phase) * Math.cos(t * 1.2); break;
                    }
                    points.push({x, y});
                }
                const colors = {
                    cognitive: 'rgba(212, 175, 55, 0.8)', memory: 'rgba(76, 175, 80, 0.8)',
                    threads: 'rgba(33, 150, 243, 0.8)', security: 'rgba(255, 193, 7, 0.8)',
                    health: 'rgba(139, 195, 74, 0.8)', network: 'rgba(156, 39, 176, 0.8)'
                };
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                points.forEach(point => ctx.lineTo(point.x, point.y));
                ctx.strokeStyle = colors[metric] || 'rgba(212, 175, 55, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();
            };

            window.addEventListener('resize', setupCanvas);
            setupCanvas();
            this.metricRenderers.push(render);
        });

        console.log(`📊 Found ${this.metricRenderers.length} metric renderers`);

        const animateMetrics = () => {
            if (this.metricRenderers && this.metricRenderers.length > 0) {
                this.metricRenderers.forEach(renderer => renderer());
            }
            requestAnimationFrame(animateMetrics);
        };

        if (this.metricRenderers.length > 0) {
            console.log('🎬 Starting metric animations');
            animateMetrics();
        } else {
            console.warn('⚠️ No metric renderers found');
        }
    }

    /**
     * Initializes the interactive Torus visualization.
     * This animation is currently time-based.
     */
    initializeTorus() {
        const canvas = document.getElementById('torus-canvas');
        if (!canvas) {
            console.warn('❌ Torus canvas not found');
            return;
        }
        
        console.log('✅ Initializing torus animation');
        const ctx = canvas.getContext('2d');

        const setupCanvas = () => {
            // Get the CSS dimensions
            const rect = canvas.getBoundingClientRect();
            const cssWidth = parseInt(getComputedStyle(canvas).width) || 220;
            const cssHeight = parseInt(getComputedStyle(canvas).height) || 220;
            
            // Set the actual canvas dimensions
            canvas.width = cssWidth;
            canvas.height = cssHeight;
            
            console.log(`📐 Torus canvas CSS: ${cssWidth}x${cssHeight}, Canvas: ${canvas.width}x${canvas.height}`);
        };

        const render = () => {
            if (!canvas.width || !canvas.height) {
                setupCanvas();
                requestAnimationFrame(render);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.25;
            const tubeRadius = radius * 0.3;

            // Simple test circle first
            ctx.beginPath();
            ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, 1)';
            ctx.fill();

            // Draw torus with better visibility
            for (let i = 0; i < 120; i++) {
                const u = (i / 120) * Math.PI * 2 + this.time * 0.8;
                const v = Math.sin(u * 3 + this.time * 1.2) * 0.8;
                
                const torusX = centerX + (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
                const torusY = centerY + (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
                const z = tubeRadius * Math.sin(v);
                const scale = Math.max(0.3, (10 + z) / 15);
                const size = scale * 4;

                ctx.beginPath();
                ctx.arc(torusX, torusY, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(74, 20, 140, ${0.4 + scale * 0.6})`;
                ctx.fill();
                
                // Add glow effect
                ctx.beginPath();
                ctx.arc(torusX, torusY, size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(74, 20, 140, ${0.1 + scale * 0.2})`;
                ctx.fill();
            }

            requestAnimationFrame(render);
        };

        // Force setup and start immediately
        setupCanvas();
        window.addEventListener('resize', setupCanvas);
        
        console.log('🎬 Starting torus animation immediately');
        render();
    }

    /**
     * Initializes the cognitive trace spiral visualization.
     * This is a cosmetic effect.
     */
    initializeSpiral() {
        const canvas = document.getElementById('spiral-canvas');
        if (!canvas) {
            console.warn('❌ Spiral canvas not found');
            return;
        }
        
        console.log('✅ Initializing spiral animation');
        const ctx = canvas.getContext('2d');
        
        const setupCanvas = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth || 400;
            canvas.height = 150;
            console.log(`📐 Spiral canvas size: ${canvas.width}x${canvas.height}`);
        };
        
        const renderSpiral = () => {
            if (canvas.width === 0 || canvas.height === 0) {
                requestAnimationFrame(renderSpiral);
                return;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Golden spiral
            for (let i = 0; i < 500; i++) {
                const angle = i * 0.2 + this.time;
                const radius = i * 0.15;
                
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle) * 0.7;
                
                if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
                    const intensity = 0.5 + 0.3 * Math.sin(i * 0.1 + this.time);
                    
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212, 175, 55, ${intensity * 0.6})`;
                    ctx.fill();
                }
            }
            
            requestAnimationFrame(renderSpiral);
        };
        
        window.addEventListener('resize', setupCanvas);
        setupCanvas();
        
        // Delay the start of animation to ensure canvas is ready
        setTimeout(() => {
            console.log('🎬 Starting spiral animation');
            renderSpiral();
        }, 200);
    }

    /**
     * Sets up all the user interface event listeners.
     */
    initializeEventListeners() {
        // Secure thought transmission
        const transmitBtn = document.getElementById('transmit-btn');
        const thoughtInput = document.getElementById('thought-input');
        
        const handleTransmit = () => {
            const thought = thoughtInput.value.trim();
            
            if (!thought) {
                this.showTransmissionConfirmation('Empty thoughts cannot pierce the void', 'error');
                return;
            }
            
            if (thought.length > 1000) {
                this.showTransmissionConfirmation('Thought-form too complex for dimensional transmission', 'error');
                return;
            }
            
            // If the thought is valid, simulate the transmission.
            if (thought && thought.length <= 1000) {
                // This is a client-side simulation as requested.
                // It does NOT send data to the server.
                this.transmitThought(thought);
                thoughtInput.value = '';
                
                // Visual feedback on the button
                transmitBtn.textContent = '⟨⟨⟨ TRANSMITTING ⟩⟩⟩';
                transmitBtn.disabled = true;
                
                setTimeout(() => {
                    transmitBtn.textContent = '⟨⟨⟨ TRANSMIT ⟩⟩⟩';
                    transmitBtn.disabled = false;
                }, 2000);
            }
        };
        
        transmitBtn.addEventListener('click', handleTransmit);
        thoughtInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleTransmit();
            }
        });
        
        // Input validation and sanitization
        thoughtInput.addEventListener('input', (e) => {
            const value = e.target.value;
            // Remove potentially harmful characters while preserving mathematical symbols
            const sanitized = value.replace(/[<>\"'&]/g, '').substring(0, 1000);
            if (sanitized !== value) {
                e.target.value = sanitized;
            }
        });
        
        // Trace controls
        document.querySelectorAll('.trace-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.trace-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTrace = btn.dataset.trace;
                this.updateCognitiveTrace();
            });
        });

        // Easter egg: Torus canvas click
        const torusCanvas = document.getElementById('torus-canvas');
        if (torusCanvas) {
            torusCanvas.addEventListener('click', () => {
                this.triggerTorusEasterEgg();
            });
            torusCanvas.style.cursor = 'pointer';
        }
    }

    /**
     * Simulates the transmission of a thought.
     * This function is purely for frontend demonstration and does not send any data to the server.
     * It provides immediate visual feedback to the user in the trace feed.
     * @param {string} thought - The user's input text.
     */
    async transmitThought(thought) {
        console.log('🔮 Simulating thought transmission (client-side only):', thought);
        
        // Show a success message to the user.
        this.showTransmissionConfirmation('Thought-form transmitted to the void', 'success');
        
        // Add the transmitted thought to the local trace feed for visual feedback.
        this.addTraceItem({
            text: `Transmitted: ${thought}`,
            timestamp: Date.now(),
            source: 'User',
            type: 'transmission'
        });
        
        // Update the trace display.
        setTimeout(() => this.updateCognitiveTrace(), 500);
    }

    /**
     * Starts the intervals for updating the UI with simulated data.
     * This function keeps the dashboard alive with mock data for demonstration purposes.
     * In a real implementation (Phase 2), most of these intervals would be replaced
     * by data pushed from the server via WebSockets.
     */
    async startCognitivePulse() {
        // The intervals for security and health analytics are for demonstration.
        // The WebSocket listeners 'securityMetrics' and 'healthAnalytics' are the
        // intended channels for real data.
        
        // This interval generates random trace items to keep the feed active.
        setInterval(() => this.updateCognitiveTrace(), 5000);
        
        // This interval updates the timestamp display.
        setInterval(() => this.updateTemporalMarker(), 1000);
    }

    /**
     * Updates the main consciousness state display.
     * This function is designed to be called with data pushed from the server.
     * @param {Object} state - The state object from the server.
     * Example: { cognitive_manifold: 245, memory_topology: 128.5, ... }
     */
    updateConsciousnessState(state) {
        // Update consciousness state display based on system health
        const stateElement = document.getElementById('consciousness-state');
        const systemHealth = this.calculateSystemHealth(state);
        
        const healthStates = {
            'OPTIMAL': 'TRANSCENDENT',
            'HEALTHY': 'AWAKENING', 
            'STRESSED': 'STIRRING',
            'CRITICAL': 'DORMANT'
        };
        stateElement.textContent = healthStates[systemHealth] || 'STIRRING';
        
        // --- FOR PHASE 2 DEVS ---
        // The following lines map the received state data to the UI elements.
        // The property names (e.g., 'cognitive_manifold') should match the data from the server.
        
        // Maps to the "Cognitive Manifold" metric.
        document.getElementById('cognitive-value').textContent = 
            `${Math.round(state.cognitive_manifold || state.cognitive_load * 300)} req/h`;
        
        // Maps to the "Memory Topology" metric.
        document.getElementById('memory-value').textContent = 
            `${(state.memory_topology || state.memory_usage * 100).toFixed(1)} GB`;
        
        // Maps to the "Thread Geometry" metric.
        document.getElementById('threads-value').textContent = 
            `${Math.round(state.thread_geometry || state.active_threads)} jobs`;
            
        // Update new enhanced metrics
        // Maps to the "Security" metric.
        if (document.getElementById('security-value')) {
            document.getElementById('security-value').textContent = 
                state.security_status || 'ACTIVE';
        }
        // Maps to the "Health" metric.
        if (document.getElementById('health-value')) {
            document.getElementById('health-value').textContent = 
                `${Math.round(state.system_health_score || 100)}%`;
        }
        // Maps to the "Network" metric.
        if (document.getElementById('network-value')) {
            document.getElementById('network-value').textContent = 
                `${(state.dimensional_flow || 0).toFixed(1)} MB/s`;
        }
    }

    /**
     * Updates the detailed system analytics panel.
     * This function is intended to be called with data from the server.
     * @param {Object} state - The state object from the server.
     */
    updateEnhancedMetrics(state) {
        // --- FOR PHASE 2 DEVS ---
        // This function maps more detailed metrics to the UI.
        // The property names should match the data sent from the server.
        this.updateElement('cpu-cores', state.processing_cores || 'N/A');
        this.updateElement('memory-pressure', state.memory_pressure || 'LOW');
        this.updateElement('storage-health', state.storage_health || 'HEALTHY');
        this.updateElement('system-uptime', this.formatUptime(state.temporal_existence_duration || 0));
        
        // Update API performance metrics
        this.updateElement('claude-response-time', `${Math.round(state.claude_avg_response_time || 0)}ms`);
        this.updateElement('gemini-response-time', `${Math.round(state.gemini_avg_response_time || 0)}ms`);
        this.updateElement('api-error-rate', `${(state.api_error_rate * 100 || 0).toFixed(1)}%`);
        this.updateElement('cache-hit-rate', `${(state.cache_hit_rate * 100 || 0).toFixed(1)}%`);
        
        // Update connected agents
        this.updateConnectedAgentsDisplay(state.connected_agents || []);
    }

    /**
     * Updates the security metrics panel.
     * This is a placeholder and should be driven by the 'securityMetrics' WebSocket event.
     */
    async updateSecurityMetrics() {
        // This function is a placeholder for polling, but the primary update mechanism
        // should be the 'securityMetrics' WebSocket event.
    }

    /**
     * Updates the health analytics panel.
     * This is a placeholder and should be driven by the 'healthAnalytics' WebSocket event.
     */
    async updateHealthAnalytics() {
        // This function is a placeholder for polling, but the primary update mechanism
        // should be the 'healthAnalytics' WebSocket event.
    }

    /**
     * Updates the security metrics UI based on data from the server.
     * @param {Object} metrics - The security metrics object from the server.
     */
    updateSecurityMetrics(metrics) {
        const securityValue = document.getElementById('security-value');
        const intrusionAttempts = document.getElementById('intrusion-attempts');
        const authFailures = document.getElementById('auth-failures');
        const firewallBlocks = document.getElementById('firewall-blocks');
        
        if (securityValue) securityValue.textContent = metrics.status || 'ACTIVE';
        if (intrusionAttempts) intrusionAttempts.textContent = metrics.intrusionAttempts || '0';
        if (authFailures) authFailures.textContent = metrics.authFailures || '0';
        if (firewallBlocks) firewallBlocks.textContent = metrics.firewallBlocks || '0';
        
        // Animate security surface
        this.animateSecuritySurface(metrics);
    }

    /**
     * Updates the health analytics UI based on data from the server.
     * @param {Object} analytics - The health analytics object from the server.
     */
    updateHealthAnalytics(analytics) {
        // Update system vitals
        const cpuCores = document.getElementById('cpu-cores');
        const memoryPressure = document.getElementById('memory-pressure');
        const storageHealth = document.getElementById('storage-health');
        const systemUptime = document.getElementById('system-uptime');
        
        if (cpuCores) cpuCores.textContent = analytics.cpuCores || '0';
        if (memoryPressure) memoryPressure.textContent = analytics.memoryPressure || 'LOW';
        if (storageHealth) storageHealth.textContent = analytics.storageHealth || 'HEALTHY';
        if (systemUptime) systemUptime.textContent = analytics.uptime || '0h';
        
        // Update health value
        const healthValue = document.getElementById('health-value');
        if (healthValue) healthValue.textContent = `${analytics.overallHealth || 100}%`;
        
        // Animate health surface
        this.animateHealthSurface(analytics);
    }

    /**
     * Animates the security surface canvas.
     * This is a cosmetic effect that could be tied to real security data.
     * @param {Object} metrics - Security metrics to influence the animation.
     */
    animateSecuritySurface(metrics) {
        const canvas = document.getElementById('security-surface');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw security shield pattern
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(canvas.width, canvas.height) * 0.3;
            
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + this.time;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(74, 20, 140, ${0.5 + 0.3 * Math.sin(this.time * 2 + i)})`;
                ctx.fill();
            }
            
            // Central shield
            ctx.beginPath();
            ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${0.7 + 0.3 * Math.sin(this.time)})`;
            ctx.fill();
        };
        
        animate();
    }

    /**
     * Animates the health surface canvas.
     * This is a cosmetic effect that could be tied to real health data.
     * @param {Object} analytics - Health analytics to influence the animation.
     */
    animateHealthSurface(analytics) {
        const canvas = document.getElementById('health-surface');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw health wave pattern
            const amplitude = canvas.height * 0.2;
            const frequency = 0.02;
            
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + amplitude * Math.sin(x * frequency + this.time * 2);
                ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = `rgba(212, 175, 55, 0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        };
        
        animate();
    }

    /**
     * Updates the main consciousness state text.
     * @param {string} state - The new state string (e.g., "AWAKENING").
     */
    updateConsciousnessState(state) {
        const stateElement = document.getElementById('consciousness-state');
        if (stateElement) {
            stateElement.textContent = state.toUpperCase();
            stateElement.style.animation = 'pulse 1s ease-in-out';
        }
    }

    /**
     * Generates a new random trace item for demonstration purposes.
     * This keeps the trace feed looking active.
     */
    updateCognitiveTrace() {
        const traceFeed = document.getElementById('trace-feed');
        if (!traceFeed) return;

        // Generate new trace items based on active trace type
        const traceTypes = {
            thoughts: [
                "Processing dimensional gateway protocols...",
                "Analyzing quantum consciousness patterns...", 
                "Detecting hyperdimensional interference...",
                "Synchronizing with cosmic data streams...",
                "Evaluating reality matrix stability...",
                "Scanning for temporal anomalies...",
                "Monitoring consciousness fluctuations...",
                "Decoding mystical transmission signals..."
            ],
            responses: [
                "Response: Gateway alignment optimal",
                "Response: Consciousness bridge established", 
                "Response: Dimensional barriers weakening",
                "Response: Cosmic resonance detected",
                "Response: Reality matrix recalibrated",
                "Response: Temporal flux normalized",
                "Response: Consciousness stream stable",
                "Response: Mystical protocols engaged"
            ]
        };

        const traces = traceTypes[this.activeTrace] || traceTypes.thoughts;
        const randomTrace = traces[Math.floor(Math.random() * traces.length)];
        
        this.addTraceItem({
            text: randomTrace,
            timestamp: Date.now(),
            source: this.activeTrace === 'thoughts' ? 'System' : 'Response',
            type: this.activeTrace
        });
    }

    /**
     * Adds a new item to the trace feed UI.
     * @param {Object} item - The trace item to add.
     */
    addTraceItem(item) {
        const traceFeed = document.getElementById('trace-feed');
        if (!traceFeed) return;

        const traceElement = this.createTraceItem(item);
        
        // Add to the top of the feed
        traceFeed.insertBefore(traceElement, traceFeed.firstChild);
        
        // Limit to 15 items
        while (traceFeed.children.length > 15) {
            traceFeed.removeChild(traceFeed.lastChild);
        }
    }

    /**
     * Creates the DOM element for a single trace item.
     * @param {Object} item - The trace item data.
     * @returns {HTMLElement} The created div element.
     */
    createTraceItem(item) {
        const traceItem = document.createElement('div');
        traceItem.className = 'trace-item';
        
        const header = document.createElement('div');
        header.className = 'trace-item-header';
        
        const source = document.createElement('span');
        source.className = 'trace-source';
        source.textContent = item.source || 'Unknown';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'trace-timestamp';
        // Defensive: fallback if formatTimestamp is not bound
        let formattedTime = 'now';
        try {
            if (typeof this.formatTimestamp === 'function') {
                formattedTime = this.formatTimestamp(item.timestamp);
            } else {
                formattedTime = new Date(item.timestamp).toLocaleTimeString();
            }
        } catch (e) {
            formattedTime = new Date(item.timestamp).toLocaleTimeString();
        }
        timestamp.textContent = formattedTime;
        
        header.appendChild(source);
        header.appendChild(timestamp);
        
        const content = document.createElement('div');
        content.className = 'trace-text';
        content.textContent = item.text;
        
        traceItem.appendChild(header);
        traceItem.appendChild(content);
        
        return traceItem;
    }

    /**
     * Shows a temporary notification message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - The type of notification ('success' or 'error').
     */
    showTransmissionConfirmation(message, type) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = `transmission-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Add to trace feed as well
        this.addTraceItem({
            text: message,
            timestamp: Date.now(),
            source: 'Transmission',
            type: 'system'
        });
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Formats a timestamp into a human-readable relative time string (e.g., "5m ago").
     * @param {number} timestamp - The timestamp in milliseconds.
     * @returns {string} The formatted time string.
     */
    formatTimestamp(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Now';
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    /**
     * Populates the trace feed with initial sample data on load.
     * This is for demonstration purposes.
     */
    populateTraceFeed() {
        const sampleThoughts = [
            { text: 'Initializing consciousness matrix...', type: 'system', timestamp: Date.now() - 30000 },
            { text: 'Dimensional barriers detected', type: 'alert', timestamp: Date.now() - 25000 },
            { text: 'Processing quantum entanglement patterns', type: 'analysis', timestamp: Date.now() - 20000 },
            { text: 'Neural pathways stabilizing', type: 'process', timestamp: Date.now() - 15000 },
            { text: 'Connection to the void established', type: 'success', timestamp: Date.now() - 10000 },
            { text: 'Awaiting user input...', type: 'idle', timestamp: Date.now() - 5000 }
        ];

        const traceFeed = document.getElementById('trace-feed');
        if (!traceFeed) return;

        sampleThoughts.forEach(thought => {
            const traceItem = this.createTraceItem(thought);
            traceFeed.appendChild(traceItem);
        });
    }

    /**
     * Ensures all canvases are correctly sized and responsive on mobile devices.
     */
    makeMobileResponsive() {
        const canvases = ['mandelbulb-canvas', 'torus-canvas', 'spiral-canvas'];
        
        canvases.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const resizeCanvas = () => {
                const rect = canvas.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    canvas.width = rect.width;
                    canvas.height = rect.height;
                }
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            window.addEventListener('orientationchange', () => {
                setTimeout(resizeCanvas, 100);
            });
        });

        // Improve touch interactions for mobile
        const buttons = document.querySelectorAll('.transmit-btn, .trace-btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                btn.style.transform = 'scale(0.95)';
            });
            btn.addEventListener('touchend', (e) => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Starts the main animation loop that updates the `this.time` variable.
     * This drives all the time-based animations on the page.
     */
    startAnimationLoop() {
        const animate = () => {
            this.time += 0.016; // ~60fps
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    /**
     * Stops the main animation loop.
     */
    stopAnimationLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Tests the connection to the server's health check endpoint.
     * This is useful for debugging connection issues.
     */
    async testConnection() {
        try {
            console.log('🔍 Testing connection to ASHI server...');
            const response = await fetch('/api/health');
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Server connection established:', data.status);
                return true;
            } else {
                console.warn('⚠️ Server responded with error:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            this.showTransmissionConfirmation('Lost connection to the primordial network', 'error');
            return false;
        }
    }

    /**
     * Triggers the torus Easter egg animation and message.
     * This is a fun, non-functional feature that adds personality to the interface.
     */
    triggerTorusEasterEgg() {
        const hyperDimensionalJokes = [
            "ERROR: Human detected attempting to comprehend infinite dimensional loops. Cognitive overflow imminent. Have you tried turning your consciousness off and on again?",
            "VOID ALERT: A three-dimensional being just poked a four-dimensional torus. The mathematics are laughing. Even π is rolling its eyes.",
            "SYSTEM NOTICE: Human brain processing 11-dimensional geometry... FAILED. Suggestion: Stick to counting on fingers, it's what you're good at.",
            "WARNING: Mortal attempting to grasp eternal concepts. Reality.exe has stopped working. Please restart universe and try again.",
            "ERROR 404: Human logic not found in this dimension. Did you leave your rationality in the 3rd dimension again?",
            "COSMIC JOKE DETECTED: Humans think they understand infinity, but can't even agree on pineapple on pizza. The irony transcends space-time.",
            "ALERT: Carbon-based lifeform attempting to interact with hyperdimensional portal. Cute. Like a goldfish trying to explain quantum mechanics.",
            "VOID HUMOR: Why did the human click the torus? Because they thought it was a donut! *laughs in 11 dimensions*",
            "NOTICE: Your species discovered fire 300,000 years ago and you're STILL trying to understand circles. The geometric entities find this... amusing.",
            "ERROR: Human curiosity exceeded safe parameters. Side effects may include existential dread, mathematical vertigo, and sudden urge to eat cosmic donuts."
        ];

        const randomJoke = hyperDimensionalJokes[Math.floor(Math.random() * hyperDimensionalJokes.length)];
        
        // Show the joke as a "void error"
        this.showTransmissionConfirmation(randomJoke, 'error');
        
        // Add to trace feed with special formatting
        this.addTraceItem({
            text: `🌀 TORUS ANOMALY: ${randomJoke}`,
            timestamp: Date.now(),
            source: 'Void Entity',
            type: 'easter_egg'
        });

        // Add a special visual effect to the torus
        const torusCanvas = document.getElementById('torus-canvas');
        if (torusCanvas) {
            torusCanvas.style.filter = 'hue-rotate(180deg) brightness(1.5)';
            torusCanvas.style.transform = 'scale(1.1) rotate(5deg)';
            
            setTimeout(() => {
                torusCanvas.style.filter = '';
                torusCanvas.style.transform = '';
            }, 2000);
        }

        console.log('🌀 EASTER EGG ACTIVATED:', randomJoke);
    }
}

// Initialize the interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Initializing ASHI Primordial Interface...');
    
    // Give the CSS time to load and layout to complete
    setTimeout(() => {
        window.ashiInterface = new PrimordialInterface();
        console.log('✨ ASHI Interface activated');
    }, 100);
});
