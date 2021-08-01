package com.prudhvi.simplify.web.rest;

import com.prudhvi.simplify.domain.Grade;
import com.prudhvi.simplify.repository.GradeRepository;
import com.prudhvi.simplify.service.GradeService;
import com.prudhvi.simplify.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.prudhvi.simplify.domain.Grade}.
 */
@RestController
@RequestMapping("/api")
public class GradeResource {

    private final Logger log = LoggerFactory.getLogger(GradeResource.class);

    private static final String ENTITY_NAME = "grade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GradeService gradeService;

    private final GradeRepository gradeRepository;

    public GradeResource(GradeService gradeService, GradeRepository gradeRepository) {
        this.gradeService = gradeService;
        this.gradeRepository = gradeRepository;
    }

    /**
     * {@code POST  /grades} : Create a new grade.
     *
     * @param grade the grade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grade, or with status {@code 400 (Bad Request)} if the grade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grades")
    public ResponseEntity<Grade> createGrade(@RequestBody Grade grade) throws URISyntaxException {
        log.debug("REST request to save Grade : {}", grade);
        if (grade.getId() != null) {
            throw new BadRequestAlertException("A new grade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grade result = gradeService.save(grade);
        return ResponseEntity
            .created(new URI("/api/grades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grades/:id} : Updates an existing grade.
     *
     * @param id the id of the grade to save.
     * @param grade the grade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grade,
     * or with status {@code 400 (Bad Request)} if the grade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grades/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable(value = "id", required = false) final Long id, @RequestBody Grade grade)
        throws URISyntaxException {
        log.debug("REST request to update Grade : {}, {}", id, grade);
        if (grade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grade result = gradeService.save(grade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grade.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grades/:id} : Partial updates given fields of an existing grade, field will ignore if it is null
     *
     * @param id the id of the grade to save.
     * @param grade the grade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grade,
     * or with status {@code 400 (Bad Request)} if the grade is not valid,
     * or with status {@code 404 (Not Found)} if the grade is not found,
     * or with status {@code 500 (Internal Server Error)} if the grade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grades/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Grade> partialUpdateGrade(@PathVariable(value = "id", required = false) final Long id, @RequestBody Grade grade)
        throws URISyntaxException {
        log.debug("REST request to partial update Grade partially : {}, {}", id, grade);
        if (grade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gradeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grade> result = gradeService.partialUpdate(grade);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, grade.getId().toString())
        );
    }

    /**
     * {@code GET  /grades} : get all the grades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grades in body.
     */
    @GetMapping("/grades")
    public List<Grade> getAllGrades() {
        log.debug("REST request to get all Grades");
        return gradeService.findAll();
    }

    /**
     * {@code GET  /grades/:id} : get the "id" grade.
     *
     * @param id the id of the grade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grades/{id}")
    public ResponseEntity<Grade> getGrade(@PathVariable Long id) {
        log.debug("REST request to get Grade : {}", id);
        Optional<Grade> grade = gradeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(grade);
    }

    /**
     * {@code DELETE  /grades/:id} : delete the "id" grade.
     *
     * @param id the id of the grade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grades/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        log.debug("REST request to delete Grade : {}", id);
        gradeService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
