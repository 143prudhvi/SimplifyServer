package com.prudhvi.simplify.web.rest;

import com.prudhvi.simplify.domain.Slip;
import com.prudhvi.simplify.repository.SlipRepository;
import com.prudhvi.simplify.service.SlipService;
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
 * REST controller for managing {@link com.prudhvi.simplify.domain.Slip}.
 */
@RestController
@RequestMapping("/api")
public class SlipResource {

    private final Logger log = LoggerFactory.getLogger(SlipResource.class);

    private static final String ENTITY_NAME = "slip";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SlipService slipService;

    private final SlipRepository slipRepository;

    public SlipResource(SlipService slipService, SlipRepository slipRepository) {
        this.slipService = slipService;
        this.slipRepository = slipRepository;
    }

    /**
     * {@code POST  /slips} : Create a new slip.
     *
     * @param slip the slip to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new slip, or with status {@code 400 (Bad Request)} if the slip has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/slips")
    public ResponseEntity<Slip> createSlip(@RequestBody Slip slip) throws URISyntaxException {
        log.debug("REST request to save Slip : {}", slip);
        if (slip.getId() != null) {
            throw new BadRequestAlertException("A new slip cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Slip result = slipService.save(slip);
        return ResponseEntity
            .created(new URI("/api/slips/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /slips/:id} : Updates an existing slip.
     *
     * @param id the id of the slip to save.
     * @param slip the slip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slip,
     * or with status {@code 400 (Bad Request)} if the slip is not valid,
     * or with status {@code 500 (Internal Server Error)} if the slip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/slips/{id}")
    public ResponseEntity<Slip> updateSlip(@PathVariable(value = "id", required = false) final Long id, @RequestBody Slip slip)
        throws URISyntaxException {
        log.debug("REST request to update Slip : {}, {}", id, slip);
        if (slip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Slip result = slipService.save(slip);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, slip.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /slips/:id} : Partial updates given fields of an existing slip, field will ignore if it is null
     *
     * @param id the id of the slip to save.
     * @param slip the slip to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated slip,
     * or with status {@code 400 (Bad Request)} if the slip is not valid,
     * or with status {@code 404 (Not Found)} if the slip is not found,
     * or with status {@code 500 (Internal Server Error)} if the slip couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/slips/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Slip> partialUpdateSlip(@PathVariable(value = "id", required = false) final Long id, @RequestBody Slip slip)
        throws URISyntaxException {
        log.debug("REST request to partial update Slip partially : {}, {}", id, slip);
        if (slip.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, slip.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!slipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Slip> result = slipService.partialUpdate(slip);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, slip.getId().toString())
        );
    }

    /**
     * {@code GET  /slips} : get all the slips.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of slips in body.
     */
    @GetMapping("/slips")
    public List<Slip> getAllSlips() {
        log.debug("REST request to get all Slips");
        return slipService.findAll();
    }

    /**
     * {@code GET  /slips/:id} : get the "id" slip.
     *
     * @param id the id of the slip to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the slip, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/slips/{id}")
    public ResponseEntity<Slip> getSlip(@PathVariable Long id) {
        log.debug("REST request to get Slip : {}", id);
        Optional<Slip> slip = slipService.findOne(id);
        return ResponseUtil.wrapOrNotFound(slip);
    }

    /**
     * {@code DELETE  /slips/:id} : delete the "id" slip.
     *
     * @param id the id of the slip to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/slips/{id}")
    public ResponseEntity<Void> deleteSlip(@PathVariable Long id) {
        log.debug("REST request to delete Slip : {}", id);
        slipService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
