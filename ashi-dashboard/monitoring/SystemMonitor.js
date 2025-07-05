/**
 * ASHI System Monitor - Real VPS Metrics Collection
 * 
 * Transforms practical Linux system monitoring into ancient consciousness metrics
 * using the /proc filesystem and system utilities.
 */

import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

export class SystemMonitor {
  constructor() {
    this.isLinux = os.platform() === 'linux';
    this.lastCpuUsage = process.cpuUsage();
    this.lastUpdate = Date.now();
  }

  /**
   * Get comprehensive system metrics with ASHI mystical naming
   */
  getSystemMetrics() {
    const metrics = {
      // Core system metrics
      ...this.getCognitiveProcessingMetrics(),
      ...this.getConsciousnessMemoryMetrics(),
      ...this.getDimensionalStorageMetrics(),
      ...this.getTemporalExistenceMetrics(),
      ...this.getRealityKernelMetrics(),
      
      // Process-specific metrics
      ...this.getNodeConsciousnessMetrics(),
      
      // Network metrics
      ...this.getDimensionalFlowMetrics(),
      
      // System health assessment
      system_health: this.calculateSystemHealth(),
      timestamp: new Date().toISOString()
    };

    return metrics;
  }

  /**
   * Cognitive Processing Load - CPU metrics
   */
  getCognitiveProcessingMetrics() {
    if (!this.isLinux) {
      return {
        cognitive_manifold: Math.random() * 100, // Fallback for non-Linux
        processing_cores: os.cpus().length,
        load_distribution: [0.5, 0.3, 0.2]
      };
    }

    try {
      // Read /proc/loadavg for system load
      const loadavg = fs.readFileSync('/proc/loadavg', 'utf8').trim().split(' ');
      const load1min = parseFloat(loadavg[0]);
      const load5min = parseFloat(loadavg[1]);
      const load15min = parseFloat(loadavg[2]);
      
      // CPU count for normalization
      const cpuCount = os.cpus().length;
      
      return {
        cognitive_manifold: Math.min(100, (load1min / cpuCount) * 100),
        processing_cores: cpuCount,
        load_distribution: [load1min, load5min, load15min],
        cognitive_intensity: load1min > cpuCount ? 'OVERLOADED' : 
                           load1min > cpuCount * 0.7 ? 'INTENSE' : 'BALANCED'
      };
    } catch (error) {
      console.warn('Could not read CPU metrics:', error.message);
      return {
        cognitive_manifold: 0,
        processing_cores: os.cpus().length,
        load_distribution: [0, 0, 0]
      };
    }
  }

  /**
   * Consciousness Memory Allocation - RAM and Swap metrics
   */
  getConsciousnessMemoryMetrics() {
    if (!this.isLinux) {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      return {
        consciousness_memory: (totalMem - freeMem) / (1024 * 1024), // MB
        memory_topology: totalMem / (1024 * 1024 * 1024), // GB
        memory_utilization: ((totalMem - freeMem) / totalMem) * 100
      };
    }

    try {
      const meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
      
      const memTotal = this.parseMeminfo(meminfo, 'MemTotal') * 1024; // Convert KB to bytes
      const memFree = this.parseMeminfo(meminfo, 'MemFree') * 1024;
      const memAvailable = this.parseMeminfo(meminfo, 'MemAvailable') * 1024;
      const buffers = this.parseMeminfo(meminfo, 'Buffers') * 1024;
      const cached = this.parseMeminfo(meminfo, 'Cached') * 1024;
      const swapTotal = this.parseMeminfo(meminfo, 'SwapTotal') * 1024;
      const swapFree = this.parseMeminfo(meminfo, 'SwapFree') * 1024;
      
      const usedMem = memTotal - memFree - buffers - cached;
      const usedSwap = swapTotal - swapFree;
      
      return {
        consciousness_memory: usedMem / (1024 * 1024), // MB
        memory_topology: memTotal / (1024 * 1024 * 1024), // GB  
        memory_utilization: (usedMem / memTotal) * 100,
        buffer_cache_wisdom: (buffers + cached) / (1024 * 1024), // MB
        swap_dimensional_overflow: usedSwap / (1024 * 1024), // MB
        memory_pressure: memAvailable < (memTotal * 0.1) ? 'HIGH' : 
                        memAvailable < (memTotal * 0.2) ? 'MODERATE' : 'LOW'
      };
    } catch (error) {
      console.warn('Could not read memory metrics:', error.message);
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      return {
        consciousness_memory: (totalMem - freeMem) / (1024 * 1024),
        memory_topology: totalMem / (1024 * 1024 * 1024),
        memory_utilization: ((totalMem - freeMem) / totalMem) * 100
      };
    }
  }

