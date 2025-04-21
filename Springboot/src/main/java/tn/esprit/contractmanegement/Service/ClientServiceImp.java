package tn.esprit.contractmanegement.Service;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.contractmanegement.Entity.Client;
import tn.esprit.contractmanegement.Repository.ClientRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImp implements ClientService {

    @Autowired
    ClientRepository clientRepository;

    @Override
    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    @PostConstruct
    public void createDefaultClient() {
        if (!clientRepository.existsById(1L)) {
            Client client = new Client();
            client.setId(1L); // ID du client par défaut
            client.setNom("Client");
            client.setPrenom("Default");
            client.setEmail("client.default@mail.com");

            clientRepository.save(client);
        }
    }

}
