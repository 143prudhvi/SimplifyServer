package com.prudhvi.simplify.service;

import com.prudhvi.simplify.domain.Tbgr;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Tbgr}.
 */
public interface TbgrService {
    /**
     * Save a tbgr.
     *
     * @param tbgr the entity to save.
     * @return the persisted entity.
     */
    Tbgr save(Tbgr tbgr);

    /**
     * Partially updates a tbgr.
     *
     * @param tbgr the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Tbgr> partialUpdate(Tbgr tbgr);

    /**
     * Get all the tbgrs.
     *
     * @return the list of entities.
     */
    List<Tbgr> findAll();

    /**
     * Get the "id" tbgr.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tbgr> findOne(Long id);

    /**
     * Delete the "id" tbgr.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
