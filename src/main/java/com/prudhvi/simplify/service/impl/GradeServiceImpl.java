package com.prudhvi.simplify.service.impl;

import com.prudhvi.simplify.domain.Grade;
import com.prudhvi.simplify.repository.GradeRepository;
import com.prudhvi.simplify.service.GradeService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Grade}.
 */
@Service
@Transactional
public class GradeServiceImpl implements GradeService {

    private final Logger log = LoggerFactory.getLogger(GradeServiceImpl.class);

    private final GradeRepository gradeRepository;

    public GradeServiceImpl(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @Override
    public Grade save(Grade grade) {
        log.debug("Request to save Grade : {}", grade);
        return gradeRepository.save(grade);
    }

    @Override
    public Optional<Grade> partialUpdate(Grade grade) {
        log.debug("Request to partially update Grade : {}", grade);

        return gradeRepository
            .findById(grade.getId())
            .map(
                existingGrade -> {
                    if (grade.getGrade() != null) {
                        existingGrade.setGrade(grade.getGrade());
                    }

                    return existingGrade;
                }
            )
            .map(gradeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Grade> findAll() {
        log.debug("Request to get all Grades");
        return gradeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Grade> findOne(Long id) {
        log.debug("Request to get Grade : {}", id);
        return gradeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Grade : {}", id);
        gradeRepository.deleteById(id);
    }
}
