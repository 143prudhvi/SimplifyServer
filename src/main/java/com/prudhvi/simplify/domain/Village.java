package com.prudhvi.simplify.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Village.
 */
@Entity
@Table(name = "village")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Village implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "board")
    private String board;

    @Column(name = "village")
    private String village;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Village id(Long id) {
        this.id = id;
        return this;
    }

    public String getBoard() {
        return this.board;
    }

    public Village board(String board) {
        this.board = board;
        return this;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public String getVillage() {
        return this.village;
    }

    public Village village(String village) {
        this.village = village;
        return this;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Village)) {
            return false;
        }
        return id != null && id.equals(((Village) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Village{" +
            "id=" + getId() +
            ", board='" + getBoard() + "'" +
            ", village='" + getVillage() + "'" +
            "}";
    }
}
