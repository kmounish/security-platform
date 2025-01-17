# log_collector.py
import logging
import psutil
import time
from datetime import datetime
from pathlib import Path

class LogCollector:
    def __init__(self):
        # Create logs directory if it doesn't exist
        self.log_dir = Path("logs")
        self.log_dir.mkdir(exist_ok=True)
        
        # Set up logging configuration
        self.logger = logging.getLogger("security_monitor")
        self.logger.setLevel(logging.INFO)
        
        # Create file handler
        log_file = self.log_dir / "system_logs.log"
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(
            logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        )
        self.logger.addHandler(file_handler)
    
    def collect_system_info(self):
        """Collect basic system information"""
        try:
            # CPU Usage
            cpu_percent = psutil.cpu_percent(interval=1)
            self.logger.info(f"CPU Usage: {cpu_percent}%")
            
            # Memory Usage
            memory = psutil.virtual_memory()
            self.logger.info(f"Memory Usage: {memory.percent}%")
            
            # Disk Usage
            disk = psutil.disk_usage('/')
            self.logger.info(f"Disk Usage: {disk.percent}%")
            
            # Active Network Connections
            connections = len(psutil.net_connections())
            self.logger.info(f"Active Network Connections: {connections}")
            
            return {
                "timestamp": datetime.now().isoformat(),
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "disk_percent": disk.percent,
                "network_connections": connections
            }
            
        except Exception as e:
            self.logger.error(f"Error collecting system info: {str(e)}")
            return None

if __name__ == "__main__":
    collector = LogCollector()
    
    # Continuous monitoring
    try:
        while True:
            collector.collect_system_info()
            time.sleep(60)  # Collect data every minute
    except KeyboardInterrupt:
        print("Monitoring stopped by user")