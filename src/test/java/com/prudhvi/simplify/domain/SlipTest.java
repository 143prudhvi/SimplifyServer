package com.prudhvi.simplify.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.prudhvi.simplify.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SlipTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Slip.class);
        Slip slip1 = new Slip();
        slip1.setId(1L);
        Slip slip2 = new Slip();
        slip2.setId(slip1.getId());
        assertThat(slip1).isEqualTo(slip2);
        slip2.setId(2L);
        assertThat(slip1).isNotEqualTo(slip2);
        slip1.setId(null);
        assertThat(slip1).isNotEqualTo(slip2);
    }
}
