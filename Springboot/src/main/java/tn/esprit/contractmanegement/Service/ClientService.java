package tn.esprit.contractmanegement.Service;

import tn.esprit.contractmanegement.Entity.Client;

import java.util.List;
import java.util.Optional;


public interface ClientService {
    Client saveClient(Client client);
    List<Client> getAllClients();
    Optional<Client> getClientById(Long id);
    void deleteClient(Long id);
}

