package com.prudhvi.simplify.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.prudhvi.simplify.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TbgrTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tbgr.class);
        Tbgr tbgr1 = new Tbgr();
        tbgr1.setId(1L);
        Tbgr tbgr2 = new Tbgr();
        tbgr2.setId(tbgr1.getId());
        assertThat(tbgr1).isEqualTo(tbgr2);
        tbgr2.setId(2L);
        assertThat(tbgr1).isNotEqualTo(tbgr2);
        tbgr1.setId(null);
        assertThat(tbgr1).isNotEqualTo(tbgr2);
    }
}
