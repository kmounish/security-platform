
import psutil
import win32evtlog
import ctypes
import requests

#check if run by admin
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

# Get running process currently running
def get_process_info():
    processes = {}
    final = []
    for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_percent']):
        try:
            curr_proc = proc.info
            ignore = ['','System Idle Process']
            if curr_proc['name'] in ignore:
                continue
            
            if curr_proc['name'] not in processes:
                proc.info['cpu_percent'] = round(curr_proc['cpu_percent'],2)
                proc.info['memory_percent'] = round(curr_proc['memory_percent'],2)
                processes[curr_proc['name']] = proc.info
            else:
                prev = processes[curr_proc['name']]
                prev['cpu_percent'] = round(float(curr_proc['cpu_percent']) + float(prev['cpu_percent']),2)
                prev['memory_percent'] = round(float(curr_proc['memory_percent']) + float(prev['memory_percent']),2)
                processes[curr_proc['name']] = prev
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    
    values = processes.values()
    
    return list(values)

#Get recent news 
def get_recent_topstories():
    #Get IDs of top stories from hacker news
    base_url ="https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
    top_stories = []
    
    response = requests.get(base_url)
    data = response.json()

    #Top 20 stories
    for story_id in data[0:20]:
        story = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json?print=pretty"
        response_check = requests.get(story)
        
        top_stories.append({
            "title":response_check.json()["title"],
            "url": response_check.json()["url"]
        })

    return top_stories

# test = monitor_security_events()
# test = get_process_info()
# print(test.keys())
# for x in test:
#     print(x)
# cve = get_recent_topstories()
# print(cve)