package com.prudhvi.simplify.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.prudhvi.simplify.IntegrationTest;
import com.prudhvi.simplify.domain.Grade;
import com.prudhvi.simplify.repository.GradeRepository;
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
 * Integration tests for the {@link GradeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GradeResourceIT {

    private static final String DEFAULT_GRADE = "AAAAAAAAAA";
    private static final String UPDATED_GRADE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/grades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGradeMockMvc;

    private Grade grade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grade createEntity(EntityManager em) {
        Grade grade = new Grade().grade(DEFAULT_GRADE);
        return grade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grade createUpdatedEntity(EntityManager em) {
        Grade grade = new Grade().grade(UPDATED_GRADE);
        return grade;
    }

    @BeforeEach
    public void initTest() {
        grade = createEntity(em);
    }

    @Test
    @Transactional
    void createGrade() throws Exception {
        int databaseSizeBeforeCreate = gradeRepository.findAll().size();
        // Create the Grade
        restGradeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grade)))
            .andExpect(status().isCreated());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeCreate + 1);
        Grade testGrade = gradeList.get(gradeList.size() - 1);
        assertThat(testGrade.getGrade()).isEqualTo(DEFAULT_GRADE);
    }

    @Test
    @Transactional
    void createGradeWithExistingId() throws Exception {
        // Create the Grade with an existing ID
        grade.setId(1L);

        int databaseSizeBeforeCreate = gradeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGradeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grade)))
            .andExpect(status().isBadRequest());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrades() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        // Get all the gradeList
        restGradeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grade.getId().intValue())))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE)));
    }

    @Test
    @Transactional
    void getGrade() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        // Get the grade
        restGradeMockMvc
            .perform(get(ENTITY_API_URL_ID, grade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grade.getId().intValue()))
            .andExpect(jsonPath("$.grade").value(DEFAULT_GRADE));
    }

    @Test
    @Transactional
    void getNonExistingGrade() throws Exception {
        // Get the grade
        restGradeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrade() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();

        // Update the grade
        Grade updatedGrade = gradeRepository.findById(grade.getId()).get();
        // Disconnect from session so that the updates on updatedGrade are not directly saved in db
        em.detach(updatedGrade);
        updatedGrade.grade(UPDATED_GRADE);

        restGradeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrade))
            )
            .andExpect(status().isOk());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
        Grade testGrade = gradeList.get(gradeList.size() - 1);
        assertThat(testGrade.getGrade()).isEqualTo(UPDATED_GRADE);
    }

    @Test
    @Transactional
    void putNonExistingGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGradeWithPatch() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();

        // Update the grade using partial update
        Grade partialUpdatedGrade = new Grade();
        partialUpdatedGrade.setId(grade.getId());

        partialUpdatedGrade.grade(UPDATED_GRADE);

        restGradeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrade))
            )
            .andExpect(status().isOk());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
        Grade testGrade = gradeList.get(gradeList.size() - 1);
        assertThat(testGrade.getGrade()).isEqualTo(UPDATED_GRADE);
    }

    @Test
    @Transactional
    void fullUpdateGradeWithPatch() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();

        // Update the grade using partial update
        Grade partialUpdatedGrade = new Grade();
        partialUpdatedGrade.setId(grade.getId());

        partialUpdatedGrade.grade(UPDATED_GRADE);

        restGradeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrade))
            )
            .andExpect(status().isOk());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
        Grade testGrade = gradeList.get(gradeList.size() - 1);
        assertThat(testGrade.getGrade()).isEqualTo(UPDATED_GRADE);
    }

    @Test
    @Transactional
    void patchNonExistingGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrade() throws Exception {
        int databaseSizeBeforeUpdate = gradeRepository.findAll().size();
        grade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGradeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grade in the database
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrade() throws Exception {
        // Initialize the database
        gradeRepository.saveAndFlush(grade);

        int databaseSizeBeforeDelete = gradeRepository.findAll().size();

        // Delete the grade
        restGradeMockMvc
            .perform(delete(ENTITY_API_URL_ID, grade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grade> gradeList = gradeRepository.findAll();
        assertThat(gradeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
