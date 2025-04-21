package tn.esprit.contractmanegement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.LogEntry;
import tn.esprit.contractmanegement.Repository.LogEntryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogEntryService {

    @Autowired
    private LogEntryRepository logEntryRepository;

    public void logAction(String action, String description, String username, String userRole) {
        LogEntry logEntry = new LogEntry();
        logEntry.setAction(action);
        logEntry.setDescription(description);
        logEntry.setTimestamp(LocalDateTime.now());
        logEntry.setUsername(username);
        logEntry.setUserRole(userRole);
        logEntryRepository.save(logEntry);
    }

    public List<LogEntry> getAllLogs() {
        return logEntryRepository.findAll();
    }

    public List<LogEntry> getLogsByUserRole(String userRole) {
        return logEntryRepository.findByUserRole(userRole);
    }
}