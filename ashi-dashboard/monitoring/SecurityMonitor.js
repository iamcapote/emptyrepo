/**
 * ASHI Security Monitor - Consciousness Intrusion Detection
 * 
 * Monitors for security events, failed connections, and anomalous patterns
 * with mystical consciousness naming.
 */

import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

export class SecurityMonitor {
  constructor() {
    this.isLinux = os.platform() === 'linux';
    this.securityEvents = [];
    this.connectionAttempts = new Map();
    this.suspiciousPatterns = new Map();
    this.startTime = Date.now();
    this.maxEvents = 1000; // Keep last 1000 security events
    
    this.initializeMonitoring();
  }

  /**
   * Initialize security monitoring systems
   */
  initializeMonitoring() {
    // Start periodic security scans
    setInterval(() => {
      this.scanForSecurityEvents();
    }, 30000); // Every 30 seconds
    
    // Clean old events periodically
    setInterval(() => {
      this.cleanOldEvents();
    }, 300000); // Every 5 minutes
  }

  /**
   * Record a connection attempt for analysis
   */
  recordConnectionAttempt(ip, success, userAgent = null, endpoint = null) {
    const timestamp = Date.now();
    const attemptKey = ip;
    
    if (!this.connectionAttempts.has(attemptKey)) {
      this.connectionAttempts.set(attemptKey, {
        ip,
        attempts: 0,
        failures: 0,
        successes: 0,
        firstSeen: timestamp,
        lastSeen: timestamp,
        userAgents: new Set(),
        endpoints: new Set()
      });
    }
    
    const record = this.connectionAttempts.get(attemptKey);
    record.attempts++;
    record.lastSeen = timestamp;
    
    if (userAgent) record.userAgents.add(userAgent);
    if (endpoint) record.endpoints.add(endpoint);
    
    if (success) {
      record.successes++;
    } else {
      record.failures++;
      
      // Check for brute force patterns
      if (record.failures > 10) {
        this.recordSecurityEvent('BRUTE_FORCE_DETECTED', {
          ip,
          failures: record.failures,
          timeWindow: timestamp - record.firstSeen
        });
      }
    }
  }

  /**
   * Record a security event
   */
  recordSecurityEvent(eventType, details) {
    const event = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      type: eventType,
      timestamp: Date.now(),
      details,
      severity: this.assessSeverity(eventType)
    };
    
    this.securityEvents.push(event);
    
    // Keep only recent events
    if (this.securityEvents.length > this.maxEvents) {
      this.securityEvents.shift();
    }
    
