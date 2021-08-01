package com.prudhvi.simplify.repository;

import com.prudhvi.simplify.domain.Board;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Board entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {}