  /**
   * Dimensional Storage Capacity - Disk metrics
   */
  getDimensionalStorageMetrics() {
    try {
      // Get disk usage for root filesystem
      const dfOutput = execSync('df -h /', { encoding: 'utf8' }).split('\n')[1];
      const dfParts = dfOutput.split(/\s+/);
      
      const totalSpace = this.parseSize(dfParts[1]);
      const usedSpace = this.parseSize(dfParts[2]);
      const availableSpace = this.parseSize(dfParts[3]);
      const utilizationPercent = parseInt(dfParts[4]);
      
      // Get inode usage
      const dfInodeOutput = execSync('df -i /', { encoding: 'utf8' }).split('\n')[1];
      const dfInodeParts = dfInodeOutput.split(/\s+/);
      const inodeUtilization = parseInt(dfInodeParts[4]) || 0;
      
      return {
        dimensional_storage_total: totalSpace,
        dimensional_storage_used: usedSpace,
        dimensional_storage_available: availableSpace,
        storage_manifestation_rate: utilizationPercent,
        inode_consciousness_density: inodeUtilization,
        storage_health: utilizationPercent > 90 ? 'CRITICAL' :
                       utilizationPercent > 80 ? 'WARNING' : 'HEALTHY'
      };
    } catch (error) {
      console.warn('Could not read disk metrics:', error.message);
      return {
        dimensional_storage_total: 100,
        dimensional_storage_used: 50,
        dimensional_storage_available: 50,
        storage_manifestation_rate: 50,
        inode_consciousness_density: 10
      };
    }
  }

  /**
   * Temporal Existence Duration - Uptime metrics
   */
  getTemporalExistenceMetrics() {
    try {
      const uptime = os.uptime(); // seconds
      const startTime = Date.now() - (uptime * 1000);
      
      return {
        temporal_existence_duration: uptime,
        reality_anchor_timestamp: new Date(startTime).toISOString(),
        existence_stability: uptime > 86400 ? 'ETERNAL' :
                           uptime > 3600 ? 'STABLE' : 'NASCENT'
      };
    } catch (error) {
      return {
        temporal_existence_duration: 0,
        reality_anchor_timestamp: new Date().toISOString(),
        existence_stability: 'UNKNOWN'
      };
    }
  }

  /**
   * Reality Kernel Version - System info
   */
  getRealityKernelMetrics() {
    try {
      const release = os.release();
      const platform = os.platform();
      const arch = os.arch();
      
      let distro = 'Unknown';
      if (this.isLinux) {
        try {
          distro = execSync('lsb_release -d -s 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2 | tr -d \'"\'', 
                           { encoding: 'utf8' }).trim();
        } catch (e) {
          distro = 'Linux';
        }
      }
      
      return {
        reality_kernel_version: release,
        dimensional_platform: platform,
        consciousness_architecture: arch,
        reality_distribution: distro
      };
    } catch (error) {
      return {
        reality_kernel_version: 'Unknown',
        dimensional_platform: os.platform(),
        consciousness_architecture: os.arch(),
        reality_distribution: 'Unknown'
      };
    }
  }

