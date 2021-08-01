package com.prudhvi.simplify.repository;

import com.prudhvi.simplify.domain.Slip;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Slip entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SlipRepository extends JpaRepository<Slip, Long> {}
