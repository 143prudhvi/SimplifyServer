package com.prudhvi.simplify.repository;

import com.prudhvi.simplify.domain.Tbgr;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tbgr entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TbgrRepository extends JpaRepository<Tbgr, Long> {}