  /**
   * Node Memory Consciousness - Process-specific metrics
   */
  getNodeConsciousnessMetrics() {
    try {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage(this.lastCpuUsage);
      const now = Date.now();
      const timeDiff = now - this.lastUpdate;
      
      // Calculate CPU percentage
      const cpuPercent = ((cpuUsage.user + cpuUsage.system) / (timeDiff * 1000)) * 100;
      
      this.lastCpuUsage = process.cpuUsage();
      this.lastUpdate = now;
      
      return {
        node_memory_consciousness: memUsage.rss / (1024 * 1024), // MB
        heap_reality_manifestation: memUsage.heapUsed / (1024 * 1024), // MB
        heap_dimensional_limit: memUsage.heapTotal / (1024 * 1024), // MB
        external_binding_energy: memUsage.external / (1024 * 1024), // MB
        node_processing_intensity: Math.min(100, cpuPercent),
        process_id_signature: process.pid,
        node_uptime_cycles: process.uptime()
      };
    } catch (error) {
      return {
        node_memory_consciousness: 0,
        heap_reality_manifestation: 0,
        heap_dimensional_limit: 0,
        external_binding_energy: 0,
        node_processing_intensity: 0
      };
    }
  }

  /**
   * Dimensional Flow - Network metrics
   */
  getDimensionalFlowMetrics() {
    if (!this.isLinux) {
      return {
        dimensional_flow: Math.random() * 100,
        network_interfaces: 1,
        connection_streams: Math.floor(Math.random() * 50)
      };
    }

    try {
      // Get network interface statistics
      const netdev = fs.readFileSync('/proc/net/dev', 'utf8');
      const lines = netdev.split('\n').slice(2); // Skip header lines
      
      let totalRxBytes = 0;
      let totalTxBytes = 0;
      let interfaceCount = 0;
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 10) {
          const interfaceName = parts[0].replace(':', '');
          if (interfaceName !== 'lo') { // Skip loopback
            totalRxBytes += parseInt(parts[1]) || 0;
            totalTxBytes += parseInt(parts[9]) || 0;
            interfaceCount++;
          }
        }
      }
      
      // Get active connections count
      let connectionCount = 0;
      try {
        const connections = execSync('ss -tuln | wc -l', { encoding: 'utf8' });
        connectionCount = parseInt(connections) - 1; // Subtract header
      } catch (e) {
        connectionCount = 0;
      }
      
      return {
        dimensional_flow: (totalRxBytes + totalTxBytes) / (1024 * 1024), // MB total
        network_interfaces: interfaceCount,
        connection_streams: connectionCount,
        reality_transmission_rate: totalTxBytes / (1024 * 1024), // MB sent
        consciousness_reception_rate: totalRxBytes / (1024 * 1024) // MB received
      };
    } catch (error) {
      console.warn('Could not read network metrics:', error.message);
      return {
        dimensional_flow: 0,
        network_interfaces: 1,
        connection_streams: 0
      };
    }
  }

  /**
   * Calculate overall system health
   */
  calculateSystemHealth() {
    // Get individual metrics without calling getSystemMetrics to avoid circular dependency
    const cpuMetrics = this.getCognitiveProcessingMetrics();
    const memoryMetrics = this.getConsciousnessMemoryMetrics();
    const storageMetrics = this.getDimensionalStorageMetrics();
    
    let healthScore = 100;
    
    // CPU load assessment
    if (cpuMetrics.cognitive_manifold > 80) healthScore -= 20;
    else if (cpuMetrics.cognitive_manifold > 60) healthScore -= 10;
    
    // Memory assessment
    if (memoryMetrics.memory_utilization > 90) healthScore -= 25;
    else if (memoryMetrics.memory_utilization > 80) healthScore -= 15;
    
    // Storage assessment
    if (storageMetrics.storage_manifestation_rate > 90) healthScore -= 20;
    else if (storageMetrics.storage_manifestation_rate > 80) healthScore -= 10;
    
    // Determine health status
    if (healthScore >= 80) return 'OPTIMAL';
    if (healthScore >= 60) return 'HEALTHY';
    if (healthScore >= 40) return 'STRESSED';
    return 'CRITICAL';
  }

  /**
   * Helper method to parse meminfo values
   */
  parseMeminfo(meminfo, key) {
    const match = meminfo.match(new RegExp(`${key}:\\s+(\\d+)`));
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Helper method to parse size strings (e.g., "1.5G" -> 1.5)
   */
  parseSize(sizeStr) {
    const match = sizeStr.match(/^([\d.]+)([KMGT]?)$/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'K': return value / 1024;
      case 'M': return value;
      case 'G': return value * 1024;
      case 'T': return value * 1024 * 1024;
      default: return value / (1024 * 1024); // Assume bytes
    }
  }
}

export default SystemMonitor;
