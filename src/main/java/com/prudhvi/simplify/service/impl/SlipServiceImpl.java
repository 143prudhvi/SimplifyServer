package com.prudhvi.simplify.service.impl;

import com.prudhvi.simplify.domain.Slip;
import com.prudhvi.simplify.repository.SlipRepository;
import com.prudhvi.simplify.service.SlipService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Slip}.
 */
@Service
@Transactional
public class SlipServiceImpl implements SlipService {

    private final Logger log = LoggerFactory.getLogger(SlipServiceImpl.class);

    private final SlipRepository slipRepository;

    public SlipServiceImpl(SlipRepository slipRepository) {
        this.slipRepository = slipRepository;
    }

    @Override
    public Slip save(Slip slip) {
        log.debug("Request to save Slip : {}", slip);
        return slipRepository.save(slip);
    }

    @Override
    public Optional<Slip> partialUpdate(Slip slip) {
        log.debug("Request to partially update Slip : {}", slip);

        return slipRepository
            .findById(slip.getId())
            .map(
                existingSlip -> {
                    if (slip.getDate() != null) {
                        existingSlip.setDate(slip.getDate());
                    }
                    if (slip.getTbgr() != null) {
                        existingSlip.setTbgr(slip.getTbgr());
                    }
                    if (slip.getGrade() != null) {
                        existingSlip.setGrade(slip.getGrade());
                    }
                    if (slip.getLotno() != null) {
                        existingSlip.setLotno(slip.getLotno());
                    }
                    if (slip.getWeight() != null) {
                        existingSlip.setWeight(slip.getWeight());
                    }
                    if (slip.getPrice() != null) {
                        existingSlip.setPrice(slip.getPrice());
                    }

                    return existingSlip;
                }
            )
            .map(slipRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Slip> findAll() {
        log.debug("Request to get all Slips");
        return slipRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Slip> findOne(Long id) {
        log.debug("Request to get Slip : {}", id);
        return slipRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Slip : {}", id);
        slipRepository.deleteById(id);
    }
}
