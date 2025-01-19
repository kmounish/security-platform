
import psutil
import os
import win32evtlog
import ctypes

def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False
    
def monitor_security_events():

    # Recent Securty Events
    if is_admin():
    
        handle = win32evtlog.OpenEventLog('localhost', 'Security')
        flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
        events = win32evtlog.ReadEventLog(handle, flags, 0)
    
        for event in events:
            print(f"\nEvent ID: {event.EventID}")
            print(f"Source: {event.SourceName}") 
            print(f"Time: {event.TimeGenerated}")
            print("-" * 20)
            
        win32evtlog.CloseEventLog(handle)


    # Monitor network connections
    connections = psutil.net_connections()
    suspicious_ports = [21, 22, 25, 53, 139, 80, 443, 1433, 3306, 3389]  
    open_suspicious_ports = []
    for conn in connections:
        if conn.laddr.port in suspicious_ports:
            print(f"Suspicious connection detected on port {conn.laddr.port}")
            open_suspicious_ports.append(conn.laddr.port)
    return open_suspicious_ports

def get_process_info():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_percent']):
        try:
            processes.append(proc.info)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return processes

test = monitor_security_events()

# print(test)