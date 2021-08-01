package com.prudhvi.simplify.service;

import com.prudhvi.simplify.domain.Grade;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Grade}.
 */
public interface GradeService {
    /**
     * Save a grade.
     *
     * @param grade the entity to save.
     * @return the persisted entity.
     */
    Grade save(Grade grade);

    /**
     * Partially updates a grade.
     *
     * @param grade the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Grade> partialUpdate(Grade grade);

    /**
     * Get all the grades.
     *
     * @return the list of entities.
     */
    List<Grade> findAll();

    /**
     * Get the "id" grade.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Grade> findOne(Long id);

    /**
     * Delete the "id" grade.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
