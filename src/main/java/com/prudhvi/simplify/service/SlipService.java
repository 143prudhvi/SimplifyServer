package com.prudhvi.simplify.service;

import com.prudhvi.simplify.domain.Slip;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Slip}.
 */
public interface SlipService {
    /**
     * Save a slip.
     *
     * @param slip the entity to save.
     * @return the persisted entity.
     */
    Slip save(Slip slip);

    /**
     * Partially updates a slip.
     *
     * @param slip the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Slip> partialUpdate(Slip slip);

    /**
     * Get all the slips.
     *
     * @return the list of entities.
     */
    List<Slip> findAll();

    /**
     * Get the "id" slip.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Slip> findOne(Long id);

    /**
     * Delete the "id" slip.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
