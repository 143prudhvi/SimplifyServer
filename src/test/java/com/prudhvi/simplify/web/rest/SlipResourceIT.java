package com.prudhvi.simplify.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.prudhvi.simplify.IntegrationTest;
import com.prudhvi.simplify.domain.Slip;
import com.prudhvi.simplify.repository.SlipRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SlipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SlipResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_TBGR = 1L;
    private static final Long UPDATED_TBGR = 2L;

    private static final String DEFAULT_GRADE = "AAAAAAAAAA";
    private static final String UPDATED_GRADE = "BBBBBBBBBB";

    private static final Long DEFAULT_LOTNO = 1L;
    private static final Long UPDATED_LOTNO = 2L;

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    private static final Double DEFAULT_PRICE = 1D;
    private static final Double UPDATED_PRICE = 2D;

    private static final String ENTITY_API_URL = "/api/slips";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SlipRepository slipRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSlipMockMvc;

    private Slip slip;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Slip createEntity(EntityManager em) {
        Slip slip = new Slip()
            .date(DEFAULT_DATE)
            .tbgr(DEFAULT_TBGR)
            .grade(DEFAULT_GRADE)
            .lotno(DEFAULT_LOTNO)
            .weight(DEFAULT_WEIGHT)
            .price(DEFAULT_PRICE);
        return slip;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Slip createUpdatedEntity(EntityManager em) {
        Slip slip = new Slip()
            .date(UPDATED_DATE)
            .tbgr(UPDATED_TBGR)
            .grade(UPDATED_GRADE)
            .lotno(UPDATED_LOTNO)
            .weight(UPDATED_WEIGHT)
            .price(UPDATED_PRICE);
        return slip;
    }

    @BeforeEach
    public void initTest() {
        slip = createEntity(em);
    }

    @Test
    @Transactional
    void createSlip() throws Exception {
        int databaseSizeBeforeCreate = slipRepository.findAll().size();
        // Create the Slip
        restSlipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(slip)))
            .andExpect(status().isCreated());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeCreate + 1);
        Slip testSlip = slipList.get(slipList.size() - 1);
        assertThat(testSlip.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testSlip.getTbgr()).isEqualTo(DEFAULT_TBGR);
        assertThat(testSlip.getGrade()).isEqualTo(DEFAULT_GRADE);
        assertThat(testSlip.getLotno()).isEqualTo(DEFAULT_LOTNO);
        assertThat(testSlip.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testSlip.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void createSlipWithExistingId() throws Exception {
        // Create the Slip with an existing ID
        slip.setId(1L);

        int databaseSizeBeforeCreate = slipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSlipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(slip)))
            .andExpect(status().isBadRequest());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSlips() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        // Get all the slipList
        restSlipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(slip.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].tbgr").value(hasItem(DEFAULT_TBGR.intValue())))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE)))
            .andExpect(jsonPath("$.[*].lotno").value(hasItem(DEFAULT_LOTNO.intValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @Transactional
    void getSlip() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        // Get the slip
        restSlipMockMvc
            .perform(get(ENTITY_API_URL_ID, slip.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(slip.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.tbgr").value(DEFAULT_TBGR.intValue()))
            .andExpect(jsonPath("$.grade").value(DEFAULT_GRADE))
            .andExpect(jsonPath("$.lotno").value(DEFAULT_LOTNO.intValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingSlip() throws Exception {
        // Get the slip
        restSlipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSlip() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        int databaseSizeBeforeUpdate = slipRepository.findAll().size();

        // Update the slip
        Slip updatedSlip = slipRepository.findById(slip.getId()).get();
        // Disconnect from session so that the updates on updatedSlip are not directly saved in db
        em.detach(updatedSlip);
        updatedSlip
            .date(UPDATED_DATE)
            .tbgr(UPDATED_TBGR)
            .grade(UPDATED_GRADE)
            .lotno(UPDATED_LOTNO)
            .weight(UPDATED_WEIGHT)
            .price(UPDATED_PRICE);

        restSlipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSlip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSlip))
            )
            .andExpect(status().isOk());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
        Slip testSlip = slipList.get(slipList.size() - 1);
        assertThat(testSlip.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSlip.getTbgr()).isEqualTo(UPDATED_TBGR);
        assertThat(testSlip.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testSlip.getLotno()).isEqualTo(UPDATED_LOTNO);
        assertThat(testSlip.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testSlip.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void putNonExistingSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, slip.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slip))
            )
            .andExpect(status().isBadRequest());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(slip))
            )
            .andExpect(status().isBadRequest());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(slip)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSlipWithPatch() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        int databaseSizeBeforeUpdate = slipRepository.findAll().size();

        // Update the slip using partial update
        Slip partialUpdatedSlip = new Slip();
        partialUpdatedSlip.setId(slip.getId());

        partialUpdatedSlip.date(UPDATED_DATE).tbgr(UPDATED_TBGR).lotno(UPDATED_LOTNO).weight(UPDATED_WEIGHT);

        restSlipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlip))
            )
            .andExpect(status().isOk());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
        Slip testSlip = slipList.get(slipList.size() - 1);
        assertThat(testSlip.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSlip.getTbgr()).isEqualTo(UPDATED_TBGR);
        assertThat(testSlip.getGrade()).isEqualTo(DEFAULT_GRADE);
        assertThat(testSlip.getLotno()).isEqualTo(UPDATED_LOTNO);
        assertThat(testSlip.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testSlip.getPrice()).isEqualTo(DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void fullUpdateSlipWithPatch() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        int databaseSizeBeforeUpdate = slipRepository.findAll().size();

        // Update the slip using partial update
        Slip partialUpdatedSlip = new Slip();
        partialUpdatedSlip.setId(slip.getId());

        partialUpdatedSlip
            .date(UPDATED_DATE)
            .tbgr(UPDATED_TBGR)
            .grade(UPDATED_GRADE)
            .lotno(UPDATED_LOTNO)
            .weight(UPDATED_WEIGHT)
            .price(UPDATED_PRICE);

        restSlipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSlip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSlip))
            )
            .andExpect(status().isOk());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
        Slip testSlip = slipList.get(slipList.size() - 1);
        assertThat(testSlip.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testSlip.getTbgr()).isEqualTo(UPDATED_TBGR);
        assertThat(testSlip.getGrade()).isEqualTo(UPDATED_GRADE);
        assertThat(testSlip.getLotno()).isEqualTo(UPDATED_LOTNO);
        assertThat(testSlip.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testSlip.getPrice()).isEqualTo(UPDATED_PRICE);
    }

    @Test
    @Transactional
    void patchNonExistingSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, slip.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slip))
            )
            .andExpect(status().isBadRequest());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(slip))
            )
            .andExpect(status().isBadRequest());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSlip() throws Exception {
        int databaseSizeBeforeUpdate = slipRepository.findAll().size();
        slip.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSlipMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(slip)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Slip in the database
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSlip() throws Exception {
        // Initialize the database
        slipRepository.saveAndFlush(slip);

        int databaseSizeBeforeDelete = slipRepository.findAll().size();

        // Delete the slip
        restSlipMockMvc
            .perform(delete(ENTITY_API_URL_ID, slip.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Slip> slipList = slipRepository.findAll();
        assertThat(slipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
