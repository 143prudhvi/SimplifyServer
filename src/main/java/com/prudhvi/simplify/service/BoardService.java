package com.prudhvi.simplify.service;

import com.prudhvi.simplify.domain.Board;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Board}.
 */
public interface BoardService {
    /**
     * Save a board.
     *
     * @param board the entity to save.
     * @return the persisted entity.
     */
    Board save(Board board);

    /**
     * Partially updates a board.
     *
     * @param board the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Board> partialUpdate(Board board);

    /**
     * Get all the boards.
     *
     * @return the list of entities.
     */
    List<Board> findAll();

    /**
     * Get the "id" board.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Board> findOne(Long id);

    /**
     * Delete the "id" board.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
