package com.prudhvi.simplify.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tbgr.
 */
@Entity
@Table(name = "tbgr")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tbgr implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "board")
    private String board;

    @Column(name = "village")
    private String village;

    @Column(name = "tbgr")
    private Long tbgr;

    @Column(name = "name")
    private String name;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tbgr id(Long id) {
        this.id = id;
        return this;
    }

    public String getBoard() {
        return this.board;
    }

    public Tbgr board(String board) {
        this.board = board;
        return this;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public String getVillage() {
        return this.village;
    }

    public Tbgr village(String village) {
        this.village = village;
        return this;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public Long getTbgr() {
        return this.tbgr;
    }

    public Tbgr tbgr(Long tbgr) {
        this.tbgr = tbgr;
        return this;
    }

    public void setTbgr(Long tbgr) {
        this.tbgr = tbgr;
    }

    public String getName() {
        return this.name;
    }

    public Tbgr name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tbgr)) {
            return false;
        }
        return id != null && id.equals(((Tbgr) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tbgr{" +
            "id=" + getId() +
            ", board='" + getBoard() + "'" +
            ", village='" + getVillage() + "'" +
            ", tbgr=" + getTbgr() +
            ", name='" + getName() + "'" +
            "}";
    }
}
