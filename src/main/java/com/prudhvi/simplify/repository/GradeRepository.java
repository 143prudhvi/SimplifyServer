package com.prudhvi.simplify.repository;

import com.prudhvi.simplify.domain.Grade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Grade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {}