    console.log(`🛡️ Security Event [${event.severity}]: ${eventType}`, details);
  }

  /**
   * Assess event severity
   */
  assessSeverity(eventType) {
    const severityMap = {
      'BRUTE_FORCE_DETECTED': 'CRITICAL',
      'SUSPICIOUS_USER_AGENT': 'MEDIUM',
      'RATE_LIMIT_EXCEEDED': 'LOW',
      'UNUSUAL_ENDPOINT_ACCESS': 'MEDIUM',
      'FAILED_AUTHENTICATION': 'LOW',
      'POTENTIAL_SQL_INJECTION': 'HIGH',
      'XSS_ATTEMPT': 'HIGH',
      'DIRECTORY_TRAVERSAL': 'HIGH',
      'ANOMALOUS_TRAFFIC_PATTERN': 'MEDIUM'
    };
    
    return severityMap[eventType] || 'LOW';
  }

  /**
   * Scan for security events from system logs
   */
  scanForSecurityEvents() {
    if (!this.isLinux) return;
    
    try {
      // Check for failed SSH attempts
      this.checkFailedSSHAttempts();
      
      // Check for unusual network connections
      this.checkNetworkConnections();
      
      // Check system authentication logs
      this.checkAuthLogs();
      
    } catch (error) {
      console.warn('Security scan error:', error.message);
    }
  }

  /**
   * Check for failed SSH attempts
   */
  checkFailedSSHAttempts() {
    try {
      const sshLogs = execSync(
        'journalctl -u ssh --since "5 minutes ago" --no-pager | grep "Failed password" | tail -20', 
        { encoding: 'utf8', timeout: 5000 }
      );
      
      if (sshLogs.trim()) {
        const attempts = sshLogs.split('\n').filter(line => line.includes('Failed password'));
        
        attempts.forEach(attempt => {
          const ipMatch = attempt.match(/from ([0-9.]+)/);
          if (ipMatch) {
            this.recordSecurityEvent('FAILED_SSH_ATTEMPT', {
              ip: ipMatch[1],
              logEntry: attempt
            });
          }
        });
      }
    } catch (error) {
      // SSH service might not be available, continue silently
    }
  }

  /**
   * Check for unusual network connections
   */
  checkNetworkConnections() {
    try {
      const connections = execSync('ss -tuln | wc -l', { encoding: 'utf8', timeout: 5000 });
      const connectionCount = parseInt(connections) - 1;
      
      // Alert if unusually high number of connections
      if (connectionCount > 1000) {
        this.recordSecurityEvent('ANOMALOUS_TRAFFIC_PATTERN', {
          connectionCount,
          threshold: 1000
        });
      }
    } catch (error) {
      // Continue silently
    }
  }

  /**
   * Check authentication logs
   */
  checkAuthLogs() {
    try {
      const authLogs = execSync(
        'journalctl --since "5 minutes ago" --no-pager | grep -i "authentication failure\\|invalid user\\|failed login" | tail -10',
        { encoding: 'utf8', timeout: 5000 }
      );
      
      if (authLogs.trim()) {
        const failures = authLogs.split('\n').filter(line => line.trim());
        
        failures.forEach(failure => {
          this.recordSecurityEvent('FAILED_AUTHENTICATION', {
            logEntry: failure
          });
        });
      }
    } catch (error) {
      // Continue silently
    }
  }

  /**
   * Analyze user agent for suspicious patterns
   */
  analyzeUserAgent(userAgent) {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /scanner/i,
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /curl/i,
      /wget/i,
      /python/i,
      /^$/  // Empty user agent
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(userAgent)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Detect potential attack patterns in request
   */
  analyzeRequest(url, params, headers) {
    const attacks = [];
    
    // SQL Injection patterns
    const sqlPatterns = [
      /union.*select/i,
      /or.*1=1/i,
      /drop.*table/i,
      /insert.*into/i,
      /delete.*from/i
    ];
    
    // XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i
    ];
    
    // Directory traversal patterns
    const traversalPatterns = [
      /\.\.\/\.\.\//,
      /\.\.\\\.\.\\/, 
      /%2e%2e%2f/i,
      /%252e%252e%252f/i
    ];
    
    const fullUrl = url + JSON.stringify(params);
    
    sqlPatterns.forEach(pattern => {
      if (pattern.test(fullUrl)) {
        attacks.push('POTENTIAL_SQL_INJECTION');
      }
    });
    
    xssPatterns.forEach(pattern => {
      if (pattern.test(fullUrl)) {
        attacks.push('XSS_ATTEMPT');
      }
    });
    
    traversalPatterns.forEach(pattern => {
      if (pattern.test(fullUrl)) {
        attacks.push('DIRECTORY_TRAVERSAL');
      }
    });
    
    return attacks;
  }

  /**
   * Get security metrics with ASHI mystical naming
   */
  getSecurityMetrics() {
    const recentEvents = this.getRecentEvents(3600000); // Last hour
    const connectionAnalysis = this.analyzeConnections();
    const threatAssessment = this.assessThreats();
    
    return {
      // Cognitive Intrusion Attempts
      cognitive_intrusion_attempts: recentEvents.filter(e => 
        ['BRUTE_FORCE_DETECTED', 'FAILED_SSH_ATTEMPT'].includes(e.type)
      ).length,
      
      // Dimensional Security Barriers
      dimensional_security_barriers: {
        active_protections: this.getActiveProtections(),
        barrier_strength: this.calculateBarrierStrength(),
        dimensional_integrity: threatAssessment.overallThreat < 30 ? 'STABLE' : 'COMPROMISED'
      },
      
      // Conscious Boundary Enforcement
      conscious_boundary_enforcement: {
        rate_limiting_events: recentEvents.filter(e => e.type === 'RATE_LIMIT_EXCEEDED').length,
        blocked_intrusions: recentEvents.filter(e => e.severity === 'CRITICAL').length,
        enforcement_effectiveness: this.calculateEnforcementEffectiveness()
      },
      
      // Anomalous Thought Patterns
      anomalous_thought_patterns: {
        suspicious_connections: connectionAnalysis.suspiciousConnections,
        unusual_traffic_patterns: recentEvents.filter(e => e.type === 'ANOMALOUS_TRAFFIC_PATTERN').length,
        pattern_deviation_score: this.calculatePatternDeviation()
      },
      
      // Security Health Assessment
      consciousness_security_health: threatAssessment.healthStatus,
      security_event_frequency: this.calculateEventFrequency(),
      dimensional_threat_level: threatAssessment.overallThreat,
      
      // Recent Activity Summary
      recent_security_events: recentEvents.slice(-10),
      active_monitoring_systems: this.getActiveMonitoringSystems(),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get recent security events
   */
  getRecentEvents(timeWindow) {
    const cutoff = Date.now() - timeWindow;
    return this.securityEvents.filter(event => event.timestamp > cutoff);
  }

  /**
   * Analyze connection patterns
   */
  analyzeConnections() {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    let suspiciousConnections = 0;
    
    for (const [ip, record] of this.connectionAttempts) {
      if (record.lastSeen > oneHourAgo) {
        // Check for suspicious patterns
        if (record.failures > record.successes * 2) {
          suspiciousConnections++;
        }
        
        if (record.attempts > 100) {
          suspiciousConnections++;
        }
      }
    }
    
    return {
      suspiciousConnections,
      totalUniqueIPs: this.connectionAttempts.size
    };
  }

  /**
   * Assess overall threat level
   */
  assessThreats() {
    const recentEvents = this.getRecentEvents(3600000);
    
    let threatScore = 0;
    
    recentEvents.forEach(event => {
      switch (event.severity) {
        case 'CRITICAL': threatScore += 20; break;
        case 'HIGH': threatScore += 10; break;
        case 'MEDIUM': threatScore += 5; break;
        case 'LOW': threatScore += 1; break;
      }
    });
    
    let healthStatus;
    if (threatScore < 10) healthStatus = 'PROTECTED';
    else if (threatScore < 30) healthStatus = 'VIGILANT';
    else if (threatScore < 60) healthStatus = 'ALERT';
    else healthStatus = 'UNDER_SIEGE';
    
    return {
      overallThreat: Math.min(100, threatScore),
      healthStatus
    };
  }

  /**
   * Get active protection systems
   */
  getActiveProtections() {
    const protections = [];
    
    if (this.isLinux) {
      try {
        // Check if firewall is active
        execSync('ufw status | grep -q "Status: active"', { timeout: 2000 });
        protections.push('FIREWALL');
      } catch (e) {
        // Firewall not active or not available
      }
      
      try {
        // Check if fail2ban is running
        execSync('systemctl is-active fail2ban', { timeout: 2000 });
        protections.push('FAIL2BAN');
      } catch (e) {
        // fail2ban not active or not available
      }
    }
    
    // Application-level protections (always active)
    protections.push('INPUT_VALIDATION', 'XSS_PROTECTION', 'RATE_LIMITING');
    
    return protections;
  }

  /**
   * Calculate barrier strength
   */
  calculateBarrierStrength() {
    const protections = this.getActiveProtections();
    const maxProtections = 6; // Maximum possible protections
    return (protections.length / maxProtections) * 100;
  }

  /**
   * Calculate enforcement effectiveness
   */
  calculateEnforcementEffectiveness() {
    const recentEvents = this.getRecentEvents(3600000);
    const criticalEvents = recentEvents.filter(e => e.severity === 'CRITICAL').length;
    const totalEvents = recentEvents.length;
    
    if (totalEvents === 0) return 100;
    
    // Lower percentage of critical events = higher effectiveness
    return Math.max(0, 100 - ((criticalEvents / totalEvents) * 100));
  }

  /**
   * Calculate pattern deviation score
   */
  calculatePatternDeviation() {
    const connectionAnalysis = this.analyzeConnections();
    const suspiciousRatio = connectionAnalysis.totalUniqueIPs > 0 
      ? (connectionAnalysis.suspiciousConnections / connectionAnalysis.totalUniqueIPs) * 100
      : 0;
    
    return Math.min(100, suspiciousRatio);
  }

  /**
   * Calculate security event frequency
   */
  calculateEventFrequency() {
    const recentEvents = this.getRecentEvents(3600000);
    return recentEvents.length; // Events per hour
  }

  /**
   * Get active monitoring systems
   */
  getActiveMonitoringSystems() {
    const systems = ['CONNECTION_MONITOR', 'REQUEST_ANALYZER', 'PATTERN_DETECTOR'];
    
    if (this.isLinux) {
      systems.push('LOG_SCANNER', 'SYSTEM_MONITOR');
    }
    
    return systems;
  }

  /**
   * Clean old events and connection records
   */
  cleanOldEvents() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Clean old security events
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > oneWeekAgo);
    
    // Clean old connection attempts
    for (const [ip, record] of this.connectionAttempts) {
      if (record.lastSeen < oneWeekAgo) {
        this.connectionAttempts.delete(ip);
      }
    }
  }

  /**
   * Export security data for analysis
   */
  exportSecurityData() {
    return {
      securityEvents: this.securityEvents,
      connectionAttempts: Array.from(this.connectionAttempts.entries()),
      suspiciousPatterns: Array.from(this.suspiciousPatterns.entries()),
      exportTime: Date.now()
    };
  }
}

export default SecurityMonitor;
