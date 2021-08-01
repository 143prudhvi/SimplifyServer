package com.prudhvi.simplify.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.prudhvi.simplify.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VillageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Village.class);
        Village village1 = new Village();
        village1.setId(1L);
        Village village2 = new Village();
        village2.setId(village1.getId());
        assertThat(village1).isEqualTo(village2);
        village2.setId(2L);
        assertThat(village1).isNotEqualTo(village2);
        village1.setId(null);
        assertThat(village1).isNotEqualTo(village2);
    }
}
