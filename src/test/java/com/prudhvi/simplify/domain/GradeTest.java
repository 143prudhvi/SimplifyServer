package com.prudhvi.simplify.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.prudhvi.simplify.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GradeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grade.class);
        Grade grade1 = new Grade();
        grade1.setId(1L);
        Grade grade2 = new Grade();
        grade2.setId(grade1.getId());
        assertThat(grade1).isEqualTo(grade2);
        grade2.setId(2L);
        assertThat(grade1).isNotEqualTo(grade2);
        grade1.setId(null);
        assertThat(grade1).isNotEqualTo(grade2);
    }
}
