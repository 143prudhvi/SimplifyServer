package com.prudhvi.simplify.service.impl;

import com.prudhvi.simplify.domain.Tbgr;
import com.prudhvi.simplify.repository.TbgrRepository;
import com.prudhvi.simplify.service.TbgrService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tbgr}.
 */
@Service
@Transactional
public class TbgrServiceImpl implements TbgrService {

    private final Logger log = LoggerFactory.getLogger(TbgrServiceImpl.class);

    private final TbgrRepository tbgrRepository;

    public TbgrServiceImpl(TbgrRepository tbgrRepository) {
        this.tbgrRepository = tbgrRepository;
    }

    @Override
    public Tbgr save(Tbgr tbgr) {
        log.debug("Request to save Tbgr : {}", tbgr);
        return tbgrRepository.save(tbgr);
    }

    @Override
    public Optional<Tbgr> partialUpdate(Tbgr tbgr) {
        log.debug("Request to partially update Tbgr : {}", tbgr);

        return tbgrRepository
            .findById(tbgr.getId())
            .map(
                existingTbgr -> {
                    if (tbgr.getBoard() != null) {
                        existingTbgr.setBoard(tbgr.getBoard());
                    }
                    if (tbgr.getVillage() != null) {
                        existingTbgr.setVillage(tbgr.getVillage());
                    }
                    if (tbgr.getTbgr() != null) {
                        existingTbgr.setTbgr(tbgr.getTbgr());
                    }
                    if (tbgr.getName() != null) {
                        existingTbgr.setName(tbgr.getName());
                    }

                    return existingTbgr;
                }
            )
            .map(tbgrRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tbgr> findAll() {
        log.debug("Request to get all Tbgrs");
        return tbgrRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tbgr> findOne(Long id) {
        log.debug("Request to get Tbgr : {}", id);
        return tbgrRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tbgr : {}", id);
        tbgrRepository.deleteById(id);
    }
}
