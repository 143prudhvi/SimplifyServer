package com.prudhvi.simplify.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.prudhvi.simplify.IntegrationTest;
import com.prudhvi.simplify.domain.Tbgr;
import com.prudhvi.simplify.repository.TbgrRepository;
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
 * Integration tests for the {@link TbgrResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TbgrResourceIT {

    private static final String DEFAULT_BOARD = "AAAAAAAAAA";
    private static final String UPDATED_BOARD = "BBBBBBBBBB";

    private static final String DEFAULT_VILLAGE = "AAAAAAAAAA";
    private static final String UPDATED_VILLAGE = "BBBBBBBBBB";

    private static final Long DEFAULT_TBGR = 1L;
    private static final Long UPDATED_TBGR = 2L;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tbgrs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TbgrRepository tbgrRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTbgrMockMvc;

    private Tbgr tbgr;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tbgr createEntity(EntityManager em) {
        Tbgr tbgr = new Tbgr().board(DEFAULT_BOARD).village(DEFAULT_VILLAGE).tbgr(DEFAULT_TBGR).name(DEFAULT_NAME);
        return tbgr;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tbgr createUpdatedEntity(EntityManager em) {
        Tbgr tbgr = new Tbgr().board(UPDATED_BOARD).village(UPDATED_VILLAGE).tbgr(UPDATED_TBGR).name(UPDATED_NAME);
        return tbgr;
    }

    @BeforeEach
    public void initTest() {
        tbgr = createEntity(em);
    }

    @Test
    @Transactional
    void createTbgr() throws Exception {
        int databaseSizeBeforeCreate = tbgrRepository.findAll().size();
        // Create the Tbgr
        restTbgrMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tbgr)))
            .andExpect(status().isCreated());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeCreate + 1);
        Tbgr testTbgr = tbgrList.get(tbgrList.size() - 1);
        assertThat(testTbgr.getBoard()).isEqualTo(DEFAULT_BOARD);
        assertThat(testTbgr.getVillage()).isEqualTo(DEFAULT_VILLAGE);
        assertThat(testTbgr.getTbgr()).isEqualTo(DEFAULT_TBGR);
        assertThat(testTbgr.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createTbgrWithExistingId() throws Exception {
        // Create the Tbgr with an existing ID
        tbgr.setId(1L);

        int databaseSizeBeforeCreate = tbgrRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTbgrMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tbgr)))
            .andExpect(status().isBadRequest());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTbgrs() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        // Get all the tbgrList
        restTbgrMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tbgr.getId().intValue())))
            .andExpect(jsonPath("$.[*].board").value(hasItem(DEFAULT_BOARD)))
            .andExpect(jsonPath("$.[*].village").value(hasItem(DEFAULT_VILLAGE)))
            .andExpect(jsonPath("$.[*].tbgr").value(hasItem(DEFAULT_TBGR.intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getTbgr() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        // Get the tbgr
        restTbgrMockMvc
            .perform(get(ENTITY_API_URL_ID, tbgr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tbgr.getId().intValue()))
            .andExpect(jsonPath("$.board").value(DEFAULT_BOARD))
            .andExpect(jsonPath("$.village").value(DEFAULT_VILLAGE))
            .andExpect(jsonPath("$.tbgr").value(DEFAULT_TBGR.intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingTbgr() throws Exception {
        // Get the tbgr
        restTbgrMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTbgr() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();

        // Update the tbgr
        Tbgr updatedTbgr = tbgrRepository.findById(tbgr.getId()).get();
        // Disconnect from session so that the updates on updatedTbgr are not directly saved in db
        em.detach(updatedTbgr);
        updatedTbgr.board(UPDATED_BOARD).village(UPDATED_VILLAGE).tbgr(UPDATED_TBGR).name(UPDATED_NAME);

        restTbgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTbgr.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTbgr))
            )
            .andExpect(status().isOk());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
        Tbgr testTbgr = tbgrList.get(tbgrList.size() - 1);
        assertThat(testTbgr.getBoard()).isEqualTo(UPDATED_BOARD);
        assertThat(testTbgr.getVillage()).isEqualTo(UPDATED_VILLAGE);
        assertThat(testTbgr.getTbgr()).isEqualTo(UPDATED_TBGR);
        assertThat(testTbgr.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tbgr.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tbgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tbgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tbgr)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTbgrWithPatch() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();

        // Update the tbgr using partial update
        Tbgr partialUpdatedTbgr = new Tbgr();
        partialUpdatedTbgr.setId(tbgr.getId());

        partialUpdatedTbgr.name(UPDATED_NAME);

        restTbgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTbgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTbgr))
            )
            .andExpect(status().isOk());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
        Tbgr testTbgr = tbgrList.get(tbgrList.size() - 1);
        assertThat(testTbgr.getBoard()).isEqualTo(DEFAULT_BOARD);
        assertThat(testTbgr.getVillage()).isEqualTo(DEFAULT_VILLAGE);
        assertThat(testTbgr.getTbgr()).isEqualTo(DEFAULT_TBGR);
        assertThat(testTbgr.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateTbgrWithPatch() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();

        // Update the tbgr using partial update
        Tbgr partialUpdatedTbgr = new Tbgr();
        partialUpdatedTbgr.setId(tbgr.getId());

        partialUpdatedTbgr.board(UPDATED_BOARD).village(UPDATED_VILLAGE).tbgr(UPDATED_TBGR).name(UPDATED_NAME);

        restTbgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTbgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTbgr))
            )
            .andExpect(status().isOk());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
        Tbgr testTbgr = tbgrList.get(tbgrList.size() - 1);
        assertThat(testTbgr.getBoard()).isEqualTo(UPDATED_BOARD);
        assertThat(testTbgr.getVillage()).isEqualTo(UPDATED_VILLAGE);
        assertThat(testTbgr.getTbgr()).isEqualTo(UPDATED_TBGR);
        assertThat(testTbgr.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tbgr.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tbgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tbgr))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTbgr() throws Exception {
        int databaseSizeBeforeUpdate = tbgrRepository.findAll().size();
        tbgr.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTbgrMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tbgr)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tbgr in the database
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTbgr() throws Exception {
        // Initialize the database
        tbgrRepository.saveAndFlush(tbgr);

        int databaseSizeBeforeDelete = tbgrRepository.findAll().size();

        // Delete the tbgr
        restTbgrMockMvc
            .perform(delete(ENTITY_API_URL_ID, tbgr.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tbgr> tbgrList = tbgrRepository.findAll();
        assertThat(tbgrList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
