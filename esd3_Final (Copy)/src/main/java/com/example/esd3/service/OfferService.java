package com.example.esd3.service;



import com.example.esd3.entity.Employee;
import com.example.esd3.entity.Offer;
import com.example.esd3.repository.OfferRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public Offer createOffer(Offer offer, Employee employee) {

        // set createdAt and createdBy
        offer.setCreatedAt(LocalDateTime.now());
        offer.setCreatedBy(employee);

        return offerRepository.save(offer);
    }

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }
}
